<script setup lang="ts">
import MovieCardSmall from '@/components/home/MovieCardSmall.vue'
import SectionHeading from '@/components/home/SectionHeading.vue'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'

const recent = useRecentlyViewedStore()
</script>

<template>
  <template v-if="recent.items.length">
    <section class="flex flex-col gap-5 px-6 lg:px-[70px]">
      <SectionHeading title="Recently viewed" />
      <div class="scroll-row flex gap-5 overflow-x-auto pb-2">
        <MovieCardSmall v-for="movie in recent.items" :key="movie.id" :movie="movie" />
      </div>
    </section>
    <div class="my-10 h-px bg-tint-white" />
  </template>
</template>