<script setup lang="ts">
definePageMeta({
  layout: 'guest'
})

const { login } = useAuth()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const error = ref('')

const onSubmit = async () => {

    const config = useRuntimeConfig()

    loading.value = true
    error.value = ''

    try {
        await login({
            email: form.email,
            password: form.password
        })

        await router.push('/')
    } catch (err: any) {        
        error.value = err?.response._data.message || 'Invalid credentials'
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="w-full space-y-8 flex items-center justify-center h-screen">
    <div class="w-full max-w-md space-y-2">
        <div class="text-center">            
            <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sign in to your account
            </h2>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Welcome back to Master Accounting
            </p>
        </div>

        <UCard>
        <form class="space-y-6" @submit.prevent="onSubmit">
            <div class="w-full">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
                    <UInput
                        class="w-full"
                        v-model="form.email"
                        size="md"
                        type="email"
                        placeholder="you@example.com"
                        icon="i-lucide-mail"
                        required
                    />
                </div>
            </div>
            <div class="w-full">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <UInput
                        size="md"
                        v-model="form.password"
                        type="password"
                        placeholder="••••••••"
                        icon="i-lucide-lock"
                        required
                        class="w-full"
                    />
                </div>
            </div>
            <div class="flex items-center justify-between">
                <UCheckbox v-model="form.remember" label="Remember me" />
                <NuxtLink
                    to="/forgot-password"
                    class="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                    Forgot password?
                </NuxtLink>
            </div>

            <UAlert
                v-if="error"
                color="error"
                variant="soft"
                :title="error"
                icon="i-lucide-alert-circle"
            />

            <UButton
                type="submit"
                color="primary"
                block
                size="lg"
                :loading="loading"
                label="Sign in"
            />
        </form>

        <div class="mt-6">
            <div class="relative">
            <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div class="relative flex justify-center text-sm">
                <span class="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                Or continue with
                </span>
            </div>
            </div>

            <div class="mt-6">
            <UButton
                color="neutral"
                variant="outline"
                block
                icon="i-simple-icons-google"
                label="Google"
            />
            </div>
        </div>
        </UCard>
    </div>
  </div>
</template>
