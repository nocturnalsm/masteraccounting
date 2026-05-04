<script setup lang="ts">

import { h, resolveComponent, ref } from 'vue'

const UButton = resolveComponent('UButton')

interface Props {
  data: any[]
  columns: { accessorKey: string; header: string; sortable?: boolean }[]
  loading?: boolean
  total?: number
  page: number
  pageSize: number
  sort: { column: string; direction: 'asc' | 'desc' }
}

function getHeader(column: string, label: string) {

  const columnSorted = props.columns.find(c => c.accessorKey == column)
  const isSorted = columnSorted?.sortable

  if (!isSorted) return label

  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label: label,
    icon: isSorted
      ? props.sort.direction === 'asc' && props.sort.column === columnSorted?.accessorKey
        ? 'i-lucide-arrow-up-narrow-wide'
        : 'i-lucide-arrow-down-wide-narrow'
      : 'i-lucide-arrow-up-down',
    class: '-mx-2.5',
    onClick: () => emit('update:sort', {
      column: columnSorted?.accessorKey,
      direction:
        props.sort.column === columnSorted?.accessorKey && props.sort.direction === 'asc'
          ? 'desc'
          : 'asc'
    })
  })
}

const props = defineProps<Props>()
const emit = defineEmits(['update:page', 'update:sort', 'search'])

// Local state for search/filters
const search = ref('')

// Debounce search to avoid excessive API calls
watch(search, (val) => {
  emit('search', val)
})

const currentPage = computed({
  get: () => props.page,
  set: (val) => emit('update:page', val)
})

const computedColumns = computed(() =>
  props.columns.map((col) => ({
    ...col,
    header: (info: any) => getHeader(col.accessorKey, col.header)
  }))
)

</script>

<template>
  <div class="space-y-4">
    <!-- Header: Search & Filters -->
    <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Search..."
        class="max-w-xs"
      />
      <div class="flex gap-2">
        <slot name="filters" />
      </div>
    </div>

    <!-- Table -->
    <UTable
      :data="data"
      :columns="computedColumns"
      :loading="loading"
    >
      <!-- Custom slots for cell rendering -->
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UTable>

    <!-- Footer: Pagination -->
    <div class="flex justify-end px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <UPagination
        v-model:page="currentPage"
        :total="total || 0"
        :items-per-page="pageSize"
      />
    </div>
  </div>
</template>