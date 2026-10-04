<script setup lang="ts">
import { computed } from 'vue'
import CheckoutStep from '@/components/booking/CheckoutStep.vue'
import HoldTimer from '@/components/booking/HoldTimer.vue'
import OrderConfirmation from '@/components/booking/OrderConfirmation.vue'
import SeatsStep from '@/components/booking/SeatsStep.vue'
import Modal from '@/components/ui/Modal.vue'
import { useBookingStore } from '@/stores/booking'
import { formatWeekdayDate } from '@/utils/dates'

const booking = useBookingStore()

const subtitle = computed(() => {
  const target = booking.target
  if (!target) return ''
  return [
    target.venueName,
    `Hall ${target.hallName}`,
    formatWeekdayDate(target.date),
    target.time,
    target.formatName,
    target.languageName,
  ].join(' · ')
})

function onUpdate(value: boolean) {
  if (!value) booking.close()
}
</script>

<template>
  <Modal
    :model-value="booking.open"
    :closable="!booking.busy"
    panel-class="max-w-[1100px]"
    @update:model-value="onUpdate"
  >
    <template #header>
      <header
        v-if="booking.target && booking.step !== 'confirmation'"
        class="flex items-start justify-between gap-6 pr-10"
      >
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-extrabold uppercase leading-[normal]">{{ booking.target.movieTitle }}</h2>
          <p class="text-xs leading-[1.3] text-muted">{{ subtitle }}</p>
        </div>
        <HoldTimer />
      </header>
    </template>

    <template v-if="booking.target">
      <div
        v-if="booking.step !== 'confirmation'"
        class="mt-6 grid grid-cols-2 rounded-full bg-surface-2"
      >
        <button
          type="button"
          :disabled="booking.step === 'seats' || booking.busy"
          class="rounded-full py-3 text-xs font-bold uppercase leading-[normal] transition-colors disabled:cursor-default"
          :class="booking.step === 'seats' ? 'bg-accent' : 'hover:bg-tint-white'"
          @click="booking.backToSeats()"
        >
          Seats
        </button>
        <span
          class="rounded-full py-3 text-center text-xs font-bold uppercase leading-[normal]"
          :class="booking.step === 'checkout' && 'bg-accent'"
        >
          Checkout
        </span>
      </div>

      <SeatsStep v-if="booking.step === 'seats'" />
      <CheckoutStep v-else-if="booking.step === 'checkout'" />
      <OrderConfirmation v-else />
    </template>
  </Modal>
</template>