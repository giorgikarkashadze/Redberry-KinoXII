<script setup lang="ts">
import MovieCardSmall from '@/components/home/MovieCardSmall.vue'
import SectionHeading from '@/components/home/SectionHeading.vue'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import { ref } from 'vue'
import { useDragScroll } from '@/composables/useDragScroll'

const row = ref<HTMLElement | null>(null)
const { dragging } = useDragScroll(row)

const recent = useRecentlyViewedStore()
</script>

<template>
  <template v-if="recent.items.length">
    <section class="flex flex-col gap-5 px-6 lg:px-[70px]">
      <SectionHeading title="Recently viewed" />
      <div ref="row"
           class="no-scrollbar flex gap-5 overflow-x-auto pb-1"
           :class="dragging ? 'cursor-grabbing select-none' : 'cursor-grab'">
        <MovieCardSmall v-for="movie in recent.items" :key="movie.id" :movie="movie" />
      </div>
    </section>
    <div class="my-10 h-px bg-tint-white" />
  </template>
</template>