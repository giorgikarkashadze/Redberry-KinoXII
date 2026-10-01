<script setup lang="ts">
type Variant = 'primary' | 'light' | 'secondary'

withDefaults(
  defineProps<{
    variant?: Variant
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false },
)

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover disabled:bg-[#52566a] disabled:text-white/50',
  light: 'bg-white text-bg hover:bg-white/90 disabled:bg-white/50',
  secondary: 'bg-surface-2 text-white hover:bg-border disabled:text-white/40',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    class="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed"
    :class="variants[variant]"
  >
    <span
      v-if="loading"
      class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
