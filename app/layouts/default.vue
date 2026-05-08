<script setup lang="ts">
  const { user } = useAuth()
  const { settings } = useSettings()

  const background = computed(() => ({background: settings.theme.background}))

</script>

<template>
  <div v-if="user" :style="background" class="min-h-screen">
    <MegaMenu />
    <main class="p-6">
      <NuxtPage />
    </main>
  </div>
</template>
