<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})


const route = useRoute()
const router = useRouter()
const { get, put, del } = useApi()

const user = ref<any>({})
const loading = ref(false)
const saveLoading = ref(false)

const fetchUser = async () => {
  loading.value = true
  try {
    const response = await get(`/users/${route.params.id}`)
    user.value = response.data || {}
  } catch (error) {
    console.error('Failed to fetch user:', error)
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  saveLoading.value = true
  try {
    await put(`/users/${route.params.id}`, user.value)
    await fetchUser()
  } catch (error) {
    console.error('Failed to save user:', error)
  } finally {
    saveLoading.value = false
  }
}

const deleteUser = async () => {
  if (!confirm('Are you sure you want to delete this user?')) return
  try {
    await del(`/users/${route.params.id}`)
    router.push('/users')
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

onMounted(fetchUser)
</script>

<template>
  <div v-if="loading" class="flex justify-center py-12">
    <ULoadingIcon />
  </div>

  <ProfileLayout
    v-else
    :title="user.name || 'User Details'"
    back-to="/users"
    @save="saveUser"
    @delete="deleteUser"
  >
    <template #summary>
      <div class="text-center space-y-4">
        <div class="w-20 h-20 mx-auto bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-user" class="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ user.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ user.email }}
          </p>
        </div>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-left">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Role</span>
            <span class="text-gray-900 dark:text-white">{{ user.role || '-' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Company</span>
            <span class="text-gray-900 dark:text-white">{{ user.company || '-' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Joined</span>
            <span class="text-gray-900 dark:text-white">
              {{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '-' }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #details>
      <div class="space-y-4">
        <FormGroup label="Full Name" required>
          <UInput v-model="user.name" placeholder="Full name" />
        </FormGroup>
        <FormGroup label="Email" required>
          <UInput v-model="user.email" type="email" placeholder="user@example.com" />
        </FormGroup>
        <FormGroup label="Phone">
          <UInput v-model="user.phone" placeholder="+1 234 567 890" />
        </FormGroup>
        <FormGroup label="Role">
          <USelect
            v-model="user.role"
            :options="[
              { label: 'Admin', value: 'admin' },
              { label: 'Manager', value: 'manager' },
              { label: 'User', value: 'user' }
            ]"
          />
        </FormGroup>
        <FormGroup label="Company">
          <USelect v-model="user.company_id" :options="[]" placeholder="Select company" />
        </FormGroup>
      </div>
    </template>

    <template #settings>
      <div class="space-y-4">
        <FormGroup label="Status">
          <UToggle v-model="user.is_active" />
        </FormGroup>
        <FormGroup label="Email Verified">
          <UToggle v-model="user.email_verified" />
        </FormGroup>
        <FormGroup label="Two Factor Authentication">
          <UToggle v-model="user.two_factor_enabled" />
        </FormGroup>
      </div>
    </template>
  </ProfileLayout>
</template>
