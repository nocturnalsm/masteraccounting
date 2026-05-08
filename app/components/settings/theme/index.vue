<template>
  <div class="min-h-screen p-8">
    <!-- Your app layout with UApp -->
    <div class="w-full mx-auto">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Color Theme</h3>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">          
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Background Color</h2>
          </template>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <UButton
              v-for="bg in backgrounds"
              :key="bg.value"
              :class="bg.value"
              variant="ghost"
              size="sm"
              @click="setBackground(bg.value)"
              class="h-20 rounded-xl shadow-md hover:shadow-xl relative overflow-hidden"
            >
              <div class="text-xs font-medium text-white/90 drop-shadow-md">
                {{ bg.label }}
              </div>
            </UButton>
          </div>
        </UCard>

        <!-- Color Pickers -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Display Colors</h2>
          </template>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-3">Primary</label>
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg border-2 shadow-sm" :style="{ backgroundColor: theme.primary }">
                  <input type="color"
                    v-model="primaryColor"
                    @update:model-value="updatePrimaryColor"
                    class="w-12 h-12 opacity-0"
                  />
                </div>
                <code class="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{{ theme.primary }}</code>
              </div>                
            </div>

            <div>
              <label class="block text-sm font-medium mb-3">Secondary</label>
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 rounded-lg border-2 shadow-sm" :style="{ backgroundColor: theme.secondary }">
                  <input type="color"
                    v-model="secondaryColor"
                    @update:model-value="updateSecondaryColor"
                    class="w-12 h-12 opacity-0"
                  />
                </div>
                <code class="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{{ theme.secondary }}</code>
              </div>                
            </div>

            <div>
              <label class="block text-sm font-medium mb-3">Gray</label>
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 rounded-lg border-2 shadow-sm" :style="{ backgroundColor: theme.gray }">
                  <input type="color"
                    v-model="grayColor"
                    @update:model-value="updateGrayColor"
                    class="w-12 h-12 opacity-0"
                  />
                </div>
                <code class="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{{ theme.gray }}</code>
              </div>                
            </div>
          </div>
        </UCard>

        <!-- Controls -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Controls</h2>
          </template>
          <div class="space-y-4">
            <div class="p-6 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5">
              <div :class="theme.background" class="h-24 rounded-lg shadow-lg flex items-center justify-center">
                <div class="text-center">
                  <div class="w-12 h-12 bg-primary rounded-full mx-auto mb-2 shadow-lg" />
                  <p class="text-secondary font-semibold drop-shadow-lg">Live Preview</p>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <UButton @click="themeStore.resetTheme" color="gray" variant="outline">
                🔄 Reset
              </UButton>
              <UButton @click="themeStore.saveTheme" color="success">
                💾 Save Theme
              </UButton>
              <UButton @click="toggleDarkMode" :color="isDark ? 'gray' : 'slate'" variant="outline">
                {{ isDark ? '☀️ Light' : '🌙 Dark' }}
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const appConfig = useAppConfig()
const theme = appConfig.theme
const themeStore = useTheme()
const colorMode = useColorMode()

// Reactive color pickers
const primaryColor = computed({
  get: () => theme.primary,
  set: (value) => themeStore.updateTheme({ primary: value })
})

const secondaryColor = computed({
  get: () => theme.secondary || '#ffffff',
  set: (value) => themeStore.updateTheme({ secondary: value })
})

const grayColor = computed({
  get: () => theme.gray || '#6b7280',
  set: (value) => themeStore.updateTheme({ gray: value })
})


// Color presets
const colorPresets = [
  ['#3b82f6', '#1d4ed8', '#1e40af'],
  ['#10b981', '#059669', '#047857'],
  ['#ef4444', '#dc2626', '#b91c1c'],
  ['#8b5cf6', '#7c3aed', '#6d28d9'],
  ['#f59e0b', '#d97706', '#b45309']
]

const grayPresets = [
  ['#f8fafc', '#f1f5f9', '#e2e8f0'],
  ['#cbd5e1', '#94a3b8', '#64748b'],
  ['#475569', '#334155', '#1e293b']
]

const backgrounds = [
  { value: 'bg-gradient-1', label: 'Gradient 1' },
  { value: 'bg-gradient-2', label: 'Gradient 2' },
  { value: 'bg-gradient-3', label: 'Gradient 3' },
  { value: 'bg-gradient-4', label: 'Gradient 4' },
  { value: 'bg-gradient-5', label: 'Gradient 5' }
]

const isDark = computed(() => colorMode.value === 'dark')

const setBackground = (bgClass: string) => {
  themeStore.updateTheme({ background: bgClass })
}

const toggleDarkMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const updatePrimaryColor = (color: string) => {
  themeStore.updateTheme({ primary: color })
}

const updateSecondaryColor = (color: string) => {
  themeStore.updateTheme({ secondary: color })
}

const updateGrayColor = (color: string) => {
  themeStore.updateTheme({ gray: color })
}

</script>