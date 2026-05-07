// composables/useTheme.ts
interface ThemeConfig {
  primary: string
  secondary?: string
  gray?: string
  background?: string
}

export const useTheme = () => {
  const theme = ref<ThemeConfig>({
    primary: '#3b82f6',
    secondary: '#10b981',
    gray: '#6b7280',
    background: 'bg-gradient-1'
  })

  const ui = useNuxtApp().$ui

  const updateTheme = (config: Partial<ThemeConfig>) => {
    // Merge new config
    Object.assign(theme.value, config)
    
    // Update CSS variables for immediate effect
    if (config.primary) {
      document.documentElement.style.setProperty('--color-primary', config.primary)
      document.documentElement.style.setProperty('--color-primary-500', config.primary)
      // Generate variants
      document.documentElement.style.setProperty('--color-primary-50', lightenColor(config.primary, 0.95))
      document.documentElement.style.setProperty('--color-primary-600', darkenColor(config.primary, 0.1))
    }
    
    if (config.secondary) {
      document.documentElement.style.setProperty('--color-secondary', config.secondary)
    }
    
    if (config.gray) {
      const grayShades = generateGrayShades(config.gray)
      Object.entries(grayShades).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-gray-${key}`, value)
      })
    }
    
    if (config.background) {
      document.documentElement.className = config.background
    }

    // Update Nuxt UI theme configuration
    ui.config.colors = {
      primary: `var(--color-primary, ${theme.value.primary})`,
      secondary: `var(--color-secondary, ${theme.value.secondary})`,
      gray: `var(--color-gray-500, ${theme.value.gray})`
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
    localStorage.setItem('custom-theme', JSON.stringify(theme.value))
  }

  const resetTheme = () => {
    updateTheme({
      primary: '#3b82f6',
      secondary: '#10b981',
      gray: '#6b7280',
      background: 'bg-gradient-1'
    })
    localStorage.removeItem('custom-theme')
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
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  const lightenColor = (hex: string, percent: number) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    return rgbToHex(
      Math.min(255, rgb.r + (255 - rgb.r) * percent),
      Math.min(255, rgb.g + (255 - rgb.g) * percent),
      Math.min(255, rgb.b + (255 - rgb.b) * percent)
    )
  }

  const darkenColor = (hex: string, percent: number) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return hex
    return rgbToHex(
      Math.max(0, rgb.r - (rgb.r * percent)),
      Math.max(0, rgb.g - (rgb.g * percent)),
      Math.max(0, rgb.b - (rgb.b * percent))
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