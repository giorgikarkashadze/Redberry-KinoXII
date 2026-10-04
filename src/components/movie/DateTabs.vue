<script setup lang="ts">
import type { DayOption } from '@/utils/dates'

defineProps<{ days: (DayOption & { disabled: boolean })[]; selected: string | null }>()
const emit = defineEmits<{ select: [iso: string] }>()
</script>

<template>
  <div class="flex flex-wrap gap-[7px]">
    <button
      v-for="day in days"
      :key="day.iso"
      type="button"
      :disabled="day.disabled"
      :aria-pressed="day.iso === selected"
      class="flex size-20 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl text-sm font-semibold leading-[normal] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      :class="day.iso === selected ? 'bg-accent' : 'bg-surface enabled:hover:bg-surface-2'"
      @click="emit('select', day.iso)"
    >
      <span>{{ day.weekday }}</span>
      <span class="text-lg font-extrabold">{{ day.day }}</span>
    </button>
  </div>
</template>