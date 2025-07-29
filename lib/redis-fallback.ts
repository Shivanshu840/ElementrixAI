// Fallback cache implementation when Redis is not available
export class FallbackCache {
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
}
