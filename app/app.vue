<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Master Accounting'
const description = 'Ledger-first accounting app with modular expansion.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})

const setting = useSettings()
const auth = useAuth()
const { applyTheme } = useTheme() 

// Initialize data strategy
onMounted(async () => {

  setting.loadFromCache()

  watch(() => auth.isAuthenticated, async (isLoggedIn) => {
    if (isLoggedIn) {
      await setting.fetchSettings()
    } else {
      setting.fetchDefaults()
    }
  }, { immediate: true })
})

</script>

<template>
  <UApp :toaster="{ position: 'top-right' }">
    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>
  </UApp>
</template>
