export default defineNuxtPlugin(() => {
  const auth = useAuth();
  
  return {
    provide: {
      can: (permission: string) => auth.can(permission)
    }
  }
});