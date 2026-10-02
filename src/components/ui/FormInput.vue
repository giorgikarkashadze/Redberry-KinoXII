<script setup lang="ts">
import { useId } from 'vue'
import { CircleAlert, Check } from 'lucide-vue-next'

defineProps<{
  label: string
  type?: string
  placeholder?: string
  autocomplete?: string
  error?: string | null
  valid?: boolean
  disabled?: boolean
  hint?: string
}>()

const model = defineModel<string>({ default: '' })
const emit = defineEmits<{ blur: [] }>()
const id = useId()
</script>

<template>
  <div>
    <label
      :for="id"
      class="mb-2.5 block text-xs font-semibold"
      :class="error ? 'text-accent' : 'text-white'"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="h-10 w-full rounded-xl border bg-surface px-4 pr-11 text-xs font-semibold outline-none transition-colors placeholder:text-muted hover:bg-surface-2 focus:bg-surface disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-surface"
        :class="
          error
            ? 'border-accent text-accent'
            : 'border-transparent text-white hover:border-disabled focus:border-disabled'
        "
        @blur="emit('blur')"
      />
      <CircleAlert v-if="error" class="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-accent" />
      <Check v-else-if="valid" class="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-success" />
    </div>

    <p v-if="error" :id="`${id}-error`" class="mt-2 text-xs font-semibold text-accent">{{ error }}</p>
    <p v-else-if="hint" class="mt-2 text-xs font-semibold text-muted">{{ hint }}</p>
  </div>
</template>