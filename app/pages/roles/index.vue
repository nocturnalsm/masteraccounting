<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'permission'],
  permissions: ['role-list']
})

const { get, post, del } = useApi()
const router = useRouter()

const columns = [
  { accessorKey: 'name', header: 'Name', sortable: true },
  { accessorKey: 'permissions_count', header: 'Permissions', sortable: true },
  { accessorKey: 'users_count', header: 'Users', sortable: true }
]

const showCreateModal = ref(false)
const createLoading = ref(false)

const page = ref(1)
const sortBy = ref({ column: 'id', direction: 'desc' as const })
const search = ref('')

const { data: response, pending, refresh } = await useAsyncData(
  'roles-list', 
  () => get('/roles', {
    params: {
      page: page.value,
      sort: sortBy.value.column ?? 'name',
      order: sortBy.value.direction ?? 'asc',
      search: search.value
    }
  }),
  {
    // Re-run the fetch whenever these refs change
    watch: [page, sortBy, search]
  }
)

const roles = computed(() => response.value?.data || [])
const total = computed(() => response.value?.total || 0)

const createRole = async (data: any) => {
  createLoading.value = true
  try {
    await post('/roles', data)
    showCreateModal.value = false
  } catch (error) {
    console.error('Failed to create role:', error)
  } finally {
    createLoading.value = false
  }
}

const deleteRole = async (role: any) => {
  if (!confirm(`Are you sure you want to delete ${role.name}?`)) return
  try {
    await del(`/roles/${role.id}`)
  } catch (error) {
    console.error('Failed to delete role:', error)
  }
}

</script>

<template>
  <div class="space-y-4">
    <div class="block space-y-2 md:space-y-0 text-center md:text-start md:flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Roles</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage system roles and permissions</p>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        label="Add Role"
        @click="showCreateModal = true"
      />
    </div>

    <DataTable
      v-model:page="page" 
      v-model:sort="sortBy"
      :total="total"
      :columns="columns"
      :data="roles"
      :loading="pending"
      :page-size="10"
      @search="(value) => search = value"
      @view="(row) => router.push(`/roles/${row.id}`)"
      @edit="(row) => router.push(`/roles/${row.id}`)"
      @delete="deleteRole"
    />

    <CreateModal
      v-model:open="showCreateModal"
      title="Create Role"
      description="Add a new role to the system."
      :loading="createLoading"
      @submit="createRole"
    >
      <div class="space-y-4">
        <FormGroup label="Role Name" required>
          <UInput name="name" placeholder="e.g. editor, manager" required />
        </FormGroup>
        <FormGroup label="Guard Name">
          <USelectMenu
            name="guard_name"
            :options="[
              { label: 'Web', value: 'web' },
              { label: 'API', value: 'api' }
            ]"
          />
        </FormGroup>
      </div>
    </CreateModal>
  </div>
</template>
