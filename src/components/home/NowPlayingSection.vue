<script setup lang="ts">
import { fetchNowPlaying } from '@/api/movies'
import MovieCardBig from '@/components/home/MovieCardBig.vue'
import SectionHeading from '@/components/home/SectionHeading.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useRequest } from '@/composables/useRequest'
import { ref } from 'vue'
import { useDragScroll } from '@/composables/useDragScroll'

const row = ref<HTMLElement | null>(null)
const { dragging } = useDragScroll(row)

const { data, error, loading, run } = useRequest((signal) => fetchNowPlaying(signal))
</script>

<template>
  <section class="flex flex-col gap-6">
    <div class="px-6 lg:px-[70px]">
      <SectionHeading title="NOW PLAYING" :to="{ name: 'sessions' }" />
    </div>

    <div v-if="data?.length" class="relative">
      <div ref="row"
           class="no-scrollbar flex gap-[17px] overflow-x-auto px-6 pb-1 lg:px-[70px]"
           :class="dragging ? 'cursor-grabbing select-none' : 'cursor-grab'">
        <MovieCardBig v-for="movie in data" :key="movie.id" :movie="movie" />
      </div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-bg to-transparent"
      />
    </div>

    <div v-else-if="loading" class="flex gap-[17px] overflow-hidden px-6 lg:px-[70px]">
      <Skeleton v-for="n in 6" :key="n" class="h-[452px] w-[260px] shrink-0 rounded-[20px]" />
    </div>

    <div v-else-if="error" class="px-6 lg:px-[70px]">
      <ErrorState :message="error.message" :loading="loading" @retry="run" />
    </div>

    <div v-else class="px-6 lg:px-[70px]">
      <EmptyState
        title="No films are playing right now"
        description="Check back soon, new titles are added regularly."
      />
    </div>
  </section>
</template>