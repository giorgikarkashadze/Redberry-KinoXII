import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ApiError } from '@/api/client'
import { fetchFilterOptions } from '@/api/sessions'
import type { FilterOptions } from '@/types/api'

export const useFilterOptionsStore = defineStore('filterOptions', () => {
  const options = ref<FilterOptions | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  let pending: Promise<void> | null = null

  function load() {
    if (options.value) return Promise.resolve()
    if (pending) return pending
    loading.value = true
    error.value = null
    pending = fetchFilterOptions()
      .then((data) => {
        options.value = data
      })
      .catch((failure) => {
        error.value =
          failure instanceof ApiError
            ? failure
            : new ApiError(0, 'Something went wrong. Please try again.')
      })
      .finally(() => {
        loading.value = false
        pending = null
      })
    return pending
  }

  return { options, loading, error, load }
})