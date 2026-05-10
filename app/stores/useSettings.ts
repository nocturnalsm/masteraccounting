// stores/settings.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { defu } from 'defu'

export const useSettings = defineStore('settings', () => {
  const settings = ref<Record<string, any>>({})
  const appConfig = useAppConfig()
  
  const cache = useCache<Record<string, any>>('settings', {
    ttl: 30 * 60 * 1000, 
    maxAge: 24 * 60 * 60 * 1000 
  })

  const isCacheFresh = computed(() => cache.hasValidData())

  const loadFromCache = () => {
    if (cache.hasValidData()) {
      settings.value = cache.get()!
      console.log('load from cache')
      return true
    }
    return false
  }
  
  const fetchSettings = async (forceRefresh = false) => {

    const { get } = useApi()

    try {
      settings.value = { theme: appConfig.theme }
      const remoteData = await get('user/settings')
      settings.value = defu(remoteData, settings.value)   
      cache.set(settings.value)
    } 
    catch (error) {
      console.log("Fetch failed, using local/cache state")
    }
  }

  const updateSetting = (key: string, value: any) => {
    // Local update only - will be lost on refresh unless persistSettings is called
    settings.value[key] = value
  }

  const persistSettings = async () => {
    const { post } = useApi()
    try {
      await post('user/settings', settings.value)
      cache.set(settings.value) // Update cache only on successful save
    } catch (error) {
      console.error('Failed to save settings to backend')
      throw error
    }
  }

  const resetSettings = async (key = null) => {
    // Reverts local state by re-fetching from API/Cache
    if (key){
      console.log(key)
    }
    else {
      await fetchSettings(true) 
    }
  }

  const fetchDefaults = () => {
    settings.value = defu(settings.value, appConfig.theme || {})
  }

  return {
    settings,
    isCacheFresh,
    loadFromCache,
    fetchSettings,
    persistSettings,
    updateSetting,
    resetSettings,
    fetchDefaults,
    clearCache: () => cache.clear()
  }
})