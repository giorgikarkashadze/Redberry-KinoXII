<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'default' | 'red' }>(), { variant: 'default' })
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold leading-[normal]"
    :class="variant === 'red' ? 'bg-tint-red text-accent' : 'bg-tint-white text-white'"
  >
    <slot />
  </span>
</template>