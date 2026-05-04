export default defineNuxtRouteMiddleware(async (to) => {
    
    const { isAuthenticated, user, fetchUser } = useAuth()
    
    const publicPages = ['/login', '/register', '/forgot-password']
    
    if (publicPages.includes(to.path)) {
        return navigateTo('/')
    }

    if (!isAuthenticated.value) {
        return navigateTo('/login')
    }
    else {
        if (!user.value){
            await fetchUser()
        }
    }
    
})