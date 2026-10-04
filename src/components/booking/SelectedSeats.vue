<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useBookingStore } from '@/stores/booking'
import { useFilterOptionsStore } from '@/stores/filterOptions'
import { formatMoney } from '@/utils/movie'

const booking = useBookingStore()
const filterOptions = useFilterOptionsStore()

const types = computed(() =>
  [...(filterOptions.options?.ticketTypes ?? [])]
    .filter(
      (type) =>
        type.blockedFromRatingAge === null || (booking.target?.minAge ?? 0) < type.blockedFromRatingAge,
    )
    .sort((a, b) => a.priceRatio - b.priceRatio),
)
</script>

<template>
  <ul class="flex flex-col gap-3">
    <li
      v-for="seat in booking.selection"
      :key="seat.seatId"
      class="flex flex-col gap-3 rounded-xl bg-surface p-3"
    >
      <div class="flex items-center justify-between text-sm leading-[normal]">
        <span>
          <span class="text-muted">Seat</span>
          <span class="ml-2 font-extrabold">{{ seat.code }}</span>
        </span>
        <span class="flex items-center gap-3">
          <span class="font-extrabold">{{ formatMoney(booking.priceOf(seat.ticketType)) }}</span>
          <button
            type="button"
            :aria-label="`Remove seat ${seat.code}`"
            class="text-muted transition-colors hover:text-white"
            @click="booking.removeSeat(seat.seatId)"
          >
            <X class="size-4" />
          </button>
        </span>
      </div>
      <div class="flex gap-2">
        <button
          v-for="type in types"
          :key="type.slug"
          type="button"
          :aria-pressed="seat.ticketType === type.slug"
          class="flex-1 rounded-full px-2 py-2 text-xs font-bold leading-[normal] transition-colors"
          :class="seat.ticketType === type.slug ? 'bg-accent' : 'bg-surface-2 hover:bg-disabled'"
          @click="booking.setTicketType(seat.seatId, type.slug)"
        >
          {{ type.name }} {{ Math.round(type.priceRatio * 100) }}%
        </button>
      </div>
    </li>
  </ul>
</template>