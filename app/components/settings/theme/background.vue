<template>
  <div class="p-2.5 w-full rounded-xl">
    <!-- Tabs -->
    <div class="flex gap-2 mb-6 pb-2 border-b-2 border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'flex-1 px-4 py-3 font-medium rounded-lg transition-all duration-200 border-b-2',
          activeTab === tab.id 
            ? 'text-blue-600 border-blue-600 bg-blue-50' 
            : 'text-gray-700 border-transparent hover:bg-gray-100 hover:text-gray-900'
        ]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Solid Color Tab -->
    <div v-if="activeTab === 'solid'" class="space-y-4 mb-6">
      <div class="grid grid-cols-5 sm:grid-cols-6 gap-3">
        <div
          v-for="color in presetColors"
          :key="color"
          class="w-11 h-11 rounded-lg cursor-pointer border-2 border-transparent hover:scale-105 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
          :style="{ backgroundColor: color }"
          @click="selectSolidColor(color)"
        />
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <label class="block text-sm font-medium text-gray-700 mb-3">Custom Color</label>
        <div class="flex items-center gap-3">
          <InputColor
            ref="colorPicker"
            type="color"
            v-model="customSolidColor"
            @update:modelValue="selectCustomSolidColor"
          />
          <span class="text-sm font-mono text-gray-500">{{ customSolidColor.toUpperCase() }}</span>
        </div>
      </div>
    </div>

    <!-- Gradient Tab -->
    <div v-if="activeTab === 'gradient'" class="space-y-4 mb-6 w-full">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          v-for="(gradient, index) in presetGradients"
          :key="index"
          class="h-20 rounded-lg cursor-pointer border-2 border-transparent hover:scale-105 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden"
          :style="{ background: gradient }"
          @click="selectPresetGradient(gradient)"
        />
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Custom Gradient</label>
            <div class="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div class="flex items-center gap-2 flex-1">
                <label class="text-xs font-medium text-gray-600">Color 1</label>
                <InputColor
                  type="color"
                  v-model="gradientColor1"
                  @update:modelValue="updateCustomGradient"
                />
              </div>
              <div class="flex items-center gap-2 flex-1">
                <label class="text-xs font-medium text-gray-600">Color 2</label>
                <InputColor
                  type="color"
                  v-model="gradientColor2"
                  @update:modelValue="updateCustomGradient"
                />                
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Angle: <span class="text-lg font-mono">{{ gradientAngle }}°</span>
            </label>
            <div class="flex items-center gap-3">
              <input
                type="range"
                v-model="gradientAngle"
                min="0"
                max="360"
                @input="updateCustomGradient"
                class="flex-1 h-2 bg-gray-200 rounded-lg cursor-pointer appearance-none hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                @click="randomGradientAngle"
                class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors font-medium"
              >
                Random
              </button>
            </div>
          </div>
          
          <div class="h-16 rounded-lg border-2 border-gray-200 overflow-hidden shadow-inner">
            <div
              class="w-full h-full"
              :style="{ background: customGradient }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="activeTab == 'solid'" class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">Preview</label>
      <div
        class="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 p-6 flex items-center justify-center relative overflow-hidden shadow-lg"
        :style="{ background: selectedBackground }"
      >
        <span class="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-lg border">
          {{ isGradient ? 'Gradient Background' : 'Solid Background' }}
        </span>
      </div>
    </div>

    <!-- Selected Value -->
    <div v-if="activeTab == 'solid'" class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700">CSS Value:</span>
          <code class="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-900 truncate max-w-[200px] sm:max-w-none">
            {{ selectedBackground }}
          </code>
        </div>
        <div class="flex gap-2">
          <button
            @click="copyToClipboard"
            class="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all font-medium flex items-center gap-1"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
              <path class="text-blue-500" d="M11 4H8a2 2 0 00-2 2v1h5V6a2 2 0 00-2-2z"></path>
              <path fill-rule="evenodd" d="M10 9a1 1 0 00-1 1v5a1 1 0 102 0V10a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            Copy
          </button>
          <button
            @click="resetBackground"
            class="px-3 py-1.5 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface BackgroundConfig {
  type: 'solid' | 'gradient'
  value: string
}

const emit = defineEmits<{
  (e: 'update:background', value: string): void
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const props = defineProps<{
  modelValue?: string
}>()

// State
const activeTab = ref<'solid' | 'gradient'>('solid')
const customSolidColor = ref('#3b82f6')
const gradientColor1 = ref('#3b82f6')
const gradientColor2 = ref('#1e40af')
const gradientAngle = ref(45)
const copied = ref(false)

// Color Picker Ref
const colorPicker = ref<HTMLInputElement>()

// Preset Colors
const presetColors = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#6366f1',
  '#14b8a6', '#a855f7', '#fb923c', '#0ea5e9', '#f43f5e'
] as const

// Preset Gradients
const presetGradients = [
  'linear-gradient(45deg, #ff6b6b, #ffd93d)',
  'linear-gradient(45deg, #4ecdc4, #44a08d)',
  'linear-gradient(45deg, #f093fb, #f5576c)',
  'linear-gradient(45deg, #4facfe, #00f2fe)',
  'linear-gradient(45deg, #43e97b, #38f9d7)',
  'linear-gradient(45deg, #fa709a, #fee140)',
  'linear-gradient(45deg, #a8edea, #fed6e3)',
  'linear-gradient(45deg, #ffecd2, #fcb69f)'
] as const

// Computed Properties
const tabs = [
  { id: 'solid' as const, label: 'Solid' },
  { id: 'gradient' as const, label: 'Gradient' }
] as const

const customGradient = computed(() => {
  return `linear-gradient(${gradientAngle.value}deg, ${gradientColor1.value}, ${gradientColor2.value})`
})

const selectedBackground = computed({
  get: () => props.modelValue || '#ffffff',
  set: (value) => {
    emit('update:modelValue', value)
    emit('update:background', value)
    emit('change', value)
  }
})

const isGradient = computed(() => {
  return selectedBackground.value.includes('linear-gradient')
})

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && !isGradient.value) {
    customSolidColor.value = newValue
  }
}, { immediate: true })

// Methods
const selectSolidColor = (color: string) => {
  selectedBackground.value = color
  customSolidColor.value = color
  activeTab.value = 'solid'
}

const selectCustomSolidColor = () => {
  selectedBackground.value = customSolidColor.value
}

const selectPresetGradient = (gradient: string) => {
  selectedBackground.value = gradient
  activeTab.value = 'gradient'
}

const updateCustomGradient = () => {
  selectedBackground.value = customGradient.value
}

const resetBackground = () => {
  selectedBackground.value = '#ffffff'
  customSolidColor.value = '#3b82f6'
  gradientColor1.value = '#3b82f6'
  gradientColor2.value = '#1e40af'
  gradientAngle.value = 45
  activeTab.value = 'solid'
}

const randomGradientAngle = () => {
  gradientAngle.value = Math.floor(Math.random() * 361)
  updateCustomGradient()
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(selectedBackground.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = selectedBackground.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
}

// Initialize from modelValue if it's a gradient
watch(selectedBackground, (newValue) => {
  if (newValue?.includes('linear-gradient')) {
    activeTab.value = 'gradient'
  }
}, { immediate: true })

</script>