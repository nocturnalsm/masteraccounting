<script setup lang="ts">

import { h, resolveComponent, ref } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { get, post, del } = useApi()
const router = useRouter()

const UBadge = resolveComponent('UBadge')

const columns = [
  { accessorKey: 'name', header: 'Name', sortable: true },
  { accessorKey: 'is_active', header: 'Active', sortable: true, cell: ({ row }) => {    
    const isActive = row.getValue('is_active')
    const color = isActive ? 'success' : 'error'
    return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
      row.getValue('is_active') ? 'Active' : 'Inactive'
    )
  }},
  { accessorKey: 'actions', header: 'Actions', sortable: false }
]

const showCreateModal = ref(false)
const createLoading = ref(false)

const page = ref(1)
const sortBy = ref({ column: 'id', direction: 'desc' as const })
const search = ref('')

const { data: response, pending, refresh } = await useAsyncData(
  'companies-list', 
  () => get('/companies', {
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

const companies = computed(() => response.value?.data || [])
const total = computed(() => response.value?.total || 0)

const createCompany = async (data: any) => {
  createLoading.value = true
  try {
    await post('/companies', data)
    showCreateModal.value = false    
  } catch (error) {
    console.error('Failed to create company:', error)
  } finally {
    createLoading.value = false
  }
}

const deleteCompany = async (company: any) => {
  if (!confirm(`Are you sure you want to delete ${company.name}?`)) return
  try {
    await del(`/companies/${company.id}`)
  } catch (error) {
    console.error('Failed to delete company:', error)
  }
}


</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Companies</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your companies</p>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        label="Add Company"
        @click="showCreateModal = true"
      />
    </div>

    <DataTable
      v-model:page="page"
      v-model:sort="sortBy"
      :data="companies"
      :columns="columns"
      :loading="pending"
      :total="total"
      :page-size="10"
      @update:sort="(sort) => sortBy = sort"
      @search="(val) => search = val"
    />

    <CreateModal
      v-model:open="showCreateModal"
      title="Create Company"
      description="Add a new company to your system."
      :loading="createLoading"
      @submit="createCompany"
    >
      <div class="space-y-4">
        <FormGroup label="Name" required>
          <UInput name="name" placeholder="Company name" required />
        </FormGroup>
        <FormGroup label="Code" required>
          <UInput name="code" placeholder="Company code" required />
        </FormGroup>
        <FormGroup label="Email">
          <UInput name="email" type="email" placeholder="company@example.com" />
        </FormGroup>
        <FormGroup label="Phone">
          <UInput name="phone" placeholder="+1 234 567 890" />
        </FormGroup>
        <FormGroup label="Address">
          <UTextarea name="address" placeholder="Company address" />
        </FormGroup>
      </div>
    </CreateModal>
  </div>
</template>
