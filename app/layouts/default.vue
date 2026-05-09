<script setup lang="ts">
  const { user } = useAuth()
</script>

<template>
  <div v-if="user" class="bg-background min-h-screen">
    <MegaMenu />
    <main class="p-6">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
  .bg-background {
    background: var(--color-background);
  }
</style>