<script setup lang="ts">
import { ref } from 'vue'
import { useDragScroll } from '@/composables/useDragScroll'
import type { DayOption } from '@/utils/dates'

defineProps<{ days: DayOption[]; selected: string }>()
const emit = defineEmits<{ select: [iso: string] }>()

const row = ref<HTMLElement | null>(null)
useDragScroll(row)
</script>

<template>
  <div ref="row" class="no-scrollbar flex gap-1.5 overflow-x-auto">
    <button
      v-for="day in days"
      :key="day.iso"
      type="button"
      :aria-pressed="day.iso === selected"
      class="flex h-[54px] w-[37px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg px-1.5 py-2.5 text-xs font-semibold leading-[normal] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-colors"
      :class="day.iso === selected ? 'bg-accent' : 'bg-surface-2 hover:bg-disabled'"
      @click="emit('select', day.iso)"
    >
      <span>{{ day.weekday }}</span>
      <span>{{ day.day }}</span>
    </button>
  </div>
</template>