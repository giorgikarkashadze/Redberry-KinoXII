<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { fetchSessions } from '@/api/sessions'
import SessionFilters from '@/components/sessions/SessionFilters.vue'
import SessionGroup from '@/components/sessions/SessionGroup.vue'
import SortSelect from '@/components/sessions/SortSelect.vue'
import Button from '@/components/ui/Button.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import Pagination from '@/components/ui/Pagination.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useRequest } from '@/composables/useRequest'
import { useSessionFilters } from '@/composables/useSessionFilters'
import { useFilterOptionsStore } from '@/stores/filterOptions'
import { buildDays } from '@/utils/dates'

const filterOptions = useFilterOptionsStore()
const { filters, availableFormats, activeCount, apiQuery, update, toggle, clear } = useSessionFilters()

const days = buildDays()
const selectedDate = computed(() => filters.value.date ?? days[0]?.iso ?? '')
const sortValue = computed(
  () => filters.value.sort ?? filterOptions.options?.sorts[0]?.id ?? 'time_asc',
)

const {
  data: result,
  error,
  loading,
  run,
} = useRequest((signal) => fetchSessions(apiQuery.value, signal))

onMounted(() => {
  filterOptions.load()
})

watch(
  () => JSON.stringify(apiQuery.value),
  () => run(),
)

watch(
  () => filters.value.page,
  () => window.scrollTo({ top: 0, behavior: 'smooth' }),
)
</script>

<template>
  <div class="px-6 pb-16 pt-[117px] lg:px-[51px]">
    <div class="grid gap-x-[51px] lg:grid-cols-[320px_1fr]">
      <div class="flex flex-col gap-9">
        <header class="flex flex-col gap-1.5">
          <h1 class="text-2xl font-extrabold leading-[normal]">Sessions</h1>
          <p class="text-sm leading-[1.3] text-muted">Browse showtimes across all venues</p>
        </header>

        <SessionFilters
          v-if="filterOptions.options"
          :options="filterOptions.options"
          :filters="filters"
          :available-formats="availableFormats"
          :days="days"
          :selected-date="selectedDate"
          :active-count="activeCount"
          @toggle="toggle"
          @select-date="update({ date: $event })"
          @clear="clear"
        />
        <ErrorState
          v-else-if="filterOptions.error"
          :message="filterOptions.error.message"
          :loading="filterOptions.loading"
          @retry="filterOptions.load()"
        />
        <Skeleton v-else class="h-[1000px] rounded-2xl" />
      </div>

      <main class="mt-9 flex min-w-0 flex-col gap-6 lg:mt-[83px]">
        <div class="flex items-center justify-between gap-4">
          <p class="text-sm leading-[normal]">
            <template v-if="result">
              Showing {{ result.meta.totalSessions }}
              {{ result.meta.totalSessions === 1 ? 'session' : 'sessions' }}
            </template>
          </p>
          <SortSelect
            v-if="filterOptions.options"
            :options="filterOptions.options.sorts"
            :model-value="sortValue"
            @update:model-value="update({ sort: $event })"
          />
        </div>

        <ErrorState v-if="error" :message="error.message" :loading="loading" @retry="run" />

        <div v-else-if="!result" class="flex flex-col gap-8" aria-hidden="true">
          <div v-for="n in 3" :key="n" class="flex flex-col gap-3.5">
            <div class="flex items-center gap-4">
              <Skeleton class="h-20 w-14 rounded-lg" />
              <Skeleton class="h-10 w-48 rounded-lg" />
            </div>
            <div class="flex gap-3 overflow-hidden">
              <Skeleton v-for="m in 4" :key="m" class="h-[104px] w-[252px] shrink-0 rounded-2xl" />
            </div>
          </div>
        </div>

        <EmptyState
          v-else-if="!result.groups.length"
          title="No sessions found"
          description="Try a different date or change your filters."
        >
          <Button v-if="activeCount" variant="outline" @click="clear">Clear filters</Button>
        </EmptyState>

        <div
          v-else
          class="flex flex-col gap-8 transition-opacity"
          :class="loading && 'opacity-60'"
          :aria-busy="loading"
        >
          <div
            v-for="group in result.groups"
            :key="group.movie.id"
            class="border-t border-tint-white pt-8 first:border-t-0 first:pt-0"
          >
            <SessionGroup :group="group" />
          </div>

          <Pagination
            class="self-center"
            :page="result.meta.currentPage"
            :last-page="result.meta.lastPage"
            @change="update({ page: $event })"
          />
        </div>
      </main>
    </div>
  </div>
</template>