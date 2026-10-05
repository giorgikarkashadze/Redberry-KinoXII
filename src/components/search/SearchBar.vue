<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, X } from 'lucide-vue-next'
import SearchPanel from '@/components/search/SearchPanel.vue'
import { useDismissable } from '@/composables/useDismissable'
import { useMovieSearch } from '@/composables/useMovieSearch'
import { movieKey } from '@/utils/movie'

const route = useRoute()
const router = useRouter()

const root = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const open = ref(false)
const activeIndex = ref(-1)
const listId = useId()

const { query, term, results, status, error, retry, clear } = useMovieSearch()
useDismissable(root, open)

const activeId = computed(() =>
  activeIndex.value >= 0 && results.value.length ? `${listId}-option-${activeIndex.value}` : undefined,
)

watch(results, () => {
  activeIndex.value = -1
})

watch(
  () => route.path,
  () => {
    open.value = false
    clear()
  },
)

function browseAll() {
  open.value = false
  input.value?.blur()
  router.push({ name: 'sessions' })
}

function clearQuery() {
  clear()
  input.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  const total = results.value.length
  if (event.key === 'ArrowDown' && total) {
    event.preventDefault()
    open.value = true
    activeIndex.value = (activeIndex.value + 1) % total
    return
  }
  if (event.key === 'ArrowUp' && total) {
    event.preventDefault()
    activeIndex.value = activeIndex.value <= 0 ? total - 1 : activeIndex.value - 1
    return
  }
  if (event.key === 'Enter') {
    const target = results.value[activeIndex.value >= 0 ? activeIndex.value : 0]
    if (!target || (status.value !== 'done' && activeIndex.value < 0)) return
    event.preventDefault()
    router.push({ name: 'movie', params: { movie: movieKey(target) } })
  }
}

function onFocusOut(event: FocusEvent) {
  const next = event.relatedTarget as Node | null
  if (next && !root.value?.contains(next)) open.value = false
}
</script>

<template>
  <div ref="root" class="relative w-[380px] max-w-full" @focusout="onFocusOut">
    <div
      class="flex h-[41px] items-center gap-1 rounded-full bg-tint-white px-3 py-1.5 transition-colors focus-within:bg-white/20"
    >
      <Search class="size-3.5 shrink-0" />
      <input
        ref="input"
        v-model="query"
        type="text"
        role="combobox"
        autocomplete="off"
        spellcheck="false"
        placeholder="Search films and live events"
        aria-label="Search films and live events"
        aria-autocomplete="list"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-activedescendant="activeId"
        class="min-w-0 flex-1 bg-transparent text-sm leading-[1.3] text-white outline-none placeholder:text-white"
        @focus="open = true"
        @input="open = true"
        @keydown="onKeydown"
      />
      <button
        v-if="query"
        type="button"
        aria-label="Clear search"
        class="grid size-6 shrink-0 place-items-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
        @mousedown.prevent
        @click="clearQuery"
      >
        <X class="size-3.5" />
      </button>
    </div>

    <div v-if="open" class="absolute right-0 top-full z-40 mt-3 w-[480px] max-w-[calc(100vw-3rem)]">
      <SearchPanel
        :id="listId"
        :status="status"
        :term="term"
        :results="results"
        :error="error"
        :active-index="activeIndex"
        @browse="browseAll"
        @retry="retry"
        @hover="activeIndex = $event"
        @pick="open = false"
      />
    </div>
  </div>
</template>