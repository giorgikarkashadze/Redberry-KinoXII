<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'red'; compact?: boolean }>(), {
  variant: 'default',
  compact: false,
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full text-xs font-semibold leading-[normal]"
    :class="[
      variant === 'red' ? 'bg-tint-red text-accent' : 'bg-tint-white text-white',
      compact ? 'px-2 py-1' : 'px-3 py-1.5',
    ]"
  >
    <slot />
  </span>
</template>