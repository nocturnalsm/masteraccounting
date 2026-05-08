// stores/settings.ts
import { defineStore } from 'pinia'
import { defu } from 'defu'
import { ref, computed } from 'vue'

interface SettingsState {
  theme: {
    primary: string
    secondary: string
    gray: string
    background: string
    dark: boolean
  }  
  language: string
}

interface CachedSettings {
  data: SettingsState
  timestamp: number
  version: string // For invalidation
}

export const useSettings = defineStore('settings', () => {
  const appConfig = useAppConfig()
  
  // Core state
  const settings = ref<SettingsState>({
    theme: defu({}, appConfig.theme) as any,
    language: 'en'
  })
  
  // Persistent cache (survives refresh)
  const cache = useCache<SettingsState>('settings', {
    ttl: 30 * 60 * 1000, // 30 minutes
    maxAge: 24 * 60 * 60 * 1000 // 24h max
  })

  // Computed: Is cache fresh?
  const isCacheFresh = computed(() => {
    return cache.hasValidData()
  })

  // Load from cache first (super fast)
  const loadFromCache = () => {
    if (cache.hasValidData()) {
      console.log('✅ Loaded from CACHE (persisted)')
      settings.value = cache.get()!
      return true
    }
    return false
  }

  // 1. Try cache → 2. Try API → 3. Fallback defaults
  const fetchSettings = async (forceRefresh = false) => {
    console.log('🔄 Fetching settings...')
    
    // Skip if cached & not forcing refresh
    if (!forceRefresh && loadFromCache()) {
      return { from: 'cache' }
    }

    const auth = useAuth()
    const { get } = useApi()

    if (!auth.isAuthenticated) {
      fetchDefaults()
      cache.clear() // Clear invalid cache
      return { from: 'defaults' }
    }

    try {
      console.log('🌐 Fetching from API...')
      const remoteOverrides = await get('user/settings')
      
      // Merge with defaults
      const mergedSettings = defu(remoteOverrides, settings.value)
      settings.value = mergedSettings
      
      // ✅ CACHE IT (persists across refresh)
      cache.set(mergedSettings)
      
      console.log('✅ Cached fresh settings')
      return { from: 'api', data: mergedSettings }
      
    } catch (error) {
      console.error('❌ API failed:', error)
      
      // Try cache fallback
      if (loadFromCache()) {
        console.log('🔄 API failed → Using stale cache')
        return { from: 'cache-stale' }
      }
      
      // Final fallback
      fetchDefaults()
      return { from: 'defaults' }
    }
  }

  const fetchDefaults = () => {
    settings.value = {
      theme: defu({}, appConfig.theme) as any,
      language: 'en'
    }
  }

  // Update specific section (auto-caches)
  const updateSetting = <K extends keyof SettingsState>(
    section: K, 
    updates: Partial<SettingsState[K]>
  ) => {
    settings.value[section] = defu(updates, settings.value[section])
    
    // Auto-save to API & cache
    debounceSave()
  }

  // Optimistic updates + debounced API sync
  let saveTimeout
  const debounceSave = () => {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(async () => {
      try {
        const { post } = useApi()
        await post('user/settings', settings.value)
        cache.set(settings.value) // Update cache
        console.log('💾 Settings synced & cached')
      } catch (error) {
        console.error('❌ Save failed, keeping local cache')
      }
    }, 1000)
  }

  // Invalidation & refresh
  const invalidateCache = () => {
    cache.clear()
    fetchSettings(true)
  }

  // Auto-init on store creation
  if (process.client) {
    // Load immediately from cache (no network!)
    loadFromCache()
    
    // Background refresh if stale
    if (!isCacheFresh.value) {
      fetchSettings().catch(console.error)
    }
  }

  return {
    settings,
    isCacheFresh,
    fetchSettings,
    fetchDefaults,
    updateSetting,
    invalidateCache,
    clearCache: () => cache.clear()
  }
})