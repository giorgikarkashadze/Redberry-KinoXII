<script setup lang="ts">
import { Check } from 'lucide-vue-next'

defineProps<{ label: string; hint?: string }>()
const checked = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="flex cursor-pointer items-center gap-2.5">
    <input v-model="checked" type="checkbox" class="peer sr-only" />
    <span
      class="grid size-[18px] shrink-0 place-items-center rounded-[5px] border-[1.5px] transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white"
      :class="checked ? 'border-accent bg-accent' : 'border-disabled'"
    >
      <Check v-if="checked" class="size-3 text-white" :stroke-width="3" />
    </span>
    <span class="flex items-center gap-[5px] text-sm font-semibold leading-[normal]">
      {{ label }}
      <span v-if="hint" class="text-xs font-normal leading-[1.3] text-muted">· {{ hint }}</span>
    </span>
  </label>
</template>