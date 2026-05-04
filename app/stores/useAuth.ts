import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  email: string
  roles: string[]
  permission: string[]
}

export const useAuth = defineStore('auth', () => {
  const config = useRuntimeConfig()
  
  // 1. State
  const token = useCookie<string | null>('auth-token', {
    maxAge: 60 * 60 * 24 * 7,
  })
  // Replace useState with ref()
  const user = ref<User | null>(null)

  // 2. Getters
  const isAuthenticated = computed(() => !!token.value)
  const permissions = computed(() => user.value?.permissions || [])

  // 3. Helper to check permissions (for your UI logic)
  const can = (permission: string) => permissions.value.includes(permission)

  // 4. Actions
  
  const login = async (credentials: { email: string; password: string }) => {
    const data = await $fetch<{ user: User; token: string }>(
      `${config.public.apiBase}/login`,
      {
        method: 'POST',
        body: credentials
      }
    )

    token.value = data.token
  }

  const fetchUser = async () => {
    if (!token.value) return

    const { get } = useApi()
    try {
      const data = await get('user')
      user.value = data
    } catch (err: any) {
      if (err?.response?.status === 401) {
        clearAuth()
      }
    }
  }

  const logout = async () => {
    const { post } = useApi()
    try {
      await post('logout')
    } finally {
      clearAuth()
      return navigateTo('/login')
    }
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    permissions,
    can,
    login,
    fetchUser,
    logout
  }
})