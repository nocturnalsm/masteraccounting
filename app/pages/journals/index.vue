<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { get, post, del } = useApi()
const router = useRouter()

const columns = [
  { key: 'journal_number', label: 'Journal #', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'reference', label: 'Reference', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'total_amount', label: 'Total', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
]

const journals = ref([])
const loading = ref(false)
const showCreateModal = ref(false)
const createLoading = ref(false)

const fetchJournals = async () => {
  loading.value = true
  try {
    const response = await get('/v1/ledger/journals')
    journals.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch journals:', error)
    journals.value = []
  } finally {
    loading.value = false
  }
}

const createJournal = async (data: any) => {
  createLoading.value = true
  try {
    await post('/v1/ledger/journals', data)
    showCreateModal.value = false
    await fetchJournals()
  } catch (error) {
    console.error('Failed to create journal:', error)
  } finally {
    createLoading.value = false
  }
}

const deleteJournal = async (journal: any) => {
  if (!confirm(`Are you sure you want to delete journal ${journal.journal_number}?`)) return
  try {
    await del(`/v1/ledger/journals/${journal.id}`)
    await fetchJournals()
  } catch (error) {
    console.error('Failed to delete journal:', error)
  }
}

onMounted(fetchJournals)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Journals</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage journal entries and transactions</p>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        label="New Journal"
        @click="showCreateModal = true"
      />
    </div>

    <DataTable
      :columns="columns"
      :data="journals"
      :loading="loading"
      @view="(row) => router.push(`/journals/${row.id}`)"
      @edit="(row) => router.push(`/journals/${row.id}`)"
      @delete="deleteJournal"
    />

    <CreateModal
      v-model:open="showCreateModal"
      title="Create Journal"
      description="Create a new journal entry."
      :loading="createLoading"
      @submit="createJournal"
    >
      <div class="space-y-4">
        <FormGroup label="Journal Number" required>
          <UInput name="journal_number" placeholder="e.g. JV-001" required />
        </FormGroup>
        <FormGroup label="Date" required>
          <UInput name="date" type="date" required />
        </FormGroup>
        <FormGroup label="Reference">
          <UInput name="reference" placeholder="Reference number" />
        </FormGroup>
        <FormGroup label="Description">
          <UTextarea name="description" placeholder="Journal description" />
        </FormGroup>
      </div>
    </CreateModal>
  </div>
</template>
