<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})


const route = useRoute()
const router = useRouter()
const { get, put, del } = useApi()

const role = ref<any>({})
const permissions = ref([])
const rolePermissions = ref([])
const loading = ref(false)
const saveLoading = ref(false)

const fetchRole = async () => {
  loading.value = true
  try {
    const response = await get(`/roles/${route.params.id}`)
    role.value = response.data || {}
    rolePermissions.value = response.data?.permissions || []
  } catch (error) {
    console.error('Failed to fetch role:', error)
  } finally {
    loading.value = false
  }
}

const fetchPermissions = async () => {
  try {
    const response = await get('/permissions')
    permissions.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch permission:', error)
  }
}

const saveRole = async () => {
  saveLoading.value = true
  try {
    await put(`/roles/${route.params.id}`, {
      ...role.value,
      permission: rolePermissions.value
    })
    await fetchRole()
  } catch (error) {
    console.error('Failed to save role:', error)
  } finally {
    saveLoading.value = false
  }
}

const deleteRole = async () => {
  if (!confirm('Are you sure you want to delete this role?')) return
  try {
    await del(`/roles/${route.params.id}`)
    router.push('/roles')
  } catch (error) {
    console.error('Failed to delete role:', error)
  }
}

const togglePermission = (permission: any) => {
  const index = rolePermissions.value.findIndex((p: any) => p.id === permission.id)
  if (index > -1) {
    rolePermissions.value.splice(index, 1)
  } else {
    rolePermissions.value.push(permission)
  }
}

const isPermissionSelected = (permission: any) => {
  return rolePermissions.value.some((p: any) => p.id === permission.id)
}

onMounted(() => {
  fetchRole()
  fetchPermissions()
})
</script>

<template>
  <div v-if="loading" class="flex justify-center py-12">
    <ULoadingIcon />
  </div>

  <ProfileLayout
    v-else
    :title="role.name || 'Role Details'"
    back-to="/roles"
    @save="saveRole"
    @delete="deleteRole"
  >
    <template #summary>
      <div class="text-center space-y-4">
        <div class="w-20 h-20 mx-auto bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-shield" class="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ role.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ role.guard_name }}
          </p>
        </div>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-left">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Permissions</span>
            <span class="text-gray-900 dark:text-white">{{ rolePermissions.length }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Users</span>
            <span class="text-gray-900 dark:text-white">{{ role.users_count || 0 }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #details>
      <div class="space-y-4">
        <FormGroup label="Role Name" required>
          <UInput v-model="role.name" placeholder="Role name" />
        </FormGroup>
        <FormGroup label="Guard Name">
          <USelectMenu
            v-model="role.guard_name"
            :options="[
              { label: 'Web', value: 'web' },
              { label: 'API', value: 'api' }
            ]"
          />
        </FormGroup>
      </div>
    </template>

    <template #settings>
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white">Permissions</h4>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="permission in permissions"
            :key="permission.id"
            class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div class="flex items-center gap-3">
              <UCheckbox
                :model-value="isPermissionSelected(permission)"
                @update:model-value="togglePermission(permission)"
              />
              <span class="text-sm text-gray-900 dark:text-white">{{ permission.name }}</span>
            </div>
            <UBadge size="xs" variant="subtle">{{ permission.guard_name }}</UBadge>
          </div>
        </div>
      </div>
    </template>
  </ProfileLayout>
</template>
