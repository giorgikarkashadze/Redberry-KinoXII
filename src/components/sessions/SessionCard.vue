<script setup lang="ts">
import { computed } from 'vue'
import { Ticket } from 'lucide-vue-next'
import type { Session } from '@/types/api'

const LOW_SEATS = 5

const props = defineProps<{ session: Session }>()
const emit = defineEmits<{ select: [session: Session] }>()

const low = computed(() => props.session.seatsLeft <= LOW_SEATS)
</script>

<template>
  <button
    type="button"
    :disabled="session.isSoldOut"
    class="flex w-[252px] shrink-0 flex-col gap-3 rounded-2xl bg-surface p-[15px] text-left transition-colors enabled:hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
    @click="emit('select', session)"
  >
    <span class="flex items-center justify-between">
      <span class="text-lg font-extrabold leading-[normal]">{{ session.time }}</span>
      <span class="rounded-full bg-surface-2 px-2.5 py-[5px] text-xs font-semibold leading-[normal]">
        {{ session.format.name }}
      </span>
    </span>
    <span class="flex gap-2">
      <span class="flex min-w-0 flex-1 flex-col gap-2.5 text-xs">
        <span class="leading-[1.3] text-muted">{{ session.language.name }}</span>
        <span class="font-semibold leading-[normal]">
          {{ session.venue.name }} · Hall {{ session.hall.name }}
        </span>
      </span>
      <span class="flex shrink-0 flex-col items-end justify-center gap-2.5">
        <span v-if="session.isSoldOut" class="text-xs leading-[1.3] text-muted">Sold out</span>
        <span
          v-else
          class="flex items-center gap-1 text-xs leading-[1.3]"
          :class="low ? 'text-accent' : 'text-success'"
        >
          <Ticket class="size-3" />
          {{ session.seatsLeft }} left
        </span>
        <span class="text-sm font-extrabold leading-[normal]">₾{{ session.price }}</span>
      </span>
    </span>
  </button>
</template>