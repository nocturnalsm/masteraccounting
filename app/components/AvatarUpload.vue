<script setup lang="ts">
/**
 * Component: AvatarUpload
 * Handles visual preview of existing URLs vs. newly selected binary files.
 */

const props = defineProps<{
  modelValue?: string, // The visual URL (remote or blob)
  label?: string,
  description?: string
}>()

const emit = defineEmits(['update:modelValue', 'file-selected'])

// Internal binary state
const selectedFile = ref<File | undefined>(undefined)

// Decides which image to show in the circle
const displayUrl = computed(() => {
  if (selectedFile.value) return URL.createObjectURL(selectedFile.value)
  return props.modelValue
})

const handleFileChange = (payload: any) => {
  // UNIVERSAL EXTRACTOR:
  // 1. Check if it's a native Event (event.target.files)
  // 2. Check if it's a Nuxt UI Array ([File])
  // 3. Check if it's a single File object
  let file: File | null = null;

  if (payload?.target?.files) {
    file = payload.target.files[0];
  } else if (Array.isArray(payload)) {
    file = payload[0];
  } else if (payload instanceof File) {
    file = payload;
  }

  if (!file) {
    console.error("File extraction failed. Payload structure:", payload);
    return;
  }

  selectedFile.value = file;
  
  // Create the preview URL
  const blobUrl = URL.createObjectURL(file);
  
  // Sync with parent
  emit('update:modelValue', blobUrl);
  emit('file-selected', file);
}

const handleRemove = (removeFn: Function) => {
  removeFn()
  selectedFile.value = undefined
  emit('update:modelValue', '')
  emit('file-selected', null)
}

// Memory safety
onUnmounted(() => {
  if (displayUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(displayUrl.value)
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Manual Label/Description since UFormField is removed -->
    <div v-if="label || description" class="mb-1">
      <label v-if="label" class="block text-sm font-medium text-gray-700">{{ label }}</label>
      <p v-if="description" class="text-xs text-gray-500">{{ description }}</p>
    </div>

    <UFileUpload 
      v-slot="{ open, removeFile }" 
      @update:model-value="handleFileChange"
      accept="image/*"
      :preview="false"
    >
      <div class="flex items-center gap-4">
        <!-- Preview Circle -->
        <UAvatar
          size="xl"
          :src="displayUrl"
          icon="i-lucide-image"
          class="border-2 border-gray-200 w-24 h-24"
        />

        <div class="flex flex-col gap-2">
          <UButton
            :label="selectedFile || modelValue ? 'Change Image' : 'Upload Image'"
            color="neutral"
            variant="outline"
            icon="i-lucide-camera"
            @click="open()"
          />
          
          <UButton
            v-if="selectedFile || modelValue"
            label="Remove"
            color="error"
            variant="link"
            size="xs"
            class="p-0 h-auto justify-start"
            @click="handleRemove(removeFile)"
          />
        </div>
      </div>
    </UFileUpload>
  </div>
</template>