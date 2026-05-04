export interface User {
  id: number
  name: string
  email: string
}

export const useAuth = () => {
  const token = useCookie<string | null>('auth-token', {
    maxAge: 60 * 60 * 24 * 7, 
  })
  const user = useState<User | null>('auth-user', () => null)

  const isAuthenticated = computed(() => !!token.value)

  const config = useRuntimeConfig()

  const login = async (credentials: { email: string; password: string }) => {
    const data = await $fetch<{ user: User; token: string }>(
      `${config.public.apiBase}/login`,
      {
        method: 'POST',
        body: credentials
      }
    )

    token.value = data.token
    user.value = data.user
  }

  const fetchUser = async () => {

    if (!token.value) return

    try {
      const data = await $fetch<User>(`${config.public.apiBase}/user`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      user.value = data
    } catch (err: any) {
      if (err?.response?.status === 401) {
        token.value = null
        user.value = null
      }
    }
  }

  const logout = async () => {

    const data = await $fetch<User>(`${config.public.apiBase}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })

    token.value = null
    user.value = null
    return navigateTo('/login')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    fetchUser,
    logout
  }
}