<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { get, post, del } = useApi()
const router = useRouter()

const columns = [
  { accessorKey: 'code', header: 'Code', sortable: true },
  { accessorKey: 'name', header: 'Name', sortable: true },
  { accessorKey: 'type', header: 'Type', sortable: true },
  { accessorKey: 'category', header: 'Category', sortable: true },
  { accessorKey: 'balance', header: 'Balance', sortable: true },
  { accessorKey: 'actions', header: 'Actions', sortable: false }
]

const showCreateModal = ref(false)
const createLoading = ref(false)

const accountTypes = [
  { label: 'Asset', value: 'asset' },
  { label: 'Liability', value: 'liability' },
  { label: 'Equity', value: 'equity' },
  { label: 'Revenue', value: 'revenue' },
  { label: 'Expense', value: 'expense' }
]

const page = ref(1)
const sortBy = ref({ column: 'id', direction: 'desc' as const })
const search = ref('')

const { data: response, pending, refresh } = await useAsyncData(
  'accounts-list', 
  () => get('/ledger/accounts', {
    params: {
      page: page.value,
      sort: sortBy.value.column,
      order: sortBy.value.direction,
      search: search.value
    }
  }),
  {
    // Re-run the fetch whenever these refs change
    watch: [page, sortBy, search]
  }
)

const accounts = computed(() => response.value?.data || [])
const total = computed(() => response.value?.total || 0)

const createAccount = async (data: any) => {
  createLoading.value = true
  try {
    await post('/ledger/accounts', data)
    showCreateModal.value = false
  } catch (error) {
    console.error('Failed to create account:', error)
  } finally {
    createLoading.value = false
  }
}

const deleteAccount = async (account: any) => {
  if (!confirm(`Are you sure you want to delete ${account.name}?`)) return
  try {
    await del(`/ledger/accounts/${account.id}`)
  } catch (error) {
    console.error('Failed to delete account:', error)
  }
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Chart of Accounts</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your chart of accounts</p>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        label="Add Account"
        @click="showCreateModal = true"
      />
    </div>

    <DataTable
      v-model:page="page"
      v-model:sort="sortBy"
      :total="total"
      :columns="columns"
      :data="accounts"
      :page-size="10"
      :loading="pending"
      @view="(row) => router.push(`/accounts/${row.id}`)"
      @edit="(row) => router.push(`/accounts/${row.id}`)"
      @delete="deleteAccount"
    />

    <CreateModal
      v-model:open="showCreateModal"
      title="Create Account"
      description="Add a new account to the chart of accounts."
      :loading="createLoading"
      @submit="createAccount"
    >
      <div class="space-y-4">
        <FormGroup label="Account Code" required>
          <UInput name="code" placeholder="e.g. 1000" required />
        </FormGroup>
        <FormGroup label="Account Name" required>
          <UInput name="name" placeholder="e.g. Cash" required />
        </FormGroup>
        <FormGroup label="Account Type" required>
          <USelect name="type" :options="accountTypes" required />
        </FormGroup>
        <FormGroup label="Category">
          <UInput name="category" placeholder="e.g. Current Asset" />
        </FormGroup>
        <FormGroup label="Description">
          <UTextarea name="description" placeholder="Account description" />
        </FormGroup>
      </div>
    </CreateModal>
  </div>
</template>
