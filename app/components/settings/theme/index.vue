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
            <SettingsThemeBackground @update:model-value="updateBgColor" v-model="selectedBackground" />        
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
                  v-model="selectedPrimary"
                  @update:model-value="updatePrimaryColor"
                />
                <code class="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{{ selectedPrimary }}</code>
              </div>                
            </div>

            <div>
              <label class="block text-sm font-medium mb-3">Secondary</label>
              <div class="flex items-center space-x-3 mb-3">
                <InputColor
                  v-model="selectedSecondary"
                  @update:model-value="updateSecondaryColor"
                />
                <code class="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{{ selectedSecondary }}</code>
              </div>                
            </div>

            <div>
              <label class="block text-sm font-medium mb-3">Gray</label>
              <div class="flex items-center space-x-3 mb-3">
                <InputColor
                  v-model="selectedGray"
                  @update:model-value="updateGrayColor"
                />
                <code class="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">{{ selectedGray }}</code>
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
            <UButton class="block" @click.prevent="saveTheme" color="success">
              Save Theme
            </UButton>
            <UButton class="block" @click.prevent="resetTheme" color="warning" variant="outline">
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

const selectedPrimary = ref(settings.theme.primary)
const selectedSecondary = ref(settings.theme.secondary)
const selectedGray = ref(settings.theme.gray)
const selectedBackground = ref(settings.theme.background)
const selectedDark = ref(settings.theme.darkMode)
const currentTheme = ref(settings.theme)

const isDark = computed(() => colorMode.value === 'dark')

const toggleDarkMode = () => {
  colorMode.value = isDark.value ? 'light' : 'dark'
  selectedDark.value = isDark.value
  themeStore.applyTheme({ darkMode: isDark.value })
}

const updatePrimaryColor = (color: string) => {
  selectedPrimary.value = color
  themeStore.applyTheme({ primary: color })
}

const updateSecondaryColor = (color: string) => {
  selectedSecondary.value = color
  themeStore.applyTheme({ secondary: color })
}

const updateGrayColor = (color: string) => {
  selectedGray.value = color
  themeStore.applyTheme({ gray: color })
}

const updateBgColor = (color: string) => {
  selectedBackground.value = color
  themeStore.applyTheme({ background: color })
}

const saveTheme = async () => {
  await themeStore.saveTheme()
  nextTick(() => {
    currentTheme.value = settings.theme
  })
}

const resetTheme = () => {
  themeStore.applyTheme(currentTheme.value)
}

</script>