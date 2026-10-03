<script setup lang="ts">
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import type { Movie } from '@/types/api'
import { formatPrice, genreAndRuntime, movieKey } from '@/utils/movie'

defineProps<{ movie: Movie & { synopsis?: string | null } }>()
</script>

<template>
  <article
    class="group flex h-[452px] w-[260px] shrink-0 flex-col rounded-[20px] border border-transparent bg-surface p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[width] duration-300 hover:w-[447px] hover:border-surface-2 focus-within:w-[447px] focus-within:border-surface-2 motion-reduce:transition-none"
  >
    <div class="flex min-h-0 flex-1 flex-col gap-3">
      <RouterLink
        :to="{ name: 'movie', params: { movie: movieKey(movie) } }"
        class="flex min-h-0 flex-1 flex-col gap-3 outline-none"
      >
        <div class="min-h-0 flex-1 overflow-hidden rounded-[14px] bg-surface-2">
          <img
            v-if="movie.posterUrl"
            :src="movie.posterUrl"
            alt=""
            loading="lazy"
            class="size-full object-cover"
          />
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-2">
            <h3 class="line-clamp-2 text-xl font-extrabold leading-[normal]">{{ movie.title }}</h3>
            <p class="text-sm leading-[1.3] text-muted">{{ genreAndRuntime(movie) }}</p>
          </div>
          <Badge variant="red" compact class="self-start">{{ movie.ageRating.code }}</Badge>
          <div v-if="movie.synopsis" class="hidden group-hover:block group-focus-within:block">
            <p class="line-clamp-3 pr-5 text-sm leading-[1.3] text-muted">{{ movie.synopsis }}</p>
          </div>
        </div>
      </RouterLink>

      <div class="flex items-center justify-between">
        <span class="text-sm font-extrabold leading-[normal]">From {{ formatPrice(movie.fromPrice) }}</span>
        <Button compact :to="{ name: 'movie', params: { movie: movieKey(movie) } }">Buy Ticket</Button>
      </div>
    </div>
  </article>
</template>