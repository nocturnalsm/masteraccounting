<script setup lang="ts">
const props = defineProps<{
  title: string
  backTo: string
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
          variant="outline"
          color="error"
          icon="i-lucide-trash-2"
          label="Delete"
          @click="emit('delete')"
        />
        <UButton
          color="primary"
          icon="i-lucide-save"
          label="Save Changes"
          @click="emit('save')"
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
          <template #header>
            <UTabs
              v-model="activeTab"
              :items="[
                { label: 'Details', value: 'details' },
                { label: 'Settings', value: 'settings' }
              ]"
            />
          </template>

          <div v-if="activeTab === 'details'" class="space-y-4">
            <slot name="details" />
          </div>

          <div v-else-if="activeTab === 'settings'" class="space-y-4">
            <slot name="settings" />
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
