import { defineStore } from 'pinia'
import { defu } from 'defu' // Nuxt includes this by default

export const useSettings = defineStore('settings', () => {
  const appConfig = useAppConfig()

  const theme = ref(defu({}, appConfig.theme))

  function fetchDefaults() {    
    theme.value = defu({}, appConfig.theme)    
    console.log('Theme reset to:', theme.value.primary)
  }

  /**
   * Loads user-specific overrides from the API
   */
  async function fetchSettings() {
    const auth = useAuth()
    const { get } = useApi()

    if (!auth.isAuthenticated) {
      fetchDefaults()
      return
    }

    try {
      
      const remoteOverrides = await get('settings')
      theme.value = defu(remoteOverrides, theme.value)
      
    } catch (error) {
      console.error('API failed, keeping defaults')
      fetchDefaults()
    }
  }

  return { 
    theme, 
    fetchSettings, 
    fetchDefaults 
  
  }
})