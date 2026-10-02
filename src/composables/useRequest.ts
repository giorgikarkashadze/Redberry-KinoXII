import { onScopeDispose, ref, shallowRef } from 'vue'
import { ApiError } from '@/api/client'

export function useRequest<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  options: { immediate?: boolean } = {},
) {
  const data = shallowRef<T | null>(null)
  const error = shallowRef<ApiError | null>(null)
  const loading = ref(false)
  let controller: AbortController | null = null

  async function run() {
    controller?.abort()
    const current = (controller = new AbortController())
    loading.value = true
    error.value = null
    try {
      const result = await fetcher(current.signal)
      if (!current.signal.aborted) data.value = result
    } catch (failure) {
      if (current.signal.aborted) return
      error.value =
        failure instanceof ApiError
          ? failure
          : new ApiError(0, 'Something went wrong. Please try again.')
    } finally {
      if (controller === current) loading.value = false
    }
  }

  onScopeDispose(() => controller?.abort())

  if (options.immediate ?? true) run()

  return { data, error, loading, run }
}