<script setup lang="ts">


const { user, logout } = useAuth()

const masterItems = [
  { label: 'Companies', icon: 'i-lucide-building-2', to: '/companies', permission: 'company-list' },
  { label: 'Users', icon: 'i-lucide-users', to: '/users', permission: 'user-list' },
  { separator: true },
  { label: 'Permissions', icon: 'i-lucide-shield', to: '/permissions', permission: 'permission-list' },
  { label: 'Roles', icon: 'i-lucide-user-cog', to: '/roles', permission: 'role-list' },
  { separator: true },
  { label: 'Accounts', icon: 'i-lucide-book-open', to: '/accounts', permission: 'account-list' }
]

const ledgerItems = [
  { label: 'Journals', icon: 'i-lucide-file-text', to: '/journals', permission: 'journal-list' },
  { label: 'Trial Balance', icon: 'i-lucide-calculator', to: '/trial-balance', permission: 'trialbalance-list' },
  { label: 'Financial Statements', icon: 'i-lucide-pie-chart', to: '/financial-statements', permission: 'financialstatements-list' }
]

const open = ref(false)

</script>

<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo & Navigation -->
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-2">
            <AppLogo class="w-8 h-8" />
            <span class="font-bold text-xl text-gray-900 dark:text-white">Master Accounting</span>
          </NuxtLink>

          <nav class="hidden md:flex items-center gap-1">
            <!-- Dashboard -->
            <UButton
              to="/"
              variant="ghost"
              color="neutral"
              icon="i-lucide-layout-dashboard"
              label="Dashboard"
            />

            <!-- Master Data Mega Menu -->
            <UPopover mode="hover">
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-lucide-calculator"
                label="Master Data"
                trailing-icon="i-lucide-chevron-down"
              />

              <template #content>
                <div class="p-4 w-64">                  
                  <div class="grid gap-1">
                    <template v-for="item in masterItems" :key="item.to">
                      <USeparator v-if="item.separator" />
                      <template v-else>
                        <UButton v-if="!item.permission || user && user.permissions.includes(item.permission)"                      
                          :to="item.to"
                          variant="ghost"
                          color="neutral"
                          class="justify-start"
                          :icon="item.icon"
                          :label="item.label"
                        />
                      </template>
                    </template>
                  </div>
                </div>
              </template>
            </UPopover>
              
            <!-- Ledger Mega Menu -->
            <UPopover mode="hover">
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-lucide-calculator"
                label="Ledger"
                trailing-icon="i-lucide-chevron-down"
              />

              <template #content>
                <div class="p-4 w-64">
                  <div class="grid gap-1">
                    <UButton
                      v-for="item in ledgerItems"
                      :key="item.to"
                      :to="item.to"
                      variant="ghost"
                      color="neutral"
                      class="justify-start"
                      :icon="item.icon"
                      :label="item.label"
                    />
                  </div>
                </div>
              </template>
            </UPopover>
          </nav>
        </div>

        <!-- Right Side -->
        <div class="flex items-center gap-2">
          <!-- Mobile Menu -->
          <UDrawer v-model:open="open" direction="right" class="md:hidden">
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-menu"
            />

            <template #content>
              <div class="p-4 space-y-4">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Master Data</p>
                <UButton
                  v-for="item in masterItems"
                  :key="item.to"
                  :to="item.to"
                  variant="ghost"
                  color="neutral"
                  class="justify-start w-full"
                  :icon="item.icon"
                  :label="item.label"
                  @click="open = false"
                />
                <USeparator />
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ledger</p>
                <UButton
                  v-for="item in ledgerItems"
                  :key="item.to"
                  :to="item.to"
                  variant="ghost"
                  color="neutral"
                  class="justify-start w-full"
                  :icon="item.icon"
                  :label="item.label"
                  @click="open = false"
                />
              </div>
            </template>
          </UDrawer>

          <!-- Help Menu -->
          <UPopover mode="hover" class="md:block hidden">
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              class="w-10 h-10 rounded-full p-0"
              icon="i-lucide-help-circle"
            />
            <template #content>
              <div class="p-4 w-64">
                <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Help & Support
                </p>
                <div class="grid gap-1">
                  <UButton to="/help/dashboard" variant="ghost" class="justify-start" icon="i-lucide-layout-dashboard" label="Dashboard Guide" />
                  <UButton to="/help/accounts" variant="ghost" class="justify-start" icon="i-lucide-book-open" label="Accounts Help" />
                  <UButton to="/help/journals" variant="ghost" class="justify-start" icon="i-lucide-file-text" label="Journals Tutorial" />
                </div>
              </div>
            </template>
          </UPopover>

          <!-- Notification Menu -->
          <UPopover mode="hover" class="md:block hidden">
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              class="w-10 h-10 rounded-full p-0 relative"
              icon="i-lucide-bell"
            />
            <template #content>
              <div class="p-4 w-80 max-h-96 overflow-y-auto">
                <p class="text-sm font-semibold mb-3">Notifications</p>
                <div class="space-y-2">
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="font-medium">New journal entry created</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                  </div>
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p class="font-medium">Account balance updated</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                  </div>
                  <div class="p-3 text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No more notifications
                  </div>
                </div>
              </div>
            </template>
          </UPopover>

          <!-- User Menu -->
          <UPopover v-if="user" mode="hover">
            <UButton
              variant="ghost"
              color="neutral"
              class="gap-2 rounded-full px-2 py-1"
            >
              <UAvatar
                :alt="user.name"
                size="md"
              />
            </UButton>

            <template #content>
                <div class="p-2 w-min-48">
                  <div class="px-3 py-2 mb-2 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                  </div>
                  <UButton to="/profile" variant="ghost" class="justify-start w-full" icon="i-lucide-user" label="Profile" />
                  <UButton to="/settings" variant="ghost" class="justify-start w-full" icon="i-lucide-settings" label="Settings" />
                  <UButton variant="ghost" class="justify-start w-full" icon="i-lucide-log-out" label="Sign out" @click="logout" />
                </div>
            </template>
          </UPopover>
        </div>
      </div>
    </div>
  </header>
</template>
