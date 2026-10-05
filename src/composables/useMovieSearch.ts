import { onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { ApiError } from '@/api/client'
import { searchMovies } from '@/api/movies'
import type { Movie } from '@/types/api'

const DEBOUNCE_MS = 300

export type SearchStatus = 'idle' | 'loading' | 'done' | 'error'

export function useMovieSearch() {
  const query = ref('')
  const term = ref('')
  const results = shallowRef<Movie[]>([])
  const status = ref<SearchStatus>('idle')
  const error = shallowRef<ApiError | null>(null)
  let timer: number | undefined
  let controller: AbortController | null = null

  async function run(value: string) {
    controller?.abort()
    const current = (controller = new AbortController())
    status.value = 'loading'
    error.value = null
    try {
      const found = await searchMovies(value, current.signal)
      if (current.signal.aborted) return
      results.value = found
      term.value = value
      status.value = 'done'
    } catch (failure) {
      if (current.signal.aborted) return
      error.value =
        failure instanceof ApiError
          ? failure
          : new ApiError(0, 'Something went wrong. Please try again.')
      status.value = 'error'
    }
  }

  function reset() {
    window.clearTimeout(timer)
    controller?.abort()
    results.value = []
    term.value = ''
    status.value = 'idle'
    error.value = null
  }

  watch(query, (value) => {
    window.clearTimeout(timer)
    const trimmed = value.trim()
    if (!trimmed) {
      reset()
      return
    }
    controller?.abort()
    status.value = 'loading'
    timer = window.setTimeout(() => run(trimmed), DEBOUNCE_MS)
  })

  function retry() {
    const trimmed = query.value.trim()
    if (trimmed) run(trimmed)
  }

  function clear() {
    query.value = ''
    reset()
  }

  onBeforeUnmount(() => {
    window.clearTimeout(timer)
    controller?.abort()
  })

  return { query, term, results, status, error, retry, clear }
}