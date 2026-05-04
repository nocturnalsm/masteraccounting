export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()

  // 1. Ensure user data is loaded if a token exists
  if (auth.token && !auth.user) {
    await auth.fetchUser()
  }

  // 2. Retrieve permissions from page meta
  // We cast it to allow string or string array
  const requiredPermissions = to.meta.permissions as string | string[] | undefined

  if (requiredPermissions) {
    const permissionsArray = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions]

    // 3. Logic: If ONE fails, the whole check fails (every/AND logic)
    const hasAllPermissions = permissionsArray.every(p => auth.can(p))

    if (!hasAllPermissions) {
      // Redirect to dashboard or a 403 error page
      return navigateTo('/') 
    }
  }
})