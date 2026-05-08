export default defineNuxtPlugin(async () => {
  const auth = useAuth();
  const settings = useSettings();

  if (auth.isAuthenticated) {
    await settings.fetchSettings();
  } else {   
    await settings.fetchDefaults();
  }
});