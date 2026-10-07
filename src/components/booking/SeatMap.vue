<script setup lang="ts">
import type { Seat, SeatMap, SeatSection } from '@/types/api'
import { isSelectable } from '@/utils/seats'

defineProps<{ map: SeatMap; selectedIds: Set<number> }>()
const emit = defineEmits<{ toggle: [seat: Seat] }>()

function sectionTitle(section: SeatSection) {
  const first = section.rows[0]?.label
  const last = section.rows[section.rows.length - 1]?.label
  return first && last && first !== last ? `${section.name} · Rows ${first}-${last}` : section.name
}

function seatClass(seat: Seat, selected: boolean) {
  if (selected) return 'bg-accent text-white'
  if (seat.state === 'sold') return 'cursor-not-allowed bg-surface/50 text-disabled'
  if (seat.state === 'held' && !seat.isMine) return 'stripes cursor-not-allowed text-muted'
  return 'border border-surface-2 bg-surface text-white hover:border-muted'
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div
      class="rounded-b-lg bg-surface-2 py-2 text-center text-[10px] font-semibold uppercase leading-none tracking-[0.1em] text-muted"
    >
      Screen
    </div>

    <div class="no-scrollbar flex flex-col gap-6 overflow-x-auto">
      <section v-for="section in map.sections" :key="section.name" class="flex flex-col gap-3">
        <h3 class="text-xs font-semibold uppercase leading-[normal] tracking-[0.06em] text-muted">
          {{ sectionTitle(section) }}
        </h3>
        <div class="flex flex-col gap-2">
          <div
            v-for="row in section.rows"
            :key="row.label"
            class="grid grid-cols-[1.5rem_1fr] items-center gap-3"
          >
            <span class="text-xs font-semibold leading-[normal] text-muted">{{ row.label }}</span>
            <div class="flex items-center justify-center gap-1.5">
              <template v-for="seat in row.seats" :key="seat.id">
                <span v-if="seat.state === 'unavailable'" class="size-9 shrink-0" />
                <button
                  v-else
                  type="button"
                  :disabled="!isSelectable(seat)"
                  :aria-pressed="selectedIds.has(seat.id)"
                  :aria-label="`Seat ${seat.code}, ${seat.state}`"
                  class="grid size-9 shrink-0 place-items-center rounded-lg text-xs font-bold transition-colors"
                  :class="seatClass(seat, selectedIds.has(seat.id))"
                  @click="emit('toggle', seat)"
                >
                  {{ seat.label }}
                </button>
                <span v-if="seat.aisleAfter" class="w-5 shrink-0" />
              </template>
            </div>
          </div>
        </div>
      </section>
    </div>

    <ul class="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted">
      <li class="flex items-center gap-2">
        <span class="size-3.5 rounded border border-surface-2 bg-surface" />
        Available
      </li>
      <li class="flex items-center gap-2">
        <span class="size-3.5 rounded bg-accent" />
        Selected
      </li>
      <li class="flex items-center gap-2">
        <span class="size-3.5 rounded bg-surface/50" />
        Sold
      </li>
      <li class="flex items-center gap-2">
        <span class="stripes size-3.5 rounded" />
        Held by another user
      </li>
    </ul>
  </div>
</template>