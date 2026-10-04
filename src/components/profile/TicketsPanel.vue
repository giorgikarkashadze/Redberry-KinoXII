<script setup lang="ts">
import { computed, ref } from 'vue'
import { ApiError } from '@/api/client'
import { refundOrder } from '@/api/tickets'
import TicketCard from '@/components/profile/TicketCard.vue'
import Button from '@/components/ui/Button.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'
import Modal from '@/components/ui/Modal.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import type { Order } from '@/types/api'
import { formatMoney } from '@/utils/movie'

type View = 'upcoming' | 'past'

const props = defineProps<{
  upcoming: Order[]
  past: Order[]
  ready: boolean
  loading: boolean
  error: ApiError | null
}>()

const emit = defineEmits<{ changed: []; retry: [] }>()

const view = ref<View>('upcoming')
const target = ref<Order | null>(null)
const refunding = ref(false)
const refundError = ref<string | null>(null)

const views = computed(() => [
  { id: 'upcoming' as const, label: 'Upcoming', count: props.upcoming.length },
  { id: 'past' as const, label: 'Past', count: props.past.length },
])

const list = computed(() => (view.value === 'upcoming' ? props.upcoming : props.past))

function askRefund(order: Order) {
  refundError.value = null
  target.value = order
}

function onModalUpdate(open: boolean) {
  if (!open) target.value = null
}

async function confirmRefund() {
  const order = target.value
  if (!order || refunding.value) return
  refunding.value = true
  refundError.value = null
  try {
    await refundOrder(order.reference)
    target.value = null
    emit('changed')
  } catch (failure) {
    refundError.value =
      failure instanceof ApiError ? failure.message : 'Something went wrong. Please try again.'
    if (failure instanceof ApiError && failure.status === 422) emit('changed')
  } finally {
    refunding.value = false
  }
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <div class="flex w-fit gap-1 rounded-xl bg-surface p-1" role="tablist">
      <button
        v-for="item in views"
        :key="item.id"
        type="button"
        role="tab"
        :aria-selected="view === item.id"
        class="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold leading-[normal] transition-colors"
        :class="view === item.id ? 'bg-surface-2 text-white' : 'text-muted hover:text-white'"
        @click="view = item.id"
      >
        {{ item.label }}
        <span class="text-[10px]" :class="view === item.id ? 'text-muted' : 'text-disabled'">
          {{ ready ? item.count : '' }}
        </span>
      </button>
    </div>

    <ErrorState
      v-if="error && !ready"
      :message="error.message"
      :loading="loading"
      @retry="emit('retry')"
    />

    <div v-else-if="!ready" class="flex flex-col gap-4" aria-hidden="true">
      <Skeleton v-for="n in 2" :key="n" class="h-[167px] rounded-3xl" />
    </div>

    <EmptyState
      v-else-if="!list.length && view === 'upcoming'"
      title="No upcoming tickets"
      description="Book a session and your tickets will appear here."
    >
      <Button :to="{ name: 'sessions' }">Browse sessions</Button>
    </EmptyState>

    <EmptyState
      v-else-if="!list.length"
      title="No past tickets"
      description="Finished sessions and refunded orders will appear here."
    />

    <div v-else class="flex flex-col gap-4">
      <TicketCard v-for="order in list" :key="order.id" :order="order" :mode="view" @refund="askRefund" />
    </div>

    <Modal
      :model-value="target !== null"
      :closable="!refunding"
      title="Refund this order?"
      :description="
        target ? `Order #${target.reference} · ${formatMoney(target.totalPrice)} will be refunded and the seats released. This cannot be undone.` : ''
      "
      panel-class="max-w-[403px]"
      @update:model-value="onModalUpdate"
    >
      <p
        v-if="refundError"
        role="alert"
        class="mt-4 rounded-xl bg-tint-red px-4 py-3 text-xs font-semibold leading-[1.3] text-accent"
      >
        {{ refundError }}
      </p>
      <div class="mt-6 flex flex-col gap-3">
        <Button class="w-full" :loading="refunding" @click="confirmRefund">Refund order</Button>
        <Button variant="transparent" class="w-full" :disabled="refunding" @click="target = null">
          Keep tickets
        </Button>
      </div>
    </Modal>
  </section>
</template>