<script setup lang="ts">
import { computed } from 'vue'
import type { Movie } from '@/types/api'
import { formatPrice, movieKey } from '@/utils/movie'
import { splitMatch } from '@/utils/text'

const props = defineProps<{ movie: Movie; term: string; active: boolean }>()

const parts = computed(() => splitMatch(props.movie.title, props.term))

const meta = computed(() => {
  const kind = props.movie.kind === 'event' ? 'Event' : 'Film'
  return `${kind} · ${props.movie.ageRating.code} · ${props.movie.runtimeMinutes} min`
})
</script>

<template>
  <RouterLink
    :to="{ name: 'movie', params: { movie: movieKey(movie) } }"
    class="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-surface"
    :class="active && 'bg-surface'"
  >
    <img
      v-if="movie.posterUrl"
      :src="movie.posterUrl"
      alt=""
      loading="lazy"
      class="h-14 w-10 shrink-0 rounded-md object-cover"
    />
    <div v-else class="h-14 w-10 shrink-0 rounded-md bg-surface-2" />

    <div class="flex min-w-0 flex-1 flex-col gap-1.5">
      <p class="truncate text-base font-extrabold leading-[normal] text-muted">
        <span>{{ parts.before }}</span><span class="text-white">{{ parts.match }}</span><span>{{ parts.after }}</span>
      </p>
      <p class="text-xs leading-[1.3] text-muted">{{ meta }}</p>
    </div>

    <p v-if="movie.isComingSoon" class="shrink-0 text-sm font-extrabold leading-[normal] text-warning">
      Coming Soon
    </p>
    <p v-else class="shrink-0 text-sm font-extrabold leading-[normal]">
      <span class="font-semibold">from</span> {{ formatPrice(movie.fromPrice) }}
    </p>
  </RouterLink>
</template>