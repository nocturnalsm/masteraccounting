<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { can } = useAuth()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const { get, put, del, post } = useApi()

const user = ref<any>({})
const roleList = ref<any[]>([])
const companyList = ref<any[]>([])  
const loading = ref(false)
const saveLoading = ref(false)
const avatar = ref(null)

const formState = reactive({
    first_name: '',
    last_name: '',
    email: '',
    title: '',
    roles: [],
    companies: [],
    avatar_url: ''
})

const fetchUser = async () => {
  loading.value = true
  try {
    const response = await get(`/users/${route.params.id}`)
    user.value = response || {}

    Object.assign(formState, {
        first_name: user.value.first_name,
        last_name: user.value.last_name,
        email: user.value.email,
        title: user.value.title,
        roles: user.value.roles,
        companies: user.value.companies,
        avatar_url: user.value.avatar_url
    })
  } catch (error) {
    console.error('Failed to fetch user:', error)
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await get('/roles')
    roleList.value = response.data
  } catch (error) {
    console.error('Failed to fetch roles:', error)
  }
}

const fetchCompanies = async () => {
  try {
    const response = await get('/companies')
    companyList.value = response.data
  } catch (error) {
    console.error('Failed to fetch companies:', error)
  }
}

const saveUser = async () => {
  saveLoading.value = true
  try {
    await put(`/users/${route.params.id}`, formState)
    console.log(avatar.value)
    if (avatar.value){
      const fd = new FormData()
      fd.append('avatar', avatar.value)
      await post(`/users/${route.params.id}/avatar`, fd)
      avatar.value = null
    }
    toast.add({
      title: 'Success',
      description: 'Update was completed successfully.',
      color: 'success'
    })
    await fetchUser()
  } catch (error) {
    toast.add({
      title: 'Error',
      description: `Failed to save user: ${error.response?._data.message}`,
      color: 'error'
    })
  } 
  finally {
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
  await fetchRoles(),
  await fetchCompanies()
  await fetchUser()
})

const handleSelectFile = file => {
    console.log(file)
    avatar.value = file
}

</script>

<template>
  <ProfileLayout
    :title="user.name || 'User Details'"
    back-to="/users"
    @save="saveUser"
    :loading="saveLoading"
    @delete="deleteUser"
  >
    <template #summary>
      <div class="text-center space-y-4">
        <div class="w-20 h-20 mx-auto rounded-full flex items-center justify-center">
          <UAvatar :src="user.avatar_url" :alt="user.full_name" class="w-full h-full" size="2xl" color="primary" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ user.full_name }}
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
      <UForm :state="formState" :disabled="loading || saveLoading">
        <div class="space-y-4">        
          <div class="block lg:flex gap-x-4 space-y-4 lg:space-y-0">
            <FormGroup label="First Name" required>
              <UInput class="w-full"size="lg" v-model="formState.first_name" placeholder="First name" />
            </FormGroup>
            <FormGroup label="Last Name" required>
              <UInput class="w-full"size="lg" v-model="formState.last_name" placeholder="Last name" />
            </FormGroup>
          </div>
          <div class="block lg:flex gap-x-4 space-y-4 lg:space-y-0">
            <FormGroup label="Email" required>
              <UInput class="w-full"size="lg" v-model="formState.email" type="email" placeholder="user@example.com" />
            </FormGroup>
            <FormGroup label="Title">
              <UInput class="w-full"size="lg" v-model="formState.title" placeholder="Title" />
            </FormGroup>
          </div>
          <FormGroup label="Role">
            <USelectMenu
              :multiple="true"
              v-model="formState.roles"
              size="lg"
              class="w-full"
              by="id"
              :items="roleList"
              placeholder="Select role"
              label-key="name"
            />
          </FormGroup>
          <FormGroup v-if="can('company-list')" label="Company">
            <USelectMenu 
              :multiple="true"
              v-model="formState.companies"
              class="w-full" 
              size="lg" 
              by="id"
              :items="companyList" 
              placeholder="Select company" 
              label-key="name"
            />
          </FormGroup>
          <AvatarUpload 
            v-model="formState.avatar_url"
            @file-selected="handleSelectFile"
            label="User Avatar"
          />
        </div>
      </UForm>
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
