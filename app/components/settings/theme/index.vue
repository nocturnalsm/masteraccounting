<template>    
    <div class="w-full mx-auto">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-6">Color Theme</h3>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">          
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Background Colors</h2>
          </template>
          <div class="space-y-4">
            <SettingsThemeBackground v-model="bgColor" />        
          </div>
        </UCard>
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Display Colors</h2>
          </template>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-3">Primary</label>
              <div class="flex items-center space-x-3 mb-3">
                <InputColor
                  v-model="primaryColor"
                  @update:model-value="updatePrimaryColor"
                />
                <code class="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{{ primaryColor }}</code>
              </div>                
            </div>

            <div>
              <label class="block text-sm font-medium mb-3">Secondary</label>
              <div class="flex items-center space-x-3 mb-3">
                <InputColor
                  v-model="secondaryColor"
                  @update:model-value="updateSecondaryColor"
                />
                <code class="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{{ secondaryColor }}</code>
              </div>                
            </div>

            <div>
              <label class="block text-sm font-medium mb-3">Gray</label>
              <div class="flex items-center space-x-3 mb-3">
                <InputColor
                  v-model="grayColor"
                  @update:model-value="updateGrayColor"
                />
                <code class="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{{ grayColor }}</code>
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
            <UButton class="px-4 block" @click="toggleDarkMode">
              {{ isDark ? '☀️ Light' : '🌙 Dark' }}
            </UButton>
            <UButton class="block" @click="themeStore.saveTheme" color="success">
              Save Theme
            </UButton>
            <UButton class="block" @click="themeStore.loadSavedTheme" color="warning" variant="outline">
              Reset
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
</template>

<script setup lang="ts">

const themeStore = useTheme()
const { settings } = useSettings()
const colorMode = useColorMode()

// Reactive color pickers
const primaryColor = computed({
  get: () => settings.theme.primary,
  set: (value) => themeStore.updateTheme({ primary: value })
})

const secondaryColor = computed({
  get: () => settings.theme.secondary || '#ffffff',
  set: (value) => themeStore.updateTheme({ secondary: value })
})

const grayColor = computed({
  get: () => settings.theme.gray || '#6b7280',
  set: (value) => themeStore.updateTheme({ gray: value })
})

const bgColor = computed({
  get: () => settings.theme.background,
  set: (value) => themeStore.updateTheme({ background: value })
})


const isDark = computed(() => colorMode.value === 'dark')

const toggleDarkMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
  themeStore.updateTheme({ dark: isDark.value })
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