<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { get, put, del, post } = useApi()
const toast = useToast()

const company = ref<any>({})
const loading = ref(false)
const saveLoading = ref(false)
const logo = ref(null)

const formState = reactive({
    name: '',
    slug: '',
    description: '',
    logo_url: ''
})

const fetchCompany = async () => {
  loading.value = true
  try {
    const response = await get(`/companies/${route.params.id}`)
    company.value = response || {}
    Object.assign(formState, {
        name: company.value.name,
        slug: company.value.slug,
        description: company.value.description,
        logo_url: company.value.logo_url
    })
  } catch (error) {
    console.error('Failed to fetch company:', error)
  } finally {
    loading.value = false
  }
}

const saveCompany = async () => {
  saveLoading.value = true
  try {
    await put(`/companies/${route.params.id}`, formState)
    if (logo.value){
      const fd = new FormData()
      fd.append('logo', logo.value)
      await post(`/companies/${route.params.id}/logo`, fd)
      logo.value = null
    }
    toast.add({
      title: 'Success',
      description: 'Update was completed successfully.',
      color: 'success'
    })
    await fetchCompany()
  } catch (error) {
    toast.add({
      title: 'Error',
      description: `Failed to save company: ${error.response?._data.message}`,
      color: 'error'
    })
  } finally {
    saveLoading.value = false
  }
}

const deleteCompany = async () => {
  if (!confirm('Are you sure you want to delete this company?')) return
  try {
    await del(`/companies/${route.params.id}`)
    router.push('/companies')
  } catch (error) {
    console.error('Failed to delete company:', error)
  }
}

onMounted(fetchCompany)
</script>

<template>  

  <ProfileLayout
    :title="company.name || 'Company Details'"
    :loading="loading || saveLoading"
    back-to="/companies"
    @save="saveCompany"
    @delete="deleteCompany"
  >
    <template #summary>
      <div class="text-center space-y-4">
        <div v-if="company.logo_url" class="w-20 h-20 mx-auto rounded-full overflow-hidden">
          <img :src="company.logo_url" :alt="company.name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-20 h-20 mx-auto bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-image" class="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ company.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ company.description }}
          </p>
        </div>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-left">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Created</span>
            <span class="text-gray-900 dark:text-white">
              {{ company.created_at ? new Date(company.created_at).toLocaleDateString() : '-' }}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Status</span>
            <UBadge>
              {{ company.is_active ? 'Active' : 'Inactive' }}
            </UBadge>
          </div>
        </div>
      </div>
    </template>

    <template #details>
      <UForm :state="formState" :disabled="loading || saveLoading">
        <div class="space-y-4">        
          <FormGroup label="Company Name" required>
            <UInput size="lg" class="w-full" v-model="formState.name" placeholder="Company name" />
          </FormGroup>
          <FormGroup label="Description">
            <UInput size="lg" class="w-full" v-model="formState.description" placeholder="Company description" />
          </FormGroup>
          <FormGroup label="Company Code" required>
            <UInput size="lg" v-model="formState.slug" placeholder="Company code" />
          </FormGroup>
          <AvatarUpload 
            v-model="formState.logo_url"
            @file-selected="(file) => logo = file"
            label="Company Logo"
          />
        </div>
      </UForm>
    </template>
  </ProfileLayout>
</template>
