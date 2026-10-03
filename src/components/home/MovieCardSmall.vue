<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'
import type { RecentMovie } from '@/stores/recentlyViewed'
import { genreAndRuntime, movieKey } from '@/utils/movie'

defineProps<{ movie: RecentMovie }>()
</script>

<template>
  <RouterLink
    :to="{ name: 'movie', params: { movie: movieKey(movie) } }"
    class="flex w-[329px] shrink-0 items-center gap-3 rounded-2xl bg-surface p-2.5"
  >
    <div class="h-[67px] min-w-0 flex-1 overflow-hidden rounded-lg bg-surface-2">
      <img
        v-if="movie.backdropUrl ?? movie.posterUrl"
        :src="movie.backdropUrl ?? movie.posterUrl ?? undefined"
        alt=""
        loading="lazy"
        class="size-full object-cover"
      />
    </div>
    <div class="flex w-[210px] shrink-0 flex-col gap-1">
      <div class="flex flex-col gap-1">
        <p class="truncate text-sm font-extrabold uppercase leading-[normal]">{{ movie.title }}</p>
        <p class="text-xs leading-[1.3] text-muted">{{ genreAndRuntime(movie) }}</p>
      </div>
      <Badge variant="red" compact class="self-start">{{ movie.ageRating.code }}</Badge>
    </div>
  </RouterLink>
</template>