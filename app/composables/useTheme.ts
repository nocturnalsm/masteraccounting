// composables/useTheme.ts
interface ThemeConfig {
  primary: string
  secondary?: string
  gray?: string
  background?: string,
  dark?: boolean
}

export const useTheme = () => {
    
  const appConfig = useAppConfig()
  const setting = useSettings()
  const toast = useToast()

  const injectFullScale = (key: string, baseHex: string) => {
    const el = document.documentElement
    // Define the steps Tailwind expects
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    
    steps.forEach((step) => {
      let color
      if (step < 500) {
        // Lighten for lower steps (50-400)
        const percent = (500 - step) / 500
        color = lightenColor(baseHex, percent * 0.8)
      } else if (step > 500) {
        // Darken for higher steps (600-900)
        const percent = (step - 500) / 500
        color = darkenColor(baseHex, percent * 0.4)
      } else {
        color = baseHex
      }
      
      if (color){
        el.style.setProperty(`--color-${key}-${step}`, color)
      }
    })

    if (baseHex){
      el.style.setProperty(`--color-${key}`, baseHex)
    }
  }

  const updateTheme = (config: Partial<ThemeConfig>) => {
    
    if (config.primary) {
      injectFullScale('primary', config.primary)
      setting.updateSetting('theme',  { 
        primary: config.primary 
      })
    }
    
    if (config.secondary) {
      injectFullScale('secondary', config.secondary)
      setting.updateSetting('theme',  { 
        secondary: config.secondary 
      })
    }

    if (config.gray) {
      injectFullScale('gray', config.gray)
      setting.updateSetting('theme',  { 
        gray: config.gray 
      })
    }

    if (config.background) {
      setting.updateSetting('theme',  { 
        background: config.background 
      })
    }
  }

  const loadSavedTheme = () => {
    const saved = localStorage.getItem('custom-theme')
    if (saved) {
      const savedTheme = JSON.parse(saved) as ThemeConfig
      updateTheme(savedTheme)
    }
  }

  const saveTheme = async () => {
    const { post } = useApi()
    const { settings } = setting
    const response = await post("user/settings/theme", settings.theme)
    toast.add({
      title: 'Success',
      description: `Color theme saved successfully`,
      color: 'success'
    })
  }

  // Color utilities
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    const toHex = (c: number) => c.toString(16).padStart(2, '0')
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  const lightenColor = (hex: string, percent: number) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    // Use Math.round to ensure integers
    return rgbToHex(
      Math.round(Math.min(255, rgb.r + (255 - rgb.r) * percent)),
      Math.round(Math.min(255, rgb.g + (255 - rgb.g) * percent)),
      Math.round(Math.min(255, rgb.b + (255 - rgb.b) * percent))
    )
  }

  const darkenColor = (hex: string, percent: number) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    // Use Math.round to ensure integers
    return rgbToHex(
      Math.round(Math.max(0, rgb.r - (rgb.r * percent))),
      Math.round(Math.max(0, rgb.g - (rgb.g * percent))),
      Math.round(Math.max(0, rgb.b - (rgb.b * percent)))
    )
  }  

  // Initialize
  onMounted(() => {
    loadSavedTheme()
  })

  return {
    updateTheme,
    saveTheme,
    loadSavedTheme
  }
}