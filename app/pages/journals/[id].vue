<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})


const route = useRoute()
const router = useRouter()
const { get, put, del } = useApi()

const journalId = computed(() => route.params.id as string)

const journal = ref<any>(null)
const loading = ref(false)
const saving = ref(false)
const activeTab = ref('details')

const tabs = [
  { key: 'details', label: 'Journal Details', icon: 'i-lucide-file-text' },
  { key: 'entries', label: 'Journal Entries', icon: 'i-lucide-list' }
]

const entryColumns = [
  { key: 'account', label: 'Account', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'debit', label: 'Debit', sortable: true },
  { key: 'credit', label: 'Credit', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false }
]

const fetchJournal = async () => {
  loading.value = true
  try {
    const response = await get(`/v1/ledger/journals/${journalId.value}`)
    journal.value = response.data
    if (!journal.value.entries) {
      journal.value.entries = []
    }
  } catch (error) {
    console.error('Failed to fetch journal:', error)
  } finally {
    loading.value = false
  }
}

const saveJournal = async () => {
  saving.value = true
  try {
    await put(`/v1/ledger/journals/${journalId.value}`, journal.value)
  } catch (error) {
    console.error('Failed to save journal:', error)
  } finally {
    saving.value = false
  }
}

const deleteJournal = async () => {
  if (!confirm('Are you sure you want to delete this journal?')) return
  try {
    await del(`/v1/ledger/journals/${journalId.value}`)
    router.push('/journals')
  } catch (error) {
    console.error('Failed to delete journal:', error)
  }
}

const addEntry = () => {
  if (!journal.value.entries) {
    journal.value.entries = []
  }
  journal.value.entries.push({
    account_id: '',
    description: '',
    debit: 0,
    credit: 0
  })
}

const removeEntry = (index: number) => {
  journal.value.entries.splice(index, 1)
}

const totalDebits = computed(() => {
  if (!journal.value?.entries) return 0
  return journal.value.entries.reduce((sum: number, entry: any) => sum + (parseFloat(entry.debit) || 0), 0)
})

const totalCredits = computed(() => {
  if (!journal.value?.entries) return 0
  return journal.value.entries.reduce((sum: number, entry: any) => sum + (parseFloat(entry.credit) || 0), 0)
})

const isBalanced = computed(() => {
  return totalDebits.value === totalCredits.value
})

onMounted(fetchJournal)
</script>

<template>
  <ProfileLayout
    v-if="journal"
    :title="`Journal ${journal.journal_number}`"
    :subtitle="journal.description || 'No description'"
    :tabs="tabs"
    v-model:active-tab="activeTab"
    :loading="loading"
    :saving="saving"
    @save="saveJournal"
    @delete="deleteJournal"
  >
    <template #summary>
      <div class="space-y-4">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mx-auto mb-3">
            <UIcon name="i-lucide-book-open" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ journal.journal_number }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ new Date(journal.date).toLocaleDateString() }}</p>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Reference</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ journal.reference || 'N/A' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Status</span>
            <UBadge :color="journal.status === 'posted' ? 'green' : 'yellow'" variant="soft">
              {{ journal.status || 'draft' }}
            </UBadge>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Total Debits</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ totalDebits.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">Total Credits</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ totalCredits.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Balance</span>
            <UBadge :color="isBalanced ? 'green' : 'red'" variant="soft" size="sm">
              {{ isBalanced ? 'Balanced' : 'Unbalanced' }}
            </UBadge>
          </div>
        </div>
      </div>
    </template>

    <template #details>
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Journal Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormGroup label="Journal Number" required>
            <UInput v-model="journal.journal_number" />
          </FormGroup>
          <FormGroup label="Date" required>
            <UInput v-model="journal.date" type="date" />
          </FormGroup>
          <FormGroup label="Reference">
            <UInput v-model="journal.reference" />
          </FormGroup>
          <FormGroup label="Status">
            <USelectMenu
              v-model="journal.status"
              :options="[
                { label: 'Draft', value: 'draft' },
                { label: 'Posted', value: 'posted' },
                { label: 'Cancelled', value: 'cancelled' }
              ]"
            />
          </FormGroup>
        </div>
        <FormGroup label="Description">
          <UTextarea v-model="journal.description" rows="3" />
        </FormGroup>
      </div>
    </template>

    <template #entries>
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Journal Entries</h3>
          <UButton
            color="primary"
            icon="i-lucide-plus"
            label="Add Line"
            size="sm"
            @click="addEntry"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th class="px-4 py-3">Account</th>
                <th class="px-4 py-3">Description</th>
                <th class="px-4 py-3 text-right">Debit</th>
                <th class="px-4 py-3 text-right">Credit</th>
                <th class="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, index) in journal.entries"
                :key="index"
                class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <td class="px-4 py-3">
                  <UInput
                    :model-value="entry.account_id"
                    type="number"
                    placeholder="Account ID"
                    size="sm"
                    @update:model-value="entry.account_id = $event ? Number($event) : null"
                  />
                </td>
                <td class="px-4 py-3">
                  <UInput v-model="entry.description" placeholder="Description" size="sm" />
                </td>
                <td class="px-4 py-3">
                  <UInput
                    :model-value="entry.debit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    size="sm"
                    @update:model-value="entry.debit = $event ? Number($event) : 0"
                  />
                </td>
                <td class="px-4 py-3">
                  <UInput
                    :model-value="entry.credit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    size="sm"
                    @update:model-value="entry.credit = $event ? Number($event) : 0"
                  />
                </td>

                <td class="px-4 py-3 text-center">
                  <UButton
                    color="red"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    size="xs"
                    @click="removeEntry(index)"
                  />
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 dark:bg-gray-800 font-semibold">
              <tr>
                <td class="px-4 py-3" colspan="2">Total</td>
                <td class="px-4 py-3 text-right" :class="{ 'text-red-600': !isBalanced }">
                  {{ totalDebits.toFixed(2) }}
                </td>
                <td class="px-4 py-3 text-right" :class="{ 'text-red-600': !isBalanced }">
                  {{ totalCredits.toFixed(2) }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div v-if="!isBalanced" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <UIcon name="i-lucide-alert-triangle" class="w-5 h-5" />
            <span class="font-medium">Journal is not balanced. Total debits must equal total credits.</span>
          </div>
        </div>
      </div>
    </template>
  </ProfileLayout>

  <div v-else-if="loading" class="flex items-center justify-center py-12">
    <ULoadingIcon />
  </div>
</template>
