<script setup lang="ts">
import { computed } from 'vue'
import type { ApiError } from '@/api/client'
import DateTabs from '@/components/movie/DateTabs.vue'
import MovieSessionCard from '@/components/movie/MovieSessionCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import type { SessionSummary, VenueSessions } from '@/types/api'
import { formatLongDate, type DayOption } from '@/utils/dates'

const props = defineProps<{
  days: (DayOption & { disabled: boolean })[]
  selected: string | null
  groups: VenueSessions[]
  total: number
  loading: boolean
  error: ApiError | null
  blockedMessage: string | null
  comingSoon: boolean
  releaseDate: string
}>()

const emit = defineEmits<{
  selectDate: [iso: string]
  select: [session: SessionSummary]
  retry: []
}>()

const subtitle = computed(() => {
  if (props.comingSoon) return 'Not in cinemas yet'
  if (props.total > 0) {
    return `${props.total} ${props.total === 1 ? 'session' : 'sessions'} over the next seven days`
  }
  return 'No sessions in the next seven days'
})

function hallsOf(sessions: SessionSummary[]) {
  const halls = new Map<number, { id: number; name: string; sessions: SessionSummary[] }>()
  for (const session of sessions) {
    const hall = halls.get(session.hall.id) ?? { id: session.hall.id, name: session.hall.name, sessions: [] }
    hall.sessions.push(session)
    halls.set(hall.id, hall)
  }
  return [...halls.values()].sort((a, b) => a.name.localeCompare(b.name))
}
</script>

<template>
  <section class="flex min-w-0 flex-col gap-[27px]">
    <header class="flex flex-col gap-3.5">
      <div class="flex flex-col gap-1.5">
        <h2 class="text-xl font-extrabold leading-[normal]">Sessions</h2>
        <p class="text-xs leading-[1.3] text-muted">{{ subtitle }}</p>
      </div>
      <DateTabs :days="days" :selected="selected" @select="emit('selectDate', $event)" />
    </header>

    <p
      v-if="blockedMessage"
      role="alert"
      class="rounded-xl bg-tint-red px-4 py-3 text-xs font-semibold leading-[1.3] text-accent"
    >
      {{ blockedMessage }}
    </p>

    <EmptyState
      v-if="comingSoon"
      title="Coming soon"
      :description="`Sessions will open closer to the release on ${formatLongDate(releaseDate)}.`"
    />

    <ErrorState v-else-if="error" :message="error.message" :loading="loading" @retry="emit('retry')" />

    <div v-else-if="loading" class="flex flex-col gap-[27px]" aria-hidden="true">
      <div v-for="n in 2" :key="n" class="flex flex-col gap-3">
        <Skeleton class="h-4 w-32 rounded-md" />
        <Skeleton class="h-[133px] w-[454px] max-w-full rounded-2xl" />
      </div>
    </div>

    <EmptyState
      v-else-if="total === 0"
      title="No sessions scheduled"
      description="There are no showtimes for this film in the next seven days."
    />

    <EmptyState
      v-else-if="!groups.length"
      title="No sessions on this date"
      description="Pick another day to see its showtimes."
    />

    <div v-else class="flex flex-col gap-[27px]">
      <div v-for="group in groups" :key="group.venue.id" class="flex flex-col gap-3">
        <h3 class="text-sm font-extrabold leading-[normal]">{{ group.venue.name }}</h3>
        <div class="flex flex-wrap gap-2.5">
          <div
            v-for="hall in hallsOf(group.sessions)"
            :key="hall.id"
            class="flex w-[454px] max-w-full flex-col gap-[9px] rounded-2xl bg-surface p-[15px]"
          >
            <p class="text-xs font-semibold leading-[normal]">Hall {{ hall.name }}</p>
            <div class="flex flex-wrap gap-[9px]">
              <MovieSessionCard
                v-for="session in hall.sessions"
                :key="session.id"
                :session="session"
                :blocked="!!blockedMessage"
                @select="emit('select', $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>