<script setup lang="ts">
interface Props {
  label?: string
  name?: string
  description?: string
  required?: boolean
  ui?: {
    base: string
    label: string
    wrapper: string
    error: string
    description: string
  }
  error?: string | boolean
  disabled?: boolean
  validate?: () => boolean | string | Promise<boolean | string>
}

const props = withDefaults(defineProps<Props>(), {
  ui: () => ({
    base: 'space-y-1 w-full',
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
    wrapper: 'w-full',
    error: 'text-sm text-red-600 dark:text-red-400 mt-1',
    description: 'text-xs text-gray-500 dark:text-gray-400 mt-1',
  }),
  required: false,
})

defineOptions({
  name: 'FormGroup'
})

const slots = useSlots()
</script>

<template>
  <div :class="props.ui.base">
    <label v-if="props.label" :for="props.name" :class="props.ui.label">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    <div :class="props.ui.wrapper">
      <slot />
    </div>
    <p v-if="props.description" :class="props.ui.description">
      {{ props.description }}
    </p>
    <p v-if="props.error" :class="props.ui.error">
      {{ typeof props.error === 'string' ? props.error : 'This field is invalid' }}
    </p>
  </div>
</template>

