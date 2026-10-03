<script setup lang="ts">
import { fetchComingSoon } from '@/api/movies'
import MovieCardMedium from '@/components/home/MovieCardMedium.vue'
import SectionHeading from '@/components/home/SectionHeading.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useRequest } from '@/composables/useRequest'
import { ref } from 'vue'
import { useDragScroll } from '@/composables/useDragScroll'

const row = ref<HTMLElement | null>(null)
const { dragging } = useDragScroll(row)

const { data, error, loading, run } = useRequest((signal) => fetchComingSoon(signal))
</script>

<template>
  <section class="flex flex-col gap-6">
    <div class="px-6 lg:px-[70px]">
      <SectionHeading title="COMING SOON..." />
    </div>

    <div v-if="data?.length" class="relative">
      <div ref="row"
           class="no-scrollbar flex gap-5 overflow-x-auto px-6 pb-1 lg:px-[70px]"
           :class="dragging ? 'cursor-grabbing select-none' : 'cursor-grab'">
        <MovieCardMedium v-for="movie in data" :key="movie.id" :movie="movie" />
      </div>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-bg to-transparent"
      />
    </div>

    <div v-else-if="loading" class="flex gap-5 overflow-hidden px-6 lg:px-[70px]">
      <Skeleton v-for="n in 3" :key="n" class="h-[160px] w-[470px] shrink-0 rounded-[20px]" />
    </div>

    <div v-else-if="error" class="px-6 lg:px-[70px]">
      <ErrorState :message="error.message" :loading="loading" @retry="run" />
    </div>

    <div v-else class="px-6 lg:px-[70px]">
      <EmptyState title="Nothing announced yet" description="New releases will appear here." />
    </div>
  </section>
</template>