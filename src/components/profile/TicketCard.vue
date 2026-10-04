<script setup lang="ts">
import { computed } from 'vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import type { Order } from '@/types/api'
import { formatShortDate, refundCutoffLabel } from '@/utils/dates'
import { formatMoney } from '@/utils/movie'

const props = defineProps<{ order: Order; mode: 'upcoming' | 'past' }>()
const emit = defineEmits<{ refund: [order: Order] }>()

const labelClass = 'text-xs font-semibold uppercase leading-[normal] tracking-[0.06em] text-muted'

const session = computed(() => props.order.session)

const note = computed(() => {
  if (props.mode === 'past') {
    return props.order.refundedAt !== null ? 'This order was refunded' : 'This session has finished'
  }
  const cutoff = refundCutoffLabel(session.value.date, session.value.time)
  return props.order.isRefundable ? `Refundable until ${cutoff}` : `Refunds closed at ${cutoff}`
})
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-3xl bg-surface md:flex-row">
    <div class="flex flex-1 gap-5 p-5">
      <img
        v-if="session.movie.posterUrl"
        :src="session.movie.posterUrl"
        alt=""
        loading="lazy"
        class="h-[103px] w-[78px] shrink-0 rounded-lg object-cover"
      />
      <div v-else class="h-[103px] w-[78px] shrink-0 rounded-lg bg-surface-2" />

      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <h3 class="text-xl font-extrabold leading-[normal]">{{ session.movie.title }}</h3>
          <Badge variant="red" compact>{{ session.movie.ageRating.code }}</Badge>
          <span class="text-sm leading-[1.3] text-muted">{{ session.movie.runtimeMinutes }} min</span>
        </div>

        <dl class="flex flex-wrap gap-x-10 gap-y-3">
          <div class="flex flex-col gap-2">
            <dt :class="labelClass">Date</dt>
            <dd class="text-sm font-semibold leading-[normal]">
              {{ formatShortDate(session.date) }} · {{ session.time }}
            </dd>
          </div>
          <div class="flex flex-col gap-2">
            <dt :class="labelClass">Venue</dt>
            <dd class="text-sm font-semibold leading-[normal]">
              {{ session.venue.name }} · Hall {{ session.hall.name }}
            </dd>
          </div>
          <div class="flex flex-col gap-2">
            <dt :class="labelClass">Format</dt>
            <dd class="text-sm font-semibold leading-[normal]">
              {{ session.format.name }} · {{ session.language.name }}
            </dd>
          </div>
        </dl>

        <div class="flex flex-wrap items-center gap-2">
          <span :class="labelClass" class="mr-1">Seats</span>
          <span
            v-for="ticket in order.tickets"
            :key="ticket.id"
            class="rounded-md bg-surface-2 px-2 py-1 text-xs font-semibold leading-[normal]"
          >
            {{ ticket.seatCode }} · {{ ticket.ticketType.name }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col justify-center gap-3 border-t border-dashed border-surface-2 p-5 md:w-[260px] md:shrink-0 md:border-l md:border-t-0"
    >
      <div class="flex flex-col gap-1.5">
        <p :class="labelClass">Order</p>
        <p class="text-sm font-extrabold leading-[normal]">#{{ order.reference }}</p>
      </div>
      <div class="flex items-baseline justify-between">
        <span class="text-sm leading-[normal] text-muted">Total paid</span>
        <span class="text-xl font-extrabold leading-[normal]">{{ formatMoney(order.totalPrice) }}</span>
      </div>
      <Button
        v-if="mode === 'upcoming'"
        variant="transparent"
        compact
        class="w-full"
        :disabled="!order.isRefundable"
        :title="order.isRefundable ? undefined : note"
        @click="emit('refund', order)"
      >
        Refund
      </Button>
      <p class="text-center text-xs leading-[1.3] text-muted">{{ note }}</p>
    </div>
  </article>
</template>