export const useApi = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    onRequest({ options }) {
      if (token.value) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${token.value}`)
        options.headers = headers
      }
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        const { logout } = useAuth()
        logout()
      }
    }
  })

  const get = (url: string, options = {}) => apiFetch(url, { method: 'GET', ...options })
  const post = (url: string, body?: any, options = {}) => apiFetch(url, { method: 'POST', body, ...options })
  const put = (url: string, body?: any, options = {}) => apiFetch(url, { method: 'PUT', body, ...options })
  const del = (url: string, options = {}) => apiFetch(url, { method: 'DELETE', ...options })

  return {
    apiFetch,
    get,
    post,
    put,
    del
  }

}
