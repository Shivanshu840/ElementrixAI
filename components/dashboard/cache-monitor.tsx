"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Trash2, Database, Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface CacheStats {
  totalKeys: number
  userKeys: number
  memoryInfo: string
  cacheHitRate: string
  uptime: string
  isRedisAvailable: boolean
  cacheType: "redis" | "fallback"
}

export function CacheMonitor() {
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [clearLoading, setClearLoading] = useState(false)

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/cache/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setLastUpdated(new Date())
      } else {
        throw new Error("Failed to fetch stats")
      }
    } catch (error) {
      console.error("Failed to fetch cache stats:", error)
      // Set fallback stats
      setStats({
        totalKeys: 0,
        userKeys: 0,
        memoryInfo: "Connection error",
        cacheHitRate: "N/A",
        uptime: "N/A",
        isRedisAvailable: false,
        cacheType: "fallback",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearCache = async () => {
    setClearLoading(true)
    try {
      const response = await fetch("/api/cache/clear", {
        method: "POST",
      })
      if (response.ok) {
        // Wait a moment then refresh stats
        setTimeout(() => {
          fetchStats()
        }, 1000)
      }
    } catch (error) {
      console.error("Failed to clear cache:", error)
    } finally {
      setClearLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    if (!stats) return <Database className="h-5 w-5" />
    if (stats.isRedisAvailable) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }

  const getStatusColor = () => {
    if (!stats) return "bg-gray-500"
    return stats.isRedisAvailable ? "bg-green-500" : "bg-yellow-500"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Cache Monitor
            </CardTitle>
            <CardDescription>
              {stats?.cacheType === "fallback"
                ? "Using in-memory fallback cache"
                : stats?.cacheType === "redis"
                  ? "Redis cache active and connected"
                  : "Loading cache information..."}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchStats} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={clearCache} disabled={clearLoading}>
              <Trash2 className={`h-4 w-4 ${clearLoading ? "animate-pulse" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {stats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Cache Type</p>
                <Badge variant={stats.cacheType === "redis" ? "default" : "secondary"} className="text-sm">
                  {stats.cacheType === "redis" ? "Redis" : "In-Memory"}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Total Keys</p>
                <Badge variant="secondary" className="text-sm">
                  {stats.totalKeys}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Your Keys</p>
                <Badge variant="outline" className="text-sm">
                  {stats.userKeys}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Status</p>
                <Badge variant="default" className={`text-sm ${getStatusColor()}`}>
                  {stats.isRedisAvailable ? "Connected" : "Fallback"}
                </Badge>
              </div>
            </div>

            {stats.memoryInfo && stats.memoryInfo !== "N/A" && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Memory Info</p>
                <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">{stats.memoryInfo}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">Loading cache stats...</p>
            </div>
          </div>
        )}

        {lastUpdated && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
