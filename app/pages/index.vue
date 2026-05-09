<script setup lang="ts">

definePageMeta({
  middleware: 'auth',
})

const { user } = useAuth()
const { get } = useApi()
const { data, pending, refresh } = await useAsyncData(
  'stats', 
  () => get('/dashboard/stats')
)

const dataFormat = {
  companies_count: { label: 'Companies', icon: 'i-lucide-building-2', color: 'blue' },
  users_count: { label: 'Users', icon: 'i-lucide-users', color: 'green' },
  accounts_count: { label: 'Accounts', icon: 'i-lucide-book-open', color: 'purple' }, 
} 

const stats = computed(() => {
  const statsData: any[] = []

  if (!data.value) return []

  Object.keys(data.value).forEach(key => {
    statsData.push({
      ...dataFormat[key],
      value: data.value[key] ?? '0',
    })
  })

  return statsData
})

const recentActivity = [
  { action: 'Created journal entry', user: 'John Doe', time: '2 minutes ago' },
  { action: 'Updated account', user: 'Jane Smith', time: '15 minutes ago' },
  { action: 'Added new company', user: 'Admin', time: '1 hour ago' },
  { action: 'Modified role permissions', user: 'Super Admin', time: '3 hours ago' }
]



const masterItems = [
  [
    { label: 'Companies' },
    { label: 'Users' }
  ]
]
</script>

<template>
  <div class="space-y-8">
    <!-- Welcome -->          
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Welcome back, {{ user?.first_name ?? 'User' }}
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        Here's what's happening in your accounting system today.
      </p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard
        v-for="stat in (pending ? 3 : stats)"
        :key="pending ? stat : stat.label"
        class="hover:shadow-lg transition-shadow"
      >
        <div v-if="pending" class="flex items-center gap-4">
          <!-- Skeleton -->
          <USkeleton class="w-12 h-12 rounded-lg" />
          <div class="space-y-2">
            <USkeleton class="h-3 w-20" />
            <USkeleton class="h-6 w-12" />
          </div>
        </div>

        <div v-else class="flex items-center gap-4">
          <div
            class="p-3 rounded-lg"
            :class="`bg-${stat.color}-100 dark:bg-${stat.color}-900/20`"
          >
            <UIcon
              :name="stat.icon"
              class="w-6 h-6"
              :class="`text-${stat.color}-600 dark:text-${stat.color}-400`"
            />
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Recent Activity -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-activity" class="w-5 h-5" />
          <h2 class="text-lg font-semibold">Recent Activity</h2>
        </div>
      </template>

      <div class="space-y-4">
        <div
          v-for="(activity, index) in recentActivity"
          :key="index"
          class="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
        >
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-primary-500" />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ activity.action }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                by {{ activity.user }}
              </p>
            </div>
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ activity.time }}
          </span>
        </div>
      </div>
    </UCard>

    <!-- Quick Links -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Master Data</h2>
        </template>
        <div class="grid grid-cols-2 gap-3">
          <UButton to="/companies" variant="soft" color="primary" block>
            Companies
          </UButton>
          <UButton to="/users" variant="soft" color="primary" block>
            Users
          </UButton>
          <UButton to="/roles" variant="soft" color="primary" block>
            Roles
          </UButton>
          <UButton to="/permissions" variant="soft" color="primary" block>
            Permissions
          </UButton>
          <UButton to="/accounts" variant="soft" color="primary" block class="col-span-2">
            Chart of Accounts
          </UButton>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Transactions</h2>
        </template>
        <div class="space-y-3">
          <UButton to="/journals" variant="soft" color="primary" block>
            Journal Entries
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
