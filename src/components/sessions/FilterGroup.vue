<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <section class="flex flex-col gap-3">
    <h3 class="text-xs font-semibold uppercase leading-[normal] tracking-[0.06em] text-muted">
      {{ title }}
    </h3>
    <slot />
  </section>
</template>