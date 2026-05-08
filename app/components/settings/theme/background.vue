<UCard>
  <template #header>
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Background Color</h2>
      <UButton
        v-if="currentBackground !== 'custom'"
        size="sm"
        variant="outline"
        @click="setBackground('custom')"
      >
        Custom
      </UButton>
    </div>
  </template>
  
  <!-- Presets Grid -->
  <div v-if="currentBackground !== 'custom'" class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
    <UButton
      v-for="bg in backgrounds"
      :key="bg.value"
      :class="bg.value"
      variant="ghost"
      size="sm"
      @click="setBackground(bg.value)"
      class="h-20 rounded-xl shadow-md hover:shadow-xl relative overflow-hidden transition-all"
      :class="{ 
        'ring-2 ring-blue-500 shadow-xl scale-105': currentBackground === bg.value,
        'opacity-60 grayscale': currentBackground === 'custom'
      }"
    >
      <div class="absolute inset-0 opacity-90">
        <!-- Gradient preview -->
        <div 
          v-if="bg.gradient"
          class="h-full w-full bg-gradient-to-r"
          :style="`background: ${bg.gradient}`"
        />
        <!-- Solid color preview -->
        <div 
          v-else
          class="h-full w-full"
          :style="`background-color: ${bg.color}`"
        />
      </div>
      <div class="text-xs font-medium text-white/90 drop-shadow-md absolute bottom-2 left-2 right-2 text-center">
        {{ bg.label }}
      </div>
    </UButton>
  </div>

  <!-- Custom Input (Color Picker + Gradient Editor) -->
  <div v-else class="space-y-4 p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-900/50">
    <div class="flex gap-3 items-center">
      <UButton
        size="sm"
        icon="i-heroicons-arrow-left"
        variant="ghost"
        @click="setBackground('default')"
      >
        Back to presets
      </UButton>
      <div class="flex-1">
        <label class="text-sm font-medium block mb-1">Custom Background</label>
        <div class="flex gap-2">
          <!-- Single Color Picker -->
          <UInputColor
            v-model="customColor"
            class="w-20 h-10"
            @update:model-value="handleCustomColor"
          />
          <!-- Gradient Type Toggle -->
          <UButtonGroup v-model="gradientType" size="sm" class="flex-1 max-w-xs">
            <UButton value="solid" variant="ghost">Solid</UButton>
            <UButton value="linear" variant="ghost">Linear</UButton>
            <UButton value="radial" variant="ghost">Radial</UButton>
          </UButtonGroup>
        </div>
      </div>
    </div>

    <!-- Gradient Editor (if not solid) -->
    <div v-if="gradientType !== 'solid'" class="space-y-3">
      <div class="grid grid-cols-2 gap-2">
        <!-- Color Stop 1 -->
        <div>
          <label class="text-xs font-medium block mb-1">Color 1</label>
          <UInputColor v-model="gradientStops[0]" class="w-full h-10" />
        </div>
        <!-- Color Stop 2 -->
        <div>
          <label class="text-xs font-medium block mb-1">Color 2</label>
          <UInputColor v-model="gradientStops[1]" class="w-full h-10" />
        </div>
      </div>
      
      <!-- Direction/Angle -->
      <div class="flex gap-3 items-center">
        <label class="text-sm font-medium w-20">Direction</label>
        <UInput 
          v-model.number="gradientAngle" 
          type="range" 
          min="0" 
          max="360" 
          class="flex-1" 
        />
        <span class="text-sm font-mono w-12">{{ gradientAngle }}°</span>
      </div>
      
      <!-- Preview -->
      <div class="h-16 rounded-lg overflow-hidden shadow-sm border">
        <div 
          class="h-full w-full"
          :style="getCustomGradientStyle()"
          :class="{ 'animate-pulse': gradientType !== 'solid' }"
        />
      </div>
    </div>

    <!-- Save Custom Preset -->
    <div class="flex gap-2 pt-2">
      <UButton
        @click="saveCustomPreset"
        :loading="savingCustom"
        class="flex-1"
      >
        Save as Preset
      </UButton>
      <UButton
        variant="ghost"
        @click="resetCustom"
      >
        Reset
      </UButton>
    </div>
  </div>
</UCard>