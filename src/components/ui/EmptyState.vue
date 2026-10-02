<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
  <div class="flex flex-col items-center gap-3 rounded-2xl bg-surface px-6 py-10 text-center">
    <p class="text-lg font-extrabold">{{ title }}</p>
    <p v-if="description" class="max-w-md text-sm text-muted">{{ description }}</p>
    <slot />
  </div>
</template>