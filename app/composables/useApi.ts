export const useApi = () => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    headers: {
      Accept: 'application/json',
    },
    onRequest({ options }) {

      const headers = new Headers(options.headers)

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json')
      } 
      // Note: If it IS FormData, we leave Content-Type empty 
      // so the browser sets 'multipart/form-data; boundary=...'
      options.headers = headers
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
  
  const put = (url: string, body?: any, options = {}) => {
     if (body instanceof FormData) {
       body.append('_method', 'PUT')
       return apiFetch(url, { method: 'POST', body, ...options })
     }
     return apiFetch(url, { method: 'PUT', body, ...options })
  }
  
  const del = (url: string, options = {}) => apiFetch(url, { method: 'DELETE', ...options })

  return {
    apiFetch,
    get,
    post,
    put,
    del
  }

}
