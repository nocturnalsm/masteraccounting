<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { get, put, del } = useApi()

const permission = ref<any>({})
const roles = ref([])
const permissionRoles = ref([])
const loading = ref(false)
const saveLoading = ref(false)

const fetchPermission = async () => {
  loading.value = true
  try {
    const response = await get(`/permissions/${route.params.id}`)
    permission.value = response.data || {}
    permissionRoles.value = response.data?.roles || []
  } catch (error) {
    console.error('Failed to fetch permission:', error)
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await get('/roles')
    roles.value = response.data || []
  } catch (error) {
    console.error('Failed to fetch roles:', error)
  }
}

const savePermission = async () => {
  saveLoading.value = true
  try {
    await put(`/permissions/${route.params.id}`, {
      ...permission.value,
      roles: permissionRoles.value
    })
    await fetchPermission()
  } catch (error) {
    console.error('Failed to save permission:', error)
  } finally {
    saveLoading.value = false
  }
}

const deletePermission = async () => {
  if (!confirm('Are you sure you want to delete this permission?')) return
  try {
    await del(`/permissions/${route.params.id}`)
    router.push('/permissions')
  } catch (error) {
    console.error('Failed to delete permission:', error)
  }
}

const toggleRole = (role: any) => {
  const index = permissionRoles.value.findIndex((r: any) => r.id === role.id)
  if (index > -1) {
    permissionRoles.value.splice(index, 1)
  } else {
    permissionRoles.value.push(role)
  }
}

const isRoleSelected = (role: any) => {
  return permissionRoles.value.some((r: any) => r.id === role.id)
}

onMounted(() => {
  fetchPermission()
  fetchRoles()
})
</script>

<template>
  <div v-if="loading" class="flex justify-center py-12">
    <ULoadingIcon />
  </div>

  <ProfileLayout
    v-else
    :title="permission.name || 'Permission Details'"
    back-to="/permissions"
    @save="savePermission"
    @delete="deletePermission"
  >
    <template #summary>
      <div class="text-center space-y-4">
        <div class="w-20 h-20 mx-auto bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
          <UIcon name="i-lucide-key" class="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ permission.name }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ permission.guard_name }}
          </p>
        </div>
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-left">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">Roles</span>
            <span class="text-gray-900 dark:text-white">{{ permissionRoles.length }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #details>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permission Name</label>
          <UInput v-model="permission.name" placeholder="Permission name" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Guard Name</label>
          <USelectMenu
            v-model="permission.guard_name"
            :options="[
              { label: 'Web', value: 'web' },
              { label: 'API', value: 'api' }
            ]"
          />
        </div>
      </div>
    </template>

    <template #settings>
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-900 dark:text-white">Roles</h4>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="role in roles"
            :key="role.id"
            class="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div class="flex items-center gap-3">
              <UCheckbox
                :model-value="isRoleSelected(role)"
                @update:model-value="toggleRole(role)"
              />
              <span class="text-sm text-gray-900 dark:text-white">{{ role.name }}</span>
            </div>
            <UBadge size="xs" variant="subtle">{{ role.guard_name }}</UBadge>
          </div>
        </div>
      </div>
    </template>
  </ProfileLayout>
</template>
