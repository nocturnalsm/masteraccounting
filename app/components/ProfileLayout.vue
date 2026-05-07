<script setup lang="ts">
const props = defineProps<{
  title: string
  backTo: string,
  loading?: boolean,
}>()

const emit = defineEmits<{
  save: []
  delete: []
}>()

const activeTab = ref('details')
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UButton
          :disabled="loading"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
          :to="backTo"
        />
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h1>
      </div>
      <div class="flex gap-2">
        <UButton
          :disabled="loading"
          variant="outline"
          color="error"
          icon="i-lucide-trash-2"
          label="Delete"
          @click.prevent="emit('delete')"
        />
        <UButton
          :disabled="loading"
          variant="solid"
          color="primary"
          icon="i-lucide-save"
          label="Save Changes"
          @click.prevent="emit('save')"
        />
      </div>
    </div>

    <!-- Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Sidebar - Summary -->
      <div class="lg:col-span-1">
        <UCard>
          <slot name="summary" />
        </UCard>
      </div>

      <!-- Right Side - Details -->
      <div class="lg:col-span-2">
        <UCard>
          <slot name="details" />
        </UCard>
      </div>
    </div>
  </div>
</template>
