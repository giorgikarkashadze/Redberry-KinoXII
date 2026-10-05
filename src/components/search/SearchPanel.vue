<script setup lang="ts">
import { Popcorn, Search } from 'lucide-vue-next'
import type { ApiError } from '@/api/client'
import SearchResultRow from '@/components/search/SearchResultRow.vue'
import Button from '@/components/ui/Button.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import type { SearchStatus } from '@/composables/useMovieSearch'
import type { Movie } from '@/types/api'

defineProps<{
  id: string
  status: SearchStatus
  term: string
  results: Movie[]
  error: ApiError | null
  activeIndex: number
}>()

const emit = defineEmits<{ browse: []; retry: []; hover: [index: number]; pick: [] }>()
</script>

<template>
  <div class="rounded-2xl bg-bg p-3 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] ring-1 ring-surface-2">
    <div v-if="status === 'idle'" class="flex flex-col items-center gap-4 px-6 py-8 text-center">
      <span class="grid size-[66px] place-items-center rounded-full bg-surface">
        <Popcorn class="size-6" />
      </span>
      <div class="flex flex-col gap-1.5">
        <p class="text-base font-extrabold leading-[normal]">What do you want to watch?</p>
        <p class="text-sm leading-[1.3] text-muted">Search by title, director or cast</p>
      </div>
      <Button variant="transparent" @click="emit('browse')">Browse all sessions</Button>
    </div>

    <ErrorState
      v-else-if="status === 'error'"
      :message="error?.message"
      @retry="emit('retry')"
    />

    <div v-else-if="results.length" :class="status === 'loading' && 'opacity-60'">
      <div class="flex items-center justify-between px-2 pb-2 pt-1">
        <p class="text-xs font-semibold uppercase leading-[normal] tracking-[0.06em] text-muted">
          Films &amp; events
        </p>
        <p class="text-xs leading-[normal] text-muted">
          {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }}
        </p>
      </div>
      <ul :id="id" role="listbox" aria-label="Search results" class="flex flex-col gap-1">
        <li
          v-for="(movie, index) in results"
          :key="movie.id"
          role="presentation"
          @mouseenter="emit('hover', index)"
        >
          <SearchResultRow
            :id="`${id}-option-${index}`"
            role="option"
            :aria-selected="index === activeIndex"
            :movie="movie"
            :term="term"
            :active="index === activeIndex"
            @click="emit('pick')"
          />
        </li>
      </ul>
    </div>

    <div v-else-if="status === 'loading'" class="flex flex-col gap-1" aria-hidden="true">
      <div v-for="n in 3" :key="n" class="flex items-center gap-4 p-2">
        <Skeleton class="h-14 w-10 rounded-md" />
        <div class="flex flex-1 flex-col gap-2">
          <Skeleton class="h-4 w-40 rounded" />
          <Skeleton class="h-3 w-28 rounded" />
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center gap-4 px-6 py-8 text-center">
      <span class="grid size-[66px] place-items-center rounded-full bg-surface">
        <Search class="size-6" />
      </span>
      <div class="flex flex-col gap-1.5">
        <p class="text-base font-extrabold leading-[normal]">No results for “{{ term }}”</p>
        <p class="text-sm leading-[1.3] text-muted">Check the spelling or try another film or live event.</p>
      </div>
      <Button variant="transparent" @click="emit('browse')">Browse all sessions</Button>
    </div>
  </div>
</template>