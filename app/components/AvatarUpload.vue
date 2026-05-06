<template>
  <div class="flex flex-col items-center gap-4  border border-dashed border-gray-400 p-4 rounded">
    <!-- The Preview Circle -->
    <div class="relative">
      <div class="h-32 w-32 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm bg-gray-200">
        <img           
          :src="displayImage" 
          class="h-full w-full object-cover"
          alt="Profile Preview"
        />        
      </div>
      
      <!-- Optional: Loading overlay if you do sequential uploads -->
      <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin text-white w-8 h-8" />
      </div>
    </div>

    <!-- The Upload Trigger -->
    <UFileUpload
      :name="fieldName"
      accept="image/*"
      @change="onFileSelected"
      :help="`Update your ${fieldName}`"
      :label="props.label ?? 'Upload Image'"
      :description="props.description ?? 'Provide an image with .JPG or .PNG file'"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  currentImageUrl: String, // The URL from Spatie (backend)
  fieldName: String,        // 'avatar' or 'logo',
  label: String,
  description: String       // 'Avatar' or 'Logo',
});

const emit = defineEmits(['update:modelValue']);

const localPreviewUrl = ref(null);
const isUploading = ref(false);

// Logic to decide which image to show
const displayImage = computed(() => {
  // 1. If user just picked a file, show the local preview
  if (localPreviewUrl.value) return localPreviewUrl.value;
  
  // 2. Otherwise, show the existing image from the server (or fallback)
  return props.currentImageUrl;
});

const onFileSelected = (files) => {
  const file = files[0];
  if (!file) return;

  // Create the local preview URL
  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value); // Clean up old blob
  localPreviewUrl.value = URL.createObjectURL(file);

  // Emit the file so the parent can handle the actual upload
  emit('update:modelValue', file);
};

// Memory management
onUnmounted(() => {
  if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
});

</script>