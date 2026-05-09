// composables/useTheme.ts
interface ThemeConfig {
  primary: string
  secondary?: string
  gray?: string
  background?: string,
  darkMode?: boolean
}

export const useTheme = () => {
    
  const setting = useSettings()
  const toast = useToast()
  const colorMode = useColorMode()

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
    
    const currentTheme = setting.settings.theme || {}

    if (config.primary) injectFullScale('primary', config.primary)
    if (config.secondary) injectFullScale('secondary', config.secondary)
    if (config.gray) injectFullScale('gray', config.gray)

    // Update the store's generic theme key
    setting.updateSetting('theme', { ...currentTheme, ...config })

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

  const saveTheme = async () => {
    try {
      await setting.persistSettings()
      toast.add({ title: 'Success', description: 'Theme saved', color: 'success' })
    } catch (e) {
      toast.add({ title: 'Error', description: 'Failed to save', color: 'error' })
    }
  }

  const applyTheme = (theme: any) => {
    if (!theme) return
    if (theme.primary) injectFullScale('primary', theme.primary)
    if (theme.secondary) injectFullScale('secondary', theme.secondary)
    if (theme.gray) injectFullScale('gray', theme.gray)
    if (theme.darkMode) {
      colorMode.preference = theme.darkMode ? 'dark' : 'light'
    }
    if (theme.background){
      setting.updateSetting('theme', { ...theme, background: theme.background })
    }
  }

  // Watch for any change in the store's settings
  watch(
    () => setting.settings.theme,
    (newTheme) => {
      if (newTheme) applyTheme(newTheme)
    },
    { deep: true, immediate: true }
  )

  return {
    updateTheme,
    saveTheme
  }
}