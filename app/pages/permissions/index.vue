<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'permission'],
  permissions: ['permission-list']
})

const { get, post, del } = useApi()
const router = useRouter()

const columns = [
  { accessorKey: 'name', header: 'Name', sortable: true }
]

const showCreateModal = ref(false)
const createLoading = ref(false)

const page = ref(1)
const sortBy = ref({ column: 'id', direction: 'desc' as const })
const search = ref('')

const { data: response, pending, refresh } = await useAsyncData(
  'permissions-list', 
  () => get('/permissions', {
    params: {
      page: page.value,
      sort: sortBy.value.column ?? 'name',
      order: sortBy.value.direction ?? 'asc',
      search: search.value,
      limit: 10
    }
  }),
  {
    // Re-run the fetch whenever these refs change
    watch: [page, sortBy, search]
  }
)

const permissions = computed(() => response.value?.data || [])
const total = computed(() => response.value?.total || 0)

const createPermission = async (data: any) => {
  createLoading.value = true
  try {
    await post('/permissions', data)
    showCreateModal.value = false    
  } catch (error) {
    console.error('Failed to create permission:', error)
  } finally {
    createLoading.value = false
  }
}

const deletePermission = async (permission: any) => {
  if (!confirm(`Are you sure you want to delete ${permission.name}?`)) return
  try {
    await del(`/permissions/${permission.id}`)
  } catch (error) {
    console.error('Failed to delete permission:', error)
  }
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Permissions</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage system permissions</p>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        label="Add Permission"
        @click="showCreateModal = true"
      />
    </div>

    <DataTable
      v-model:page="page"
      v-model:sort="sortBy"
      :columns="columns"
      :data="permissions"
      :loading="pending"
      :total="total"
      :page-size="10"
      @search="(val) => search = val"
    />

    <CreateModal
      v-model:open="showCreateModal"
      title="Create Permission"
      description="Add a new permission to the system."
      :loading="createLoading"
      @submit="createPermission"
    >
      <div class="space-y-4">
        <FormGroup label="Permission Name" required>
          <UInput size="lg" name="name" placeholder="e.g. view users, edit companies" required class="w-full" />
        </FormGroup>
      </div>
    </CreateModal>
  </div>
</template>
