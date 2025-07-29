// Server-only Redis implementation
import type { CacheInterface } from "./cache"

const RedisClient: any = null
let createClient: any = null

// Only import Redis on server side
if (typeof window === "undefined") {
  try {
    const redis = require("redis")
    createClient = redis.createClient
  } catch (error) {
    console.warn("Redis not available, using fallback cache")
  }
}

export class RedisCache implements CacheInterface {
  private client: any = null
  private isConnected = false

  constructor() {
    if (typeof window === "undefined" && createClient) {
      this.initializeRedis()
    }
  }

  private async initializeRedis() {
    try {
      const redisUrl = process.env.REDIS_URL
      if (!redisUrl) {
        console.warn("REDIS_URL not provided")
        return
      }

      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries: number) => {
            if (retries > 3) {
              console.error("Redis reconnection failed after 3 attempts")
              return false
            }
            return Math.min(retries * 100, 3000)
          },
        },
      })

      this.client.on("error", (err: Error) => {
        console.error("Redis Client Error:", err)
        this.isConnected = false
      })

      this.client.on("connect", () => {
        console.log("Redis connected successfully")
        this.isConnected = true
      })

      await this.client.connect()
    } catch (error) {
      console.error("Failed to initialize Redis:", error)
      this.client = null
    }
  }

  async get(key: string) {
    if (!this.client || !this.isConnected) return null

    try {
      const value = await this.client.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error("Redis GET error:", error)
      return null
    }
  }

  async set(key: string, value: any, ttl = 3600) {
    if (!this.client || !this.isConnected) return false

    try {
      await this.client.setEx(key, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.error("Redis SET error:", error)
      return false
    }
  }

  async del(key: string) {
    if (!this.client || !this.isConnected) return false

    try {
      await this.client.del(key)
      return true
    } catch (error) {
      console.error("Redis DEL error:", error)
      return false
    }
  }

  async exists(key: string) {
    if (!this.client || !this.isConnected) return false

    try {
      return await this.client.exists(key)
    } catch (error) {
      console.error("Redis EXISTS error:", error)
      return false
    }
  }
}

// Create Redis instance only on server
export const redisCache = typeof window === "undefined" ? new RedisCache() : null
