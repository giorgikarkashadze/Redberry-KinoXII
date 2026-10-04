<script setup lang="ts">
import { useId } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

defineProps<{
  label: string
  placeholder?: string
  options: { value: string; label: string }[]
  error?: string | null
}>()

const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div>
    <label :for="id" class="mb-2.5 block text-xs font-semibold" :class="error ? 'text-accent' : 'text-white'">
      {{ label }}
    </label>
    <div class="relative">
      <select
        :id="id"
        v-model="model"
        class="h-10 w-full appearance-none rounded-xl border bg-surface px-4 pr-11 text-xs font-semibold outline-none transition-colors hover:bg-surface-2 focus:bg-surface"
        :class="
          error
            ? 'border-accent text-accent'
            : ['border-transparent hover:border-disabled focus:border-disabled', model ? 'text-white' : 'text-muted']
        "
      >
        <option value="">{{ placeholder ?? 'Select' }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <ChevronDown class="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-white" />
    </div>
    <p v-if="error" class="mt-2 text-xs font-semibold text-accent">{{ error }}</p>
  </div>
</template>