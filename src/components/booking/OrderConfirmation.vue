<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { useBookingStore } from '@/stores/booking'
import { formatShortDate } from '@/utils/dates'
import { formatMoney } from '@/utils/movie'
import { ticketSummary } from '@/utils/order'

const booking = useBookingStore()
const router = useRouter()

function viewTickets() {
  booking.close()
  router.push({ name: 'profile', query: { tab: 'tickets' } })
}

function backToHome() {
  booking.close()
  router.push({ name: 'home' })
}
</script>

<template>
  <div v-if="booking.order" class="flex flex-col items-center gap-6 py-4 text-center">
    <div class="grid size-12 place-items-center rounded-full bg-success text-bg">
      <Check class="size-6" :stroke-width="3" />
    </div>

    <div class="flex flex-col items-center gap-2">
      <h2 class="text-xl font-extrabold leading-[normal]">Booking confirmed!</h2>
      <p class="max-w-sm text-xs leading-[1.3] text-muted">
        Your tickets are ready. We've sent the confirmation to your email.
      </p>
      <span class="mt-2 rounded-full bg-surface-2 px-4 py-1.5 text-xs font-bold uppercase leading-[normal]">
        Order #{{ booking.order.reference }}
      </span>
    </div>

    <div class="flex w-full max-w-[520px] flex-col gap-4 rounded-2xl bg-surface p-5 text-left">
      <div class="flex items-center gap-3">
        <img
          v-if="booking.order.session.movie.posterUrl"
          :src="booking.order.session.movie.posterUrl"
          alt=""
          class="h-14 w-10 rounded-md object-cover"
        />
        <div class="flex flex-col gap-1.5">
          <p class="text-sm font-extrabold uppercase leading-[normal]">
            {{ booking.order.session.movie.title }}
          </p>
          <p class="text-xs leading-[1.3] text-muted">
            {{ booking.order.session.venue.name }} · Hall {{ booking.order.session.hall.name }} ·
            {{ formatShortDate(booking.order.session.date) }} · {{ booking.order.session.time }}
          </p>
        </div>
      </div>
      <div class="h-px bg-surface-2" />
      <dl class="flex flex-col gap-2 text-xs leading-[1.3]">
        <div class="flex justify-between gap-4">
          <dt class="text-muted">Seats</dt>
          <dd class="font-semibold">{{ booking.order.tickets.map((ticket) => ticket.seatCode).join(', ') }}</dd>
        </div>
        <div class="flex justify-between gap-4">
          <dt class="text-muted">Tickets</dt>
          <dd class="font-semibold">{{ ticketSummary(booking.order.tickets) }}</dd>
        </div>
      </dl>
      <div class="h-px bg-surface-2" />
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase leading-[normal] tracking-[0.06em]">Total paid</span>
        <span class="text-xl font-extrabold leading-[normal]">{{ formatMoney(booking.order.totalPrice) }}</span>
      </div>
    </div>

    <div class="flex gap-3">
      <Button @click="viewTickets">View my tickets</Button>
      <Button variant="transparent" @click="backToHome">Back to home</Button>
    </div>
  </div>
</template>