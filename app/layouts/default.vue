<script setup lang="ts">
  const { user } = useAuth()
</script>

<template>
  <div v-if="user" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <MegaMenu />
    <main class="p-6">
      <NuxtPage />
    </main>
  </div>
</template>
