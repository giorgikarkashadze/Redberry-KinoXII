<script setup lang="ts">
import { computed, ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useDismissable } from '@/composables/useDismissable'
import type { SortOption } from '@/types/api'

const props = defineProps<{ options: SortOption[]; modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [id: string] }>()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
useDismissable(root, open)

const current = computed(
  () => props.options.find((option) => option.id === props.modelValue) ?? props.options[0],
)

function select(id: string) {
  open.value = false
  if (id !== props.modelValue) emit('update:modelValue', id)
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 text-sm leading-[normal]"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="text-muted">Sort:</span>
      <span class="font-semibold">{{ current?.label }}</span>
      <ChevronDown class="size-4 transition-transform" :class="open && 'rotate-180'" />
    </button>

    <ul
      v-if="open"
      role="listbox"
      class="absolute right-0 top-full z-20 mt-2 min-w-full rounded-xl bg-surface-2 p-1 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)]"
    >
      <li v-for="option in options" :key="option.id" role="option" :aria-selected="option.id === modelValue">
        <button
          type="button"
          class="w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-tint-white"
          :class="option.id === modelValue && 'text-accent'"
          @click="select(option.id)"
        >
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>