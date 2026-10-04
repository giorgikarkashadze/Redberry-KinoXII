<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{ page: number; lastPage: number }>()
const emit = defineEmits<{ change: [page: number] }>()

const items = computed(() => {
  const wanted = new Set([1, props.lastPage, props.page - 1, props.page, props.page + 1])
  const pages = [...wanted]
    .filter((value) => value >= 1 && value <= props.lastPage)
    .sort((a, b) => a - b)
  const result: (number | null)[] = []
  pages.forEach((value, index) => {
    const previous = pages[index - 1]
    if (previous !== undefined) {
      if (value - previous === 2) result.push(previous + 1)
      else if (value - previous > 2) result.push(null)
    }
    result.push(value)
  })
  return result
})

const arrowClass =
  'grid size-10 place-items-center rounded-full bg-surface transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface'
</script>

<template>
  <nav v-if="lastPage > 1" class="flex items-center gap-2" aria-label="Pagination">
    <button
      type="button"
      aria-label="Previous page"
      :disabled="page <= 1"
      :class="arrowClass"
      @click="emit('change', page - 1)"
    >
      <ChevronLeft class="size-4" />
    </button>

    <template v-for="(item, index) in items" :key="index">
      <span v-if="item === null" class="grid size-10 place-items-center text-sm font-medium text-muted">
        ...
      </span>
      <button
        v-else
        type="button"
        :aria-current="item === page ? 'page' : undefined"
        class="grid size-10 place-items-center rounded-full text-sm font-medium transition-colors"
        :class="item === page ? 'bg-accent text-white' : 'text-muted hover:bg-surface'"
        @click="emit('change', item)"
      >
        {{ item }}
      </button>
    </template>

    <button
      type="button"
      aria-label="Next page"
      :disabled="page >= lastPage"
      :class="arrowClass"
      @click="emit('change', page + 1)"
    >
      <ChevronRight class="size-4" />
    </button>
  </nav>
</template>