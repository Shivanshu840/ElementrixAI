// Client-safe cache interface - no Redis imports here
export interface CacheInterface {
  get(key: string): Promise<any>
  set(key: string, value: any, ttl?: number): Promise<boolean>
  del(key: string): Promise<boolean>
  exists(key: string): Promise<boolean>
}

// In-memory fallback cache (client-safe)
export class FallbackCache implements CacheInterface {
  private static cache = new Map<string, { value: any; expires: number }>()

  static async get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  static async set(key: string, value: any, ttl = 3600) {
    const expires = Date.now() + ttl * 1000
    this.cache.set(key, { value, expires })
    return true
  }

  static async del(key: string) {
    this.cache.delete(key)
    return true
  }

  static async exists(key: string) {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  static async clear() {
    this.cache.clear()
    return true
  }

  async get(key: string) {
    return FallbackCache.get(key)
  }

  async set(key: string, value: any, ttl = 3600) {
    return FallbackCache.set(key, value, ttl)
  }

  async del(key: string) {
    return FallbackCache.del(key)
  }

  async exists(key: string) {
    return FallbackCache.exists(key)
  }
}

// Cache service that works on both client and server
export class CacheService {
  private static instance: CacheService
  private cache: CacheInterface

  private constructor() {
    this.cache = new FallbackCache()
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService()
    }
    return CacheService.instance
  }

  async get(key: string) {
    return this.cache.get(key)
  }

  async set(key: string, value: any, ttl = 3600) {
    return this.cache.set(key, value, ttl)
  }

  async del(key: string) {
    return this.cache.del(key)
  }

  async exists(key: string) {
    return this.cache.exists(key)
  }

  // Session-specific cache methods
  async cacheSession(userId: string, sessionData: any) {
    const key = `session:${userId}`
    return await this.set(key, sessionData, 1800) // 30 minutes
  }

  async getCachedSession(userId: string) {
    const key = `session:${userId}`
    return await this.get(key)
  }

  async cacheUserSessions(userId: string, sessions: any[]) {
    const key = `user_sessions:${userId}`
    return await this.set(key, sessions, 600) // 10 minutes
  }

  async getCachedUserSessions(userId: string) {
    const key = `user_sessions:${userId}`
    return await this.get(key)
  }

  async cacheComponent(componentId: string, componentData: any) {
    const key = `component:${componentId}`
    return await this.set(key, componentData, 3600) // 1 hour
  }

  async getCachedComponent(componentId: string) {
    const key = `component:${componentId}`
    return await this.get(key)
  }

  async invalidateUserCache(userId: string) {
    try {
      const patterns = [`session:${userId}`, `user_sessions:${userId}`]

      // Delete individual keys
      for (const pattern of patterns) {
        await this.del(pattern)
      }

      return true
    } catch (error) {
      console.error("Failed to invalidate user cache:", error)
      return false
    }
  }
}

// Export singleton instance
export const cacheService = CacheService.getInstance()
