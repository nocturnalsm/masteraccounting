export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
    
  if (auth.token && !auth.user) {
    await auth.fetchUser()
  }
  
  if (!auth.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login')
  }

})