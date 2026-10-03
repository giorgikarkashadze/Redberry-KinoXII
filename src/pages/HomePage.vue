<script setup lang="ts">
import { fetchFeatured } from '@/api/movies'
import ComingSoonSection from '@/components/home/ComingSoonSection.vue'
import HeroCarousel from '@/components/home/HeroCarousel.vue'
import NowPlayingSection from '@/components/home/NowPlayingSection.vue'
import RecentlyViewedSection from '@/components/home/RecentlyViewedSection.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import { useRequest } from '@/composables/useRequest'

const {
  data: featured,
  error: featuredError,
  loading: featuredLoading,
  run: loadFeatured,
} = useRequest((signal) => fetchFeatured(signal))
</script>

<template>
  <HeroCarousel v-if="featured?.length" :movies="featured" />

  <div v-else-if="featuredLoading" class="h-[760px] animate-pulse bg-surface" aria-hidden="true" />

  <div v-else-if="featuredError" class="px-6 pb-4 pt-32 lg:px-[67px]">
    <ErrorState :message="featuredError.message" :loading="featuredLoading" @retry="loadFeatured" />
  </div>

  <div v-else class="h-32" />

  <div class="flex flex-col pb-4 pt-8">
    <RecentlyViewedSection />
    <NowPlayingSection />
    <div class="my-10 h-px bg-tint-white" />
    <ComingSoonSection />
  </div>
</template>