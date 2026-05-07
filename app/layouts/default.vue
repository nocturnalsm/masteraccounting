<script setup lang="ts">
  const { user } = useAuth()
  const { theme } = useTheme()
</script>

<template>
  <div v-if="user" :class="theme.background" class="min-h-screen">
    <MegaMenu />
    <main class="p-6">
      <NuxtPage />
    </main>
  </div>
</template>
