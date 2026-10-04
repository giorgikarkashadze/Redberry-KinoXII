<script setup lang="ts">
import { Ticket } from 'lucide-vue-next'
import type { SessionSummary } from '@/types/api'

defineProps<{ session: SessionSummary; blocked?: boolean }>()
const emit = defineEmits<{ select: [session: SessionSummary] }>()
</script>

<template>
  <button
    type="button"
    :disabled="session.isSoldOut || blocked"
    class="flex h-[81px] w-[207px] shrink-0 rounded-xl bg-bg text-left transition-colors enabled:hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40"
    @click="emit('select', session)"
  >
    <span class="flex flex-1 flex-col items-center justify-center gap-2">
      <span class="text-base font-extrabold leading-[normal]">{{ session.time }}</span>
      <span class="flex items-center gap-1.5 text-xs leading-[normal] text-muted">
        {{ session.language.code }}
        <span class="rounded-full bg-surface-2 px-2 py-0.5 font-semibold text-white">
          {{ session.format.name }}
        </span>
      </span>
    </span>
    <span class="my-3 border-l border-dashed border-disabled" />
    <span class="flex w-[70px] shrink-0 flex-col items-center justify-center gap-2">
      <span class="text-sm font-extrabold leading-[normal] text-accent">₾{{ session.price }}</span>
      <span v-if="session.isSoldOut" class="text-xs leading-[normal] text-muted">Sold out</span>
      <span v-else class="flex items-center gap-1 text-xs leading-[normal] text-muted">
        <Ticket class="size-3" />
        {{ session.seatsLeft }} left
      </span>
    </span>
  </button>
</template>