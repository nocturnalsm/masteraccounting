<template>  
    <div class="w-full mx-auto space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p class="text-gray-600 dark:text-gray-400">Manage your settings</p>
      </div>
      <!-- Tabs Container -->
      <UCard class="bg-white w-full">
        <UTabs 
          :items="tabs"
        >
            <!-- Custom Fields Tab -->
            <template #custom_fields>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Custom Fields</h3>
                <div class="space-y-4">
                  <UCard>
                    <template #header>
                      <div class="flex items-center space-x-3">
                        <UIcon name="i-heroicons-user" class="w-5 h-5 text-gray-500" />
                        <span class="font-medium text-gray-900">User Fields</span>
                      </div>
                    </template>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <UInput 
                        v-model="userFields.name" 
                        label="Full Name" 
                        placeholder="Enter full name"
                      />
                      <UInput 
                        v-model="userFields.phone" 
                        label="Phone Number" 
                        placeholder="Enter phone number"
                      />
                      <UTextarea 
                        v-model="userFields.bio" 
                        label="Bio" 
                        placeholder="Tell us about yourself"
                        :rows="3"
                      />
                    </div>
                  </UCard>

                  <UCard>
                    <template #header>
                      <div class="flex items-center space-x-3">
                        <UIcon name="i-heroicons-tag" class="w-5 h-5 text-gray-500" />
                        <span class="font-medium text-gray-900">Product Fields</span>
                      </div>
                    </template>
                    <UButton 
                      label="Add New Field" 
                      icon="i-heroicons-plus"
                      variant="outline"
                      class="mb-4"
                    />
                    <div class="space-y-3">
                      <div v-for="field in productFields" :key="field.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p class="font-medium text-gray-900">{{ field.name }}</p>
                          <p class="text-sm text-gray-500">{{ field.type }}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                          <UButton size="sm" variant="ghost" icon="i-heroicons-pencil" />
                          <UButton size="sm" variant="ghost" color="red" icon="i-heroicons-trash" />
                        </div>
                      </div>
                    </div>
                  </UCard>
                </div>
              </div>
            </template>
            <template #activity_log>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Activity Log</h3>
                <div class="space-y-4">
                  <UInput 
                    v-model="searchQuery" 
                    :placeholder="`Search ${activityLogs.length} activities...`"
                    icon="i-heroicons-magnifying-glass"
                    class="max-w-md"
                  />
                  <div class="overflow-x-auto">                    
                  </div>
                </div>
              </div>
            </template>
            <template #color_theme>
                <SettingsTheme />
            </template>
            <template #misc>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Miscellaneous Settings</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UCard>
                    <template #header>
                      <h4 class="font-semibold text-gray-900">Notifications</h4>
                    </template>
                    <div class="space-y-4">
                      <UCheckbox v-model="notifications.email" label="Email notifications" />
                      <UCheckbox v-model="notifications.push" label="Push notifications" />
                      <UCheckbox v-model="notifications.sms" label="SMS notifications" />
                    </div>
                  </UCard>

                  <UCard>
                    <template #header>
                      <h4 class="font-semibold text-gray-900">Privacy</h4>
                    </template>
                    <div class="space-y-4">
                      <UCheckbox v-model="privacy.publicProfile" label="Public profile" />
                      <UCheckbox v-model="privacy.dataSharing" label="Allow data sharing" />
                      <UCheckbox v-model="privacy.analytics" label="Analytics tracking" />
                    </div>
                  </UCard>

                  <UCard class="md:col-span-2">
                    <template #header>
                      <h4 class="font-semibold text-gray-900">Auto-save & Backup</h4>
                    </template>
                    <div class="space-y-4">
                      <USelectMenu 
                        v-model="backupFrequency" 
                        :options="backupOptions"
                        placeholder="Select backup frequency"
                        option-attribute="label"
                        value-attribute="value"
                      />
                      <UInput 
                        v-model="backupEmail" 
                        label="Backup email" 
                        placeholder="backup@yourcompany.com"
                      />
                    </div>
                  </UCard>
                </div>
              </div>
            </template>
        </UTabs>
      </UCard>
    </div>
    
</template>

<script setup>
// Reactive data

definePageMeta({
    layout: 'default',
    middleware: ['auth']
})

const userFields = ref({
  name: '',
  phone: '',
  bio: ''
})

const productFields = ref([
  { id: 1, name: 'SKU', type: 'text' },
  { id: 2, name: 'Weight', type: 'number' },
  { id: 3, name: 'Dimensions', type: 'text' }
])

const tabs = ref([
    { label: "Custom Fields", slot: "custom_fields" },
    { label: "Activity Log", slot: "activity_log" },
    { label: "Color Theme", slot: "color_theme" }, 
    { label: "Miscellaneous", slot: "misc" }
])

// Activity Log data
const searchQuery = ref('')
const activityLogs = ref([
  { id: 1, user: 'John Doe', action: 'login', timestamp: '2024-01-15 10:30', ip: '192.168.1.1' },
  { id: 2, user: 'Jane Smith', action: 'update_profile', timestamp: '2024-01-15 09:45', ip: '192.168.1.2' },
  { id: 3, user: 'Bob Johnson', action: 'create_post', timestamp: '2024-01-15 08:20', ip: '192.168.1.3' }
])

const logColumns = [
  { key: 'user', label: 'User' },
  { key: 'action', label: 'Action' },
  { key: 'timestamp', label: 'Time' },
  { key: 'ip', label: 'IP Address' },
  { key: 'actions', label: 'Actions' }
]


// Color Theme data
const selectedTheme = ref('light')
const themes = ref([
  { id: 'light', name: 'Light', primary: '#3B82F6' },
  { id: 'dark', name: 'Dark', primary: '#1E293B' },
  { id: 'emerald', name: 'Emerald', primary: '#10B981' },
  { id: 'purple', name: 'Purple', primary: '#8B5CF6' },
  { id: 'orange', name: 'Orange', primary: '#F59E0B' },
  { id: 'rose', name: 'Rose', primary: '#EF4444' }
])

const selectTheme = (themeId) => {
  selectedTheme.value = themeId
}

// Miscellaneous data
const notifications = ref({
  email: true,
  push: false,
  sms: false
})

const privacy = ref({
  publicProfile: true,
  dataSharing: false,
  analytics: true
})

const backupFrequency = ref('daily')
const backupOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' }
]
const backupEmail = ref('')

</script>