<script setup lang="ts">
import { Timer } from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'
import type { MovieDetail } from '@/types/api'

defineProps<{ movie: MovieDetail }>()
</script>

<template>
  <section class="relative h-[567px] overflow-hidden bg-bg">
    <img
      v-if="movie.backdropUrl"
      :src="movie.backdropUrl"
      alt=""
      class="absolute inset-0 size-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-l from-black/[0.08] to-black/80" />

    <div class="absolute inset-x-0 bottom-[41px] flex items-end gap-[34px] px-6 lg:px-[60px]">
      <img
        v-if="movie.posterUrl"
        :src="movie.posterUrl"
        :alt="`${movie.title} poster`"
        class="hidden h-[374px] w-[289px] shrink-0 rounded-2xl object-cover md:block"
      />
      <div v-else class="hidden h-[374px] w-[289px] shrink-0 rounded-2xl bg-surface-2 md:block" />

      <div class="flex w-[580px] max-w-full flex-col">
        <Badge variant="red" class="self-start uppercase">
          {{ movie.isComingSoon ? 'Coming soon' : 'Now playing' }}
        </Badge>
        <h1 class="mt-[15px] text-display font-extrabold uppercase leading-[normal]">
          {{ movie.title }}
        </h1>
        <p class="mt-[15px] max-w-[560px] text-sm leading-[1.3]">{{ movie.synopsis }}</p>
        <div class="mt-5 flex flex-wrap gap-[7px]">
          <Badge variant="red">{{ movie.ageRating.code }}</Badge>
          <Badge>
            <Timer class="size-3.5" />
            {{ movie.runtimeMinutes }} Min
          </Badge>
          <Badge v-for="format in movie.formats" :key="format.id">{{ format.name }}</Badge>
        </div>
      </div>
    </div>
  </section>
</template>