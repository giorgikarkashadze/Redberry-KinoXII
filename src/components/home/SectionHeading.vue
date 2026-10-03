<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{ title: string; to?: RouteLocationRaw }>()
</script>

<template>
  <div class="flex items-end justify-between">
    <h2 class="text-2xl font-extrabold leading-[normal]">{{ title }}</h2>
    <RouterLink
      v-if="to"
      :to="to"
      class="text-xs font-semibold leading-[normal] text-accent hover:underline"
    >
      See all
    </RouterLink>
  </div>
</template>