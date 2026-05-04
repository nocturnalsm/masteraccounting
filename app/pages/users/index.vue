<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'permission'],
  permissions: ['user-list']
})

const { get, post, del } = useApi()
const router = useRouter()

const columns = [
  { accessorKey: 'name', header: 'Name', sortable: true },
  { accessorKey: 'email', header: 'Email', sortable: true },
  { accessorKey: 'role', header: 'Role', sortable: true },
  { accessorKey: 'company', header: 'Company', sortable: true }
]

const page = ref(1)
const sortBy = ref({ column: 'id', direction: 'desc' as const })
const search = ref('')
const showCreateModal = ref(false)
const createLoading = ref(false)

const { data: response, pending, refresh } = await useAsyncData(
  'users-list', 
  () => get('/users', {
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

const users = computed(() => response.value?.data || [])
const total = computed(() => response.value?.total || 0)

const createUser = async (data: any) => {
  createLoading.value = true
  try {
    await post('/users', data)
    showCreateModal.value = false
  } catch (error) {
    console.error('Failed to create user:', error)
  } finally {
    createLoading.value = false
  }
}

const deleteUser = async (user: any) => {
  if (!confirm(`Are you sure you want to delete ${user.name}?`)) return
  try {
    await del(`/users/${user.id}`)
  } catch (error) {
    console.error('Failed to delete user:', error)
  }
}

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage system users</p>
      </div>
      <UButton
        color="primary"
        icon="i-lucide-plus"
        label="Add User"
        @click="showCreateModal = true"
      />
    </div>

    <DataTable
      v-model:page="page"
      v-model:sort="sortBy"
      v-model:search="search"
      :columns="columns"
      :data="users"
      :total="total"
      :loading="pending"
      :page-size="10"
      @view="(row) => router.push(`/users/${row.id}`)"
      @edit="(row) => router.push(`/users/${row.id}`)"
      @delete="deleteUser"
    />

    <CreateModal
      v-model:open="showCreateModal"
      title="Create User"
      description="Add a new user to the system."
      :loading="createLoading"
      @submit="createUser"
    >
      <div class="space-y-4">
        <FormGroup label="Name" required>
          <UInput name="name" placeholder="Full name" required />
        </FormGroup>
        <FormGroup label="Email" required>
          <UInput name="email" type="email" placeholder="user@example.com" required />
        </FormGroup>
        <FormGroup label="Password" required>
          <UInput name="password" type="password" placeholder="Secure password" required />
        </FormGroup>
        <FormGroup label="Role">
          <USelect
            name="role"
            :options="[
              { label: 'Admin', value: 'admin' },
              { label: 'Manager', value: 'manager' },
              { label: 'User', value: 'user' }
            ]"
          />
        </FormGroup>
        <FormGroup label="Company">
          <USelect name="company_id" :options="[]" placeholder="Select company" />
        </FormGroup>
      </div>
    </CreateModal>
  </div>
</template>
