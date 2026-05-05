<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { can } = useAuth()
const route = useRoute()
const router = useRouter()
const { get, put, del } = useApi()

const user = ref<any>({})
const roleList = ref<any[]>([])
const companyList = ref<any[]>([])  
const loading = ref(false)
const saveLoading = ref(false)

const fetchUser = async () => {
  loading.value = true
  try {
    const response = await get(`/users/${route.params.id}`)
    user.value = response || {}
  } catch (error) {
    console.error('Failed to fetch user:', error)
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await get('/roles')
    roleList.value = response.data.map(role => ({
      label: role.name,
      value: role.id
    })) || []
  } catch (error) {
    console.error('Failed to fetch roles:', error)
  }
}

const fetchCompanies = async () => {
  try {
    const response = await get('/companies')
    companyList.value = response.data.map(company => ({
      label: company.name,
      value: company.id
    })) || []
  } catch (error) {
    console.error('Failed to fetch companies:', error)
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

onMounted(async () => {
  await Promise.all([
    fetchUser(),
    fetchRoles(),
    fetchCompanies()
  ])
})
</script>

<template>
  <div v-if="loading" class="flex justify-center py-12">
    <USkeleton class="w-full" />
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
            <ul v-if="user.roles" class="text-gray-900 dark:text-white">
              <li v-for="role in user.roles" :key="role.id">{{ role.name }}</li>
            </ul>   
            <span v-else class="text-gray-900 dark:text-white">-</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Company</span>
            <ul v-if="user.companies" class="text-gray-900 dark:text-white">
              <li v-for="company in user.companies" :key="company.id">{{ company.name }}</li>
            </ul>   
            <span v-else class="text-gray-900 dark:text-white">-</span>          
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
        <div class="block lg:flex gap-x-4 space-y-4 lg:space-y-0">
          <FormGroup label="First Name" required>
            <UInput class="w-full"size="lg" v-model="user.first_name" placeholder="First name" />
          </FormGroup>
          <FormGroup label="Last Name" required>
            <UInput class="w-full"size="lg" v-model="user.last_name" placeholder="Last name" />
          </FormGroup>
        </div>
        <div class="block lg:flex gap-x-4 space-y-4 lg:space-y-0">
          <FormGroup label="Email" required>
            <UInput class="w-full"size="lg" v-model="user.email" type="email" placeholder="user@example.com" />
          </FormGroup>
          <FormGroup label="Title">
            <UInput class="w-full"size="lg" v-model="user.title" placeholder="Title" />
          </FormGroup>
        </div>
        <FormGroup label="Role">
          <USelectMenu
            multiple
            size="lg"
            class="w-full"
            v-model="user.roles"
            :items="roleList"
            value-key="id"
            placeholder="Select role"
          />
        </FormGroup>
        <FormGroup v-if="can('company-list')" label="Company">
          <USelectMenu multiple value-key="id" class="w-full" size="lg" v-model="user.companies" :items="companyList" placeholder="Select company" />
        </FormGroup>
      </div>
    </template>

    <template #settings>
      <div class="space-y-4">
        <FormGroup label="Status">
          <USwitch v-model="user.is_active" />
        </FormGroup>
        <FormGroup label="Email Verified">
          <USwitch v-model="user.email_verified" />
        </FormGroup>
        <FormGroup label="Two Factor Authentication">
          <USwitch v-model="user.two_factor_enabled" />
        </FormGroup>
      </div>
    </template>
  </ProfileLayout>
</template>
