<script setup lang="ts">
import {watch} from 'vue'
import CheckboxRow from '@/components/ui/CheckboxRow.vue'
import Button from '@/components/ui/Button.vue'
import DayPicker from '@/components/sessions/DayPicker.vue'
import FilterGroup from '@/components/sessions/FilterGroup.vue'
import type { FilterGroup as GroupKey, SessionFilters } from '@/composables/useSessionFilters'
import type { Format, FilterOptions } from '@/types/api'
import type { DayOption } from '@/utils/dates'
import { splitLabel } from '@/utils/text'

const props = defineProps<{
  options: FilterOptions
  filters: SessionFilters
  availableFormats: Format[]
  days: DayOption[]
  selectedDate: string
  activeCount: number
}>()

const emit = defineEmits<{
  toggle: [group: GroupKey, slug: string]
  selectDate: [iso: string]
  clear: []
}>()

</script>

<template>
  <aside class="flex w-full flex-col gap-6 rounded-2xl bg-surface p-6" aria-label="Filters">
    <h2 class="text-lg font-extrabold leading-[normal]">Filters</h2>

    <FilterGroup title="Venue">
      <CheckboxRow
        v-for="venue in options.venues"
        :key="venue.slug"
        :label="venue.name"
        :hint="venue.city"
        :model-value="filters.venues.includes(venue.slug)"
        @update:model-value="emit('toggle', 'venues', venue.slug)"
      />
    </FilterGroup>

    <div class="h-px bg-surface-2" />

    <FilterGroup title="Date">
      <DayPicker :days="days" :selected="selectedDate" @select="emit('selectDate', $event)" />
    </FilterGroup>

    <div class="h-px bg-surface-2" />

    <FilterGroup title="Format">
      <CheckboxRow
        v-for="format in availableFormats"
        :key="format.slug"
        :label="format.name"
        :model-value="filters.formats.includes(format.slug)"
        @update:model-value="emit('toggle', 'formats', format.slug)"
      />
    </FilterGroup>

    <div class="h-px bg-surface-2" />

    <FilterGroup title="Language">
      <CheckboxRow
        v-for="language in options.languages"
        :key="language.slug"
        :label="language.name"
        :model-value="filters.languages.includes(language.slug)"
        @update:model-value="emit('toggle', 'languages', language.slug)"
      />
    </FilterGroup>

    <div class="h-px bg-surface-2" />

    <FilterGroup title="Time of day">
      <CheckboxRow
        v-for="band in options.timeBands"
        :key="band.id"
        :label="splitLabel(band.label).name"
        :hint="splitLabel(band.label).hint"
        :model-value="filters.bands.includes(band.id)"
        @update:model-value="emit('toggle', 'bands', band.id)"
      />
    </FilterGroup>

    <div class="h-px bg-surface-2" />

    <div class="flex flex-col items-center gap-3">
      <Button v-if="activeCount" variant="outline" class="w-full py-[9px]!" @click="emit('clear')">
        Clear filters
      </Button>
      <p class="text-xs leading-[1.3] text-muted">
        {{ activeCount }} {{ activeCount === 1 ? 'filter' : 'filters' }} active
      </p>
    </div>
  </aside>
</template>