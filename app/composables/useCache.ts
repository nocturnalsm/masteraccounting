export const useCache = <T>(
  namespace: string,
  options: {
    ttl?: number // Time-to-live
    maxAge?: number // Max age before forced refresh
  } = {}
) => {
  const CACHE_PREFIX = 'pinia-cache:'
  const CACHE_KEY = `${CACHE_PREFIX}${namespace}`
  
  const defaults = {
    ttl: options.ttl || 30 * 60 * 1000, // 30min
    maxAge: options.maxAge || 24 * 60 * 60 * 1000 // 24h
  }

  const getStorage = () => {
    if (typeof localStorage === 'undefined') return null
    try {
      return localStorage
    } catch {
      return null
    }
  }

  const get = (): T | null => {
    const storage = getStorage()
    if (!storage) return null

    try {
      const cached = storage.getItem(CACHE_KEY)
      if (!cached) return null

      const parsed: CachedData<T> = JSON.parse(cached)
      const now = Date.now()

      // Expired?
      if (now - parsed.timestamp > parsed.ttl) {
        storage.removeItem(CACHE_KEY)
        return null
      }

      // Too old? (stale but valid)
      if (now - parsed.timestamp > defaults.maxAge) {
        console.warn(`⚠️ Cache "${namespace}" is stale`)
      }

      return parsed.data
    } catch {
      storage.removeItem(CACHE_KEY)
      return null
    }
  }

  const set = (data: T) => {
    const storage = getStorage()
    if (!storage) return

    const cached: CachedData<T> = {
      data,
      timestamp: Date.now(),
      ttl: defaults.ttl,
      version: '1.0' // For future invalidation
    }

    try {
      storage.setItem(CACHE_KEY, JSON.stringify(cached))
    } catch (error) {
      console.warn('❌ Cache storage failed:', error)
    }
  }

  const hasValidData = () => {
    const data = get()
    return data !== null
  }

  const clear = () => {
    const storage = getStorage()
    if (storage) {
      storage.removeItem(CACHE_KEY)
    }
  }

  return {
    get,
    set,
    hasValidData,
    clear,
    isFresh: () => {
      const data = get()
      if (!data) return false
      return Date.now() - (get() as any).timestamp < defaults.maxAge
    }
  }
}

interface CachedData<T> {
  data: T
  timestamp: number
  ttl: number
  version?: string
}