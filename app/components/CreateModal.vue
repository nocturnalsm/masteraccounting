<script setup lang="ts">
const props = defineProps<{
  title: string
  description?: string
}>()

const emit = defineEmits<{
  submit: []
  close: []
}>()

const open = defineModel<boolean>('open', { default: false })

const onSubmit = () => {
  emit('submit')
}

const onClose = () => {
  open.value = false
  emit('close')
}
</script>

<template>
  <UModal v-model:open="open" :title="title" :description="description">
    <template #body>
      <form @submit.prevent="onSubmit">
        <div class="space-y-4">
          <slot />
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          label="Cancel"
          @click="onClose"
        />
        <UButton
          type="submit"
          color="primary"
          label="Create"
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
