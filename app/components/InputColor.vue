<template>
  <div
    class="w-10 h-10 rounded-lg border-2 shadow-sm overflow-hidden relative"
    :style="{ backgroundColor: modelValue }"
  >
    <input
      type="color"
      :value="modelValue"
      @input="updateValue"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '#000000',
  },
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>