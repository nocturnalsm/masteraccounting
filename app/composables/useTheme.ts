// composables/useTheme.ts
interface ThemeConfig {
  primary: string
  secondary?: string
  gray?: string
  background?: string
}

const theme = ref<ThemeConfig>({
    primary: '#0ea5e9',
    secondary: '#737373',
    gray: '#64748b',    background: 'bg-gradient-1'
})


export const useTheme = () => {
  
  // FIX: Access appConfig instead of $ui
  const appConfig = useAppConfig()

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
      
      const rgb = hexToRgb(color)
      console.log(rgb)
      if (rgb){
        const rgbValue = `${rgb.r}, ${rgb.g}, ${rgb.b}`
        el.style.setProperty(`--color-${key}-${step}`, rgbValue)
      }
    })

    const rgbUi = hexToRgb(baseHex)
    console.log(rgbUi)
    const rgbUiValue = `${rgbUi.r}, ${rgbUi.g}, ${rgbUi.b}`
    
    el.style.setProperty(`--color-${key}`, rgbUiValue)
  }

  const updateTheme = (config: Partial<ThemeConfig>) => {
    Object.assign(theme.value, config)
    
    if (config.primary) {
      injectFullScale('primary', config.primary)
      appConfig.ui.primary = 'primary'
    }
    
    if (config.secondary) {
      injectFullScale('secondary', config.secondary)
      appConfig.ui.secondary = 'secondary'
    }

    if (config.gray) {
      injectFullScale('gray', config.gray)
      appConfig.ui.gray = 'gray'
    }

    if (config.background) {
      theme.value.background = config.background
    }
  }

  const loadSavedTheme = () => {
    const saved = localStorage.getItem('custom-theme')
    if (saved) {
      const savedTheme = JSON.parse(saved) as ThemeConfig
      updateTheme(savedTheme)
    }
  }

  const saveTheme = () => {
    //localStorage.setItem('custom-theme', JSON.stringify(theme.value))
  }

  const resetTheme = () => {
    updateTheme({
      primary: '#0ea5e9',
      secondary: '#737373',
      gray: '#64748b',
      background: 'bg-gradient-1'
    })
    //localStorage.removeItem('custom-theme')
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

  const generateGrayShades = (baseColor: string): Record<string, string> => {
    const rgb = hexToRgb(baseColor)
    if (!rgb) return {}
    
    const shades: Record<string, string> = {}
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    
    steps.forEach((step, index) => {
      const factor = index / (steps.length - 1)
      const lightness = 0.95 - (factor * 0.9)
      const r = Math.round(rgb.r * lightness)
      const g = Math.round(rgb.g * lightness)
      const b = Math.round(rgb.b * lightness)
      shades[step] = rgbToHex(r, g, b)
    })
    
    return shades
  }

  // Initialize
  onMounted(() => {
    loadSavedTheme()
  })

  return {
    theme,
    updateTheme,
    saveTheme,
    resetTheme,
    loadSavedTheme
  }
}