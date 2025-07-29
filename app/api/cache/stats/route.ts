import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectRedis, isRedisAvailable } from "@/lib/redis"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (isRedisAvailable()) {
      try {
        const redis = await connectRedis()
        if (redis && redis.isOpen) {
          const info = await redis.info("memory")
          const dbSize = await redis.dbSize()

          // Safely get user keys
          let userKeys: string[] = []
          try {
            userKeys = await redis.keys(`*${session.user.id}*`)
          } catch (error) {
            console.warn("Could not fetch user keys:", error)
          }

          const stats = {
            totalKeys: dbSize,
            userKeys: userKeys.length,
            memoryInfo: info.split("\n")[0] || "N/A", // Get first line of memory info
            cacheHitRate: "N/A",
            uptime: "Connected",
            isRedisAvailable: true,
            cacheType: "redis" as const,
          }

          return NextResponse.json({ stats })
        }
      } catch (error) {
        console.error("Redis stats error:", error)
      }
    }

    // Fallback stats when Redis is not available
    const fallbackStats = {
      totalKeys: 0,
      userKeys: 0,
      memoryInfo: "In-memory cache active",
      cacheHitRate: "N/A",
      uptime: "N/A",
      isRedisAvailable: false,
      cacheType: "fallback" as const,
    }

    return NextResponse.json({ stats: fallbackStats })
  } catch (error) {
    console.error("Cache stats error:", error)
    return NextResponse.json({ error: "Failed to get cache stats" }, { status: 500 })
  }
}
