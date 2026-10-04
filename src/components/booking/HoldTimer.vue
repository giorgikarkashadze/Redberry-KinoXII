<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useBookingStore } from '@/stores/booking'

const booking = useBookingStore()
const now = ref(Date.now())
let timer: number | undefined

const remainingMs = computed(() => Math.max(0, booking.holdDeadline - now.value))

const label = computed(() => {
  const total = Math.ceil(remainingMs.value / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
})

function tick() {
  now.value = Date.now()
  if (booking.hold && now.value >= booking.holdDeadline) {
    window.clearInterval(timer)
    booking.expireHold()
  }
}

watch(
  () => booking.hold,
  (hold) => {
    window.clearInterval(timer)
    if (!hold) return
    now.value = Date.now()
    timer = window.setInterval(tick, 250)
  },
  { immediate: true },
)

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <div v-if="booking.hold" class="rounded-xl bg-surface px-4 py-2 text-center">
    <p class="text-[10px] font-semibold uppercase leading-none tracking-[0.06em] text-muted">
      Seats held
    </p>
    <p
      class="mt-1.5 text-sm font-extrabold leading-none tabular-nums"
      :class="remainingMs < 60000 && 'text-accent'"
    >
      {{ label }}
    </p>
  </div>
</template>