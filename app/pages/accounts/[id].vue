<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})


const route = useRoute()
const router = useRouter()
const { get, put, del } = useApi()

const accountId = computed(() => route.params.id as string)

const account = ref<any>(null)
const loading = ref(false)
const saving = ref(false)
const activeTab = ref('details')

const accountTypes = [
  { label: 'Asset', value: 'asset' },
  { label: 'Liability', value: 'liability' },
  { label: 'Equity', value: 'equity' },
  { label: 'Revenue', value: 'revenue' },
  { label: 'Expense', value: 'expense' }
]

const tabs = [
  { key: 'details', label: 'Details', icon: 'i-lucide-file-text' },
  { key: 'ledger', label: 'Ledger Entries', icon: 'i-lucide-book-open' },
  { key: 'settings', label: 'Settings', icon: 'i-lucide-settings' }
]

const fetchAccount = async () => {
  loading.value = true
  try {
    const response = await get(`/v1/ledger/accounts/${accountId.value}`)
    account.value = response.data
  } catch (error) {
    console.error('Failed to fetch account:', error)
  } finally {
    loading.value = false
  }
}

const saveAccount = async () => {
  saving.value = true
  try {
    await put(`/v1/ledger/accounts/${accountId.value}`, account.value)
  } catch (error) {
    console.error('Failed to save account:', error)
  } finally {
    saving.value = false
  }
}

const deleteAccount = async () => {
  if (!confirm('Are you sure you want to delete this account?')) return
  try {
    await del(`/v1/ledger/accounts/${accountId.value}`)
    router.push('/accounts')
  } catch (error) {
    console.error('Failed to delete account:', error)
  }
}

onMounted(fetchAccount)
</script>

<template>
  <ProfileLayout
    v-if="account"
    :title="account.name"
    :subtitle="`Code: ${account.code} | Type: ${account.type}`"
    :tabs="tabs"
    v-model:active-tab="activeTab"
    :loading="loading"
    :saving="saving"
    @save="saveAccount"
    @delete="deleteAccount"
  >
    <template #summary>
      <div class="space-y-4">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-calculator" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ account.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ account.code }}</p>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Type</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">{{ account.type }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Category</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ account.category || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Balance</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ account.balance || '0.00' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Created</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ new Date(account.created_at).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #details>
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Account Code" required>
            <UInput v-model="account.code" />
          </FormGroup>
          <FormGroup label="Account Name" required>
            <UInput v-model="account.name" />
          </FormGroup>
          <FormGroup label="Account Type" required>
            <USelectMenu v-model="account.type" :options="accountTypes" />
          </FormGroup>
          <FormGroup label="Category">
            <UInput v-model="account.category" placeholder="e.g. Current Asset" />
          </FormGroup>
          <FormGroup label="Parent Account">
            <UInput
              :model-value="account.parent_id"
              type="number"
              placeholder="Parent account ID"
              @update:model-value="account.parent_id = $event ? Number($event) : null"
            />
          </FormGroup>

          <FormGroup label="Opening Balance">
            <UInput
              :model-value="account.opening_balance"
              type="number"
              step="0.01"
              @update:model-value="account.opening_balance = $event ? Number($event) : null"
            />
          </FormGroup>

        </div>
        <FormGroup label="Description">
          <UTextarea v-model="account.description" rows="4" />
        </FormGroup>
      </div>
    </template>

    <template #ledger>
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ledger Entries</h3>
        <p class="text-gray-600 dark:text-gray-400">View all transactions for this account.</p>
        <!-- Ledger entries would be fetched and displayed here -->
        <div class="text-center py-12 text-gray-500 dark:text-gray-400">
          <UIcon name="i-lucide-book-open" class="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Ledger entries will be displayed here</p>
        </div>
      </div>
    </template>

    <template #settings>
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h3>
        <div class="space-y-4">
          <FormGroup label="Status">
            <USwitch v-model="account.is_active" />
          </FormGroup>
          <FormGroup label="Allow Direct Posting">
            <USwitch v-model="account.allow_direct_posting" />
          </FormGroup>
          <FormGroup label="Reconciliation Account">
            <USwitch v-model="account.is_reconciliation" />
          </FormGroup>
        </div>
      </div>
    </template>
  </ProfileLayout>

  <div v-else-if="loading" class="flex items-center justify-center py-12">
    <ULoadingIcon />
  </div>
</template>
