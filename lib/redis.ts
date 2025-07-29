import type { RedisClientType } from "redis"
import { FallbackCache } from "./redis-fallback"

// Only import Redis on server side
let createClient: any = null
const redisClient: RedisClientType | null = null

// Check if we're on the server side
const isServer = typeof window === "undefined"

if (isServer) {
  try {
    const redis = require("redis")
    createClient = redis.createClient
  } catch (error) {
    console.warn("Redis not available, using fallback cache")
  }
}

class RedisManager {
  private static instance: RedisManager
  private client: RedisClientType | null = null
  private isConnecting = false
  private isAvailable = true
  private connectionPromise: Promise<RedisClientType | null> | null = null

  private constructor() {}

  static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager()
    }
    return RedisManager.instance
  }

  private getRedisConfig() {
    if (!isServer) return null

    const redisUrl = process.env.REDIS_URL

    if (!redisUrl) {
      console.warn("REDIS_URL not provided, using fallback cache")
      return null
    }

    // Handle Upstash Redis URL format
    if (redisUrl.includes("upstash.io")) {
      const match = redisUrl.match(/redis:\/\/([^:]+):([^@]+)@([^:]+):(\d+)/)
      if (match) {
        const [, username, password, host, port] = match
        return {
          socket: {
            host,
            port: Number.parseInt(port),
            tls: true,
            reconnectStrategy: (retries: number) => {
              if (retries > 3) {
                console.error("Redis reconnection failed after 3 attempts")
                return false
              }
              return Math.min(retries * 100, 3000)
            },
          },
          username,
          password,
        }
      }
    }

    // Handle standard Redis URL
    try {
      return {
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
      }
    } catch (error) {
      console.error("Invalid Redis URL format:", error)
      return null
    }
  }

  async connect(): Promise<RedisClientType | null> {
    if (!isServer || !createClient) {
      return null
    }

    // Return existing connection promise if already connecting
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    // Return existing client if already connected
    if (this.client && this.client.isOpen) {
      return this.client
    }

    // If Redis is marked as unavailable, return null
    if (!this.isAvailable) {
      return null
    }

    // Create new connection promise
    this.connectionPromise = this.createConnection()
    const result = await this.connectionPromise
    this.connectionPromise = null
    return result
  }

  private async createConnection(): Promise<RedisClientType | null> {
    if (!isServer || !createClient) {
      return null
    }

    try {
      const config = this.getRedisConfig()
      if (!config) {
        this.isAvailable = false
        return null
      }

      if (this.client) {
        try {
          await this.client.quit()
        } catch (error) {
          // Ignore quit errors
        }
      }

      this.client = createClient(config)

      // Set up event listeners
      this.client.on("error", (err: Error) => {
        console.error("Redis Client Error:", err)
        if (err.message.includes("ECONNREFUSED") || err.message.includes("Socket closed")) {
          this.isAvailable = false
        }
      })

      this.client.on("connect", () => {
        console.log("Redis connected successfully")
        this.isAvailable = true
      })

      this.client.on("disconnect", () => {
        console.log("Redis disconnected")
      })

      this.client.on("reconnecting", () => {
        console.log("Redis reconnecting...")
      })

      this.client.on("end", () => {
        console.log("Redis connection ended")
      })

      // Connect with timeout
      const connectPromise = this.client.connect()
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Redis connection timeout")), 5000)
      })

      await Promise.race([connectPromise, timeoutPromise])

      return this.client
    } catch (error) {
      console.error("Failed to connect to Redis:", error)
      this.isAvailable = false
      this.client = null
      return null
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      try {
        if (this.client.isOpen) {
          await this.client.quit()
        }
      } catch (error) {
        console.error("Error disconnecting from Redis:", error)
      } finally {
        this.client = null
      }
    }
  }

  isRedisAvailable(): boolean {
    return isServer && this.isAvailable && this.client?.isOpen === true
  }
}

// Export singleton instance
const redisManager = RedisManager.getInstance()

// Export connection function
export async function connectRedis(): Promise<RedisClientType | null> {
  if (!isServer) return null
  return redisManager.connect()
}

export async function disconnectRedis(): Promise<void> {
  if (!isServer) return
  return redisManager.disconnect()
}

export function isRedisAvailable(): boolean {
  return redisManager.isRedisAvailable()
}

// Cache utilities with improved error handling
export class RedisCache {
  private static async executeWithFallback<T>(
    operation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    operationName: string,
  ): Promise<T> {
    // Always use fallback on client side
    if (!isServer) {
      return await fallbackOperation()
    }

    try {
      const client = await connectRedis()
      if (client && client.isOpen) {
        return await operation()
      } else {
        console.warn(`Redis not available for ${operationName}, using fallback`)
        return await fallbackOperation()
      }
    } catch (error) {
      console.error(`Redis ${operationName} error, using fallback:`, error)
      return await fallbackOperation()
    }
  }

  static async get(key: string) {
    return this.executeWithFallback(
      async () => {
        const client = await connectRedis()
        if (!client) throw new Error("No Redis client")
        const value = await client.get(key)
        return value ? JSON.parse(value) : null
      },
      () => FallbackCache.get(key),
      "GET",
    )
  }

  static async set(key: string, value: any, ttl = 3600) {
    return this.executeWithFallback(
      async () => {
        const client = await connectRedis()
        if (!client) throw new Error("No Redis client")
        await client.setEx(key, ttl, JSON.stringify(value))
        return true
      },
      () => FallbackCache.set(key, value, ttl),
      "SET",
    )
  }

  static async del(key: string) {
    return this.executeWithFallback(
      async () => {
        const client = await connectRedis()
        if (!client) throw new Error("No Redis client")
        await client.del(key)
        return true
      },
      () => FallbackCache.del(key),
      "DEL",
    )
  }

  static async exists(key: string) {
    return this.executeWithFallback(
      async () => {
        const client = await connectRedis()
        if (!client) throw new Error("No Redis client")
        return await client.exists(key)
      },
      () => FallbackCache.exists(key),
      "EXISTS",
    )
  }

  // Session-specific cache methods
  static async cacheSession(userId: string, sessionData: any) {
    const key = `session:${userId}`
    return await this.set(key, sessionData, 1800) // 30 minutes
  }

  static async getCachedSession(userId: string) {
    const key = `session:${userId}`
    return await this.get(key)
  }

  static async cacheUserSessions(userId: string, sessions: any[]) {
    const key = `user_sessions:${userId}`
    return await this.set(key, sessions, 600) // 10 minutes
  }

  static async getCachedUserSessions(userId: string) {
    const key = `user_sessions:${userId}`
    return await this.get(key)
  }

  static async cacheComponent(componentId: string, componentData: any) {
    const key = `component:${componentId}`
    return await this.set(key, componentData, 3600) // 1 hour
  }

  static async getCachedComponent(componentId: string) {
    const key = `component:${componentId}`
    return await this.get(key)
  }

  static async invalidateUserCache(userId: string) {
    if (!isServer) return false

    try {
      const patterns = [`session:${userId}`, `user_sessions:${userId}`]

      // Delete individual keys
      for (const pattern of patterns) {
        await this.del(pattern)
      }

      // Handle wildcard patterns for chat history
      const client = await connectRedis()
      if (client && client.isOpen) {
        try {
          const chatKeys = await client.keys(`chat_history:${userId}:*`)
          if (chatKeys.length > 0) {
            await client.del(chatKeys)
          }
        } catch (error) {
          console.error("Error clearing chat history cache:", error)
        }
      }

      return true
    } catch (error) {
      console.error("Failed to invalidate user cache:", error)
      return false
    }
  }
}

// Graceful shutdown (only on server)
if (isServer) {
  process.on("SIGINT", async () => {
    console.log("Shutting down Redis connection...")
    await disconnectRedis()
    process.exit(0)
  })

  process.on("SIGTERM", async () => {
    console.log("Shutting down Redis connection...")
    await disconnectRedis()
    process.exit(0)
  })
}
