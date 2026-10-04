<script setup lang="ts">
import { computed } from 'vue'
import SeatMap from '@/components/booking/SeatMap.vue'
import SelectedSeats from '@/components/booking/SelectedSeats.vue'
import Button from '@/components/ui/Button.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useBookingStore } from '@/stores/booking'
import { formatMoney } from '@/utils/movie'

const booking = useBookingStore()
const selectedIds = computed(() => new Set(booking.selection.map((item) => item.seatId)))
</script>

<template>
  <div class="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
    <div class="flex min-w-0 flex-col gap-4">
      <p
        v-if="booking.notice"
        role="alert"
        class="rounded-xl bg-tint-warning px-4 py-3 text-xs font-semibold leading-[1.3] text-warning"
      >
        {{ booking.notice }}
      </p>

      <ErrorState
        v-if="booking.seatMapError"
        :message="booking.seatMapError.message"
        :loading="booking.seatMapLoading"
        @retry="booking.loadSeatMap()"
      />
      <Skeleton v-else-if="!booking.seatMap" class="h-[420px] rounded-2xl" />
      <div v-else :class="booking.seatMapLoading && 'opacity-60'">
        <SeatMap :map="booking.seatMap" :selected-ids="selectedIds" @toggle="booking.toggleSeat" />
      </div>
    </div>

    <div
      class="flex min-h-[320px] flex-col gap-4 border-t border-surface-2 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
    >
      <div class="flex flex-col gap-2">
        <h3 class="text-sm font-extrabold leading-[normal]">Your seats · Max {{ booking.maxSeats }}</h3>
        <p v-if="!booking.selection.length" class="text-xs leading-[1.3] text-muted">
          Pick up to {{ booking.maxSeats }} seats from the map. Each seat can carry its own ticket type.
        </p>
      </div>

      <SelectedSeats />

      <div class="mt-auto flex flex-col gap-4 pt-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase leading-[normal] tracking-[0.06em]">Subtotal</span>
          <span class="text-2xl font-extrabold leading-[normal]">{{ formatMoney(booking.subtotal) }}</span>
        </div>
        <Button
          class="w-full"
          :disabled="!booking.selection.length"
          :loading="booking.busy"
          @click="booking.submitHold()"
        >
          Next: Checkout
        </Button>
      </div>
    </div>
  </div>
</template>