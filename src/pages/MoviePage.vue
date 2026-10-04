<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMovie, fetchMovieSessions } from '@/api/movies'
import MovieDetails from '@/components/movie/MovieDetails.vue'
import MovieHero from '@/components/movie/MovieHero.vue'
import MovieSessions from '@/components/movie/MovieSessions.vue'
import Button from '@/components/ui/Button.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useRequest } from '@/composables/useRequest'
import { useAuthStore } from '@/stores/auth'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import { buildDays } from '@/utils/dates'
import { toBookingTarget, useBookingStore } from '@/stores/booking'
import type { SessionSummary } from '@/types/api'

const route = useRoute()
const auth = useAuthStore()
const recentlyViewed = useRecentlyViewedStore()
const booking = useBookingStore()

const key = computed(() => String(route.params.movie))
const selectedDate = ref<string | null>(null)

const {
  data: movie,
  error: movieError,
  loading: movieLoading,
  run: loadMovie,
} = useRequest((signal) => fetchMovie(key.value, signal), { immediate: false })

const days = computed(() => {
  const available = new Set(movie.value?.availableDates ?? [])
  return buildDays().map((day) => ({ ...day, disabled: !available.has(day.iso) }))
})

const datesToLoad = computed(() => days.value.filter((day) => !day.disabled).map((day) => day.iso))

const {
  data: sessionsByDate,
  error: sessionsError,
  loading: sessionsLoading,
  run: loadSessions,
} = useRequest((signal) => fetchMovieSessions(key.value, datesToLoad.value, signal), {
  immediate: false,
})

const groups = computed(() =>
  selectedDate.value ? (sessionsByDate.value?.[selectedDate.value] ?? []) : [],
)

const total = computed(() =>
  Object.values(sessionsByDate.value ?? {}).reduce(
    (sum, venues) => sum + venues.reduce((count, venue) => count + venue.sessions.length, 0),
    0,
  ),
)

const blockedMessage = computed(() => {
  const age = auth.user?.age
  const rating = movie.value?.ageRating
  if (age == null || !rating || age >= rating.minAge) return null
  return `This film is rated ${rating.code}. You cannot buy tickets for it with this account.`
})

function onSelect(session: SessionSummary) {
  if (movie.value) booking.start(toBookingTarget(session, movie.value))
}

watch(
  key,
  () => {
    selectedDate.value = null
    movie.value = null
    sessionsByDate.value = null
    loadMovie()
  },
  { immediate: true },
)

watch(movie, (value) => {
  if (!value) return
  recentlyViewed.add(value)
  selectedDate.value = datesToLoad.value[0] ?? null
  if (datesToLoad.value.length) loadSessions()
})

watch(
  () => booking.completedCount,
  () => {
    if (datesToLoad.value.length) loadSessions()
  },
)

</script>

<template>
  <template v-if="movie">
    <MovieHero :movie="movie" />
    <div class="grid gap-10 px-6 pb-16 pt-[34px] lg:grid-cols-[minmax(0,1fr)_441px] lg:px-[51px]">
      <MovieSessions
        :days="days"
        :selected="selectedDate"
        :groups="groups"
        :total="total"
        :loading="sessionsLoading"
        :error="sessionsError"
        :blocked-message="blockedMessage"
        :coming-soon="movie.isComingSoon"
        :release-date="movie.releaseDate"
        @select-date="selectedDate = $event"
        @retry="loadSessions"
        @select="onSelect"
      />
      <MovieDetails :movie="movie" />
    </div>
  </template>

  <div v-else-if="movieLoading" aria-hidden="true">
    <Skeleton class="h-[567px] rounded-none" />
    <div class="grid gap-10 px-6 pb-16 pt-[34px] lg:grid-cols-[minmax(0,1fr)_441px] lg:px-[51px]">
      <div class="flex flex-col gap-6">
        <Skeleton class="h-14 w-64 rounded-xl" />
        <Skeleton class="h-20 w-[580px] max-w-full rounded-2xl" />
        <Skeleton class="h-[133px] w-[454px] max-w-full rounded-2xl" />
      </div>
      <Skeleton class="h-[420px] rounded-2xl" />
    </div>
  </div>

  <div v-else-if="movieError" class="px-6 pb-16 pt-32 lg:px-[60px]">
    <EmptyState
      v-if="movieError.status === 404"
      title="Film not found"
      description="This film may have been removed, or the link is incorrect."
    >
      <Button :to="{ name: 'home' }">Back to home</Button>
    </EmptyState>
    <ErrorState v-else :message="movieError.message" :loading="movieLoading" @retry="loadMovie" />
  </div>
</template>