<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})


const route = useRoute()
const router = useRouter()
const { get, put, del } = useApi()

const company = ref<any>({})
const loading = ref(false)
const saveLoading = ref(false)

const fetchCompany = async () => {
  loading.value = true
  try {
    const response = await get(`/companies/${route.params.id}`)
    company.value = response || {}
  } catch (error) {
    console.error('Failed to fetch company:', error)
  } finally {
    loading.value = false
  }
}

const saveCompany = async () => {
  saveLoading.value = true
  try {
    await put(`/companies/${route.params.id}`, company.value)
    await fetchCompany()
  } catch (error) {
    console.error('Failed to save company:', error)
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
  <div v-if="loading" class="flex justify-center py-12">
    <USkeleton class="w-full" />
  </div>

  <ProfileLayout
    v-else
    :title="company.name || 'Company Details'"
    back-to="/companies"
    @save="saveCompany"
    @delete="deleteCompany"
  >
    <template #summary>
      <div class="text-center space-y-4">
        <div class="w-20 h-20 mx-auto bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-building-2" class="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ company.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ company.code }}
          </p>
        </div>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-left">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Email</span>
            <span class="text-gray-900 dark:text-white">{{ company.email || '-' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Phone</span>
            <span class="text-gray-900 dark:text-white">{{ company.phone || '-' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Created</span>
            <span class="text-gray-900 dark:text-white">
              {{ company.created_at ? new Date(company.created_at).toLocaleDateString() : '-' }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #details>
      <div class="space-y-4">
        <FormGroup label="Company Name" required>
          <UInput v-model="company.name" placeholder="Company name" />
        </FormGroup>
        <FormGroup label="Company Code" required>
          <UInput v-model="company.code" placeholder="Company code" />
        </FormGroup>
        <FormGroup label="Email">
          <UInput v-model="company.email" type="email" placeholder="company@example.com" />
        </FormGroup>
        <FormGroup label="Phone">
          <UInput v-model="company.phone" placeholder="+1 234 567 890" />
        </FormGroup>
        <FormGroup label="Address">
          <UTextarea v-model="company.address" placeholder="Company address" />
        </FormGroup>
      </div>
    </template>

    <template #settings>
      <div class="space-y-4">
        <FormGroup label="Status">
          <USwitch v-model="company.is_active" />
        </FormGroup>
        <FormGroup label="Fiscal Year Start">
          <UInput v-model="company.fiscal_year_start" type="date" />
        </FormGroup>
        <FormGroup label="Base Currency">
          <USelectMenu
            v-model="company.currency"
            :options="[
              { label: 'USD', value: 'USD' },
              { label: 'EUR', value: 'EUR' },
              { label: 'GBP', value: 'GBP' }
            ]"
          />
        </FormGroup>
      </div>
    </template>
  </ProfileLayout>
</template>
