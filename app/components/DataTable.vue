<script setup lang="ts">
import { h, resolveComponent, ref, computed, watch, slots } from 'vue'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const slots = useSlots()

interface Props {
  data: any[]
  columns: { accessorKey: string; header: string; sortable?: boolean }[]
  loading?: boolean
  total?: number
  page: number
  pageSize: number
  sort: { column: string | null; direction: 'asc' | 'desc' | null }
  showDefaultActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDefaultActions: true,
  loading: false,
  total: 0
})

const emit = defineEmits(['update:page', 'update:sort', 'search', 'view', 'edit', 'delete'])

const shouldShowActionMenu = computed(() => {
  // Always show on mobile to house View/Edit/Delete
  // On desktop, only show if the user provided the slot
  return !!slots['row-action-menu']
})

// 1. Toolbar State
const search = ref('')
watch(search, (val) => {
  emit('search', val)
})

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
})

const getDropdownItems = (row: any) => {
  const items = []

  // 1. Default Mobile Actions (Hidden on desktop menu)
  items.push(
    { label: 'View', icon: 'i-lucide-eye', class: 'md:hidden', onClick: () => emit('view', row) },
    { label: 'Edit', icon: 'i-lucide-pencil', class: 'md:hidden', onClick: () => emit('edit', row) },
    { label: 'Delete', icon: 'i-lucide-trash', class: 'md:hidden text-red-600', onClick: () => emit('delete', row) }
  )

  // 2. Conditional Divider & Custom Slot
  if (slots['row-action-menu']) {
    // This item acts as the separator and vanishes on desktop
    items.push({ isDivider: true, class: 'block md:hidden' }) 
    items.push({ isCustom: true })
  }

  // Return as a single array (one group) to disable automatic separators
  return [items]
}

// 2. Column Management (Injecting the Action Column)
const computedColumns = computed(() => {
  const cols = props.columns.map((col) => ({
    ...col,
    header: () => getHeader(col.accessorKey, col.header),    
    class: col.sortable ? 'group cursor-pointer' : ''
  }))

  // Add Action Column at the end
  cols.push({
    accessorKey: 'actions',
    header: 'Actions',
    sortable: false,
    class: 'text-right'
  })

  return cols
})

function getHeader(column: string, label: string) {
  const columnDef = props.columns.find(c => c.accessorKey === column)
  if (!columnDef?.sortable) return label

  const isActive = props.sort.column === column
  
  // 1. Determine the icon based on the 3-state logic
  let icon = 'i-lucide-arrow-up-down' 
  if (isActive && props.sort.direction === 'asc') icon = 'i-lucide-arrow-up-narrow-wide'
  if (isActive && props.sort.direction === 'desc') icon = 'i-lucide-arrow-down-wide-narrow'

  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label: label,
    trailingIcon: icon, // Keeps icon to the right of the text
    class: [
      // Removed w-full and justify-between to keep the icon beside the text
      '-mx-2 font-semibold transition-all gap-1.5', 
      !isActive 
        ? '[&>span:last-child]:opacity-0 group-hover:[&>span:last-child]:opacity-100' 
        : ''
    ],
    onClick: () => {
      let nextDirection: 'asc' | 'desc' | null = 'asc'
      let nextColumn: string | null = column

      if (isActive) {
        if (props.sort.direction === 'asc') {
          nextDirection = 'desc'
        } else if (props.sort.direction === 'desc') {
          nextDirection = null
          nextColumn = null // Return to unsorted state
        }
      }

      emit('update:sort', { column: nextColumn, direction: nextDirection })
    }
  })
}

</script>

<template>
  <div class="space-y-4">
    <!-- 1. Custom Toolbar Above Table -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-lg">
      <div class="flex flex-1 items-center gap-3">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search..."
          class="max-w-xs w-full"
        />
        <!-- Custom Filters Slot -->
        <div class="flex items-center gap-2">
          <slot name="filters" />
        </div>
      </div>

      <!-- Custom Actions/Buttons Slot -->
      <div class="flex items-center gap-2">
        <slot name="toolbar-actions" />
      </div>
    </div>

    <!-- Table -->
    <UTable
      :data="data"
      :columns="computedColumns"
      :loading="loading"
      class="w-full"
      :ui="{ th: { base: 'group' } }"
    >
      <!-- Forward all dynamic cell slots -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot v-if="name !== 'actions-cell' && name !== 'row-action-menu'" :name="name" v-bind="slotData" />
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center justify-start gap-2">
          
          <!-- Desktop Inline Buttons -->
          <div class="hidden md:flex items-center gap-1">
            <UButton variant="ghost" color="neutral" icon="i-lucide-eye" size="sm" @click="emit('view', row)" />
            <UButton variant="ghost" color="neutral" icon="i-lucide-pencil" size="sm" @click="emit('edit', row)" />
            <UButton variant="ghost" color="error" icon="i-lucide-trash" size="sm" @click="emit('delete', row)" />
          </div>

          <UDropdownMenu 
            :items="getDropdownItems(row)" 
            :popper="{ placement: 'bottom-end' }"
            :class="[!$slots['row-action-menu'] ? 'md:hidden' : '']"
          >
            <UButton color="neutral" variant="ghost" icon="i-lucide-more-vertical" />
            
            <template #item="{ item }">
              <!-- RENDER: Manual Divider (Mobile Only)[cite: 1] -->
              <div 
                v-if="item.isDivider" 
                :class="['h-[2px] bg-gray-200 dark:bg-gray-700 my-1 -mx-1', item.class]" 
              />

              <!-- RENDER: Default Actions (Mobile Only)[cite: 1] -->
              <div 
                v-else-if="item.onClick" 
                :class="['flex items-center gap-2 w-full px-2 py-1.5', item.class]"
                @click="item.onClick"
              >
                <UIcon :name="item.icon" class="h-4 w-4" />
                <span>{{ item.label }}</span>
              </div>

              <div v-else-if="item.isCustom" class="w-full">
                <slot name="row-action-menu" :row="row" />
              </div>
            </template>
          </UDropdownMenu>
        </div>
      </template>
    </UTable>

    <!-- Footer: Pagination -->
    <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <div class="text-sm text-gray-500">
        Showing {{ data.length }} of {{ total }} results
      </div>
      <UPagination
        v-model:page="currentPage"
        :total="total"
        :items-per-page="pageSize"
      />
    </div>
  </div>
</template>

