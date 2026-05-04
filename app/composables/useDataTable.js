// composables/useAdminTable.js
export const useDataTable = (endpoint, options = {}) => {
  const rows = ref([])
  const meta = ref({})
  const loading = ref(false)

  const page = ref(1)
  const perPage = ref(options.perPage || 10)
  const search = ref('')
  const sort = ref({ column: null, direction: null })

  const filters = ref({})
  const filterSchema = ref([])

  const selected = ref([])

  const fetchData = async () => {
    loading.value = true

    try {
      const res = await $fetch(endpoint, {
        query: {
          page: page.value,
          per_page: perPage.value,
          search: search.value,
          sort_by: sort.value.column,
          sort_dir: sort.value.direction,
          ...filters.value
        }
      })

      rows.value = res.data
      meta.value = res.meta || {}
      filterSchema.value = res.filters || []
    } finally {
      loading.value = false
    }
  }

  watch([page, perPage, search, sort, filters], fetchData, {
    deep: true
  })

  fetchData()

  return {
    rows,
    meta,
    loading,
    page,
    perPage,
    search,
    sort,
    filters,
    filterSchema,
    selected,
    fetchData
  }
}