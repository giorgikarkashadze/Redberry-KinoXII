<script setup lang="ts">
type Variant = 'primary' | 'light' | 'secondary'
type Size = 'md' | 'lg'

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button', loading: false, disabled: false },
)

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover disabled:bg-[#EC3013] disabled:text-white/50',
  light: 'bg-white text-bg hover:bg-white/90 disabled:bg-white/50',
  secondary: 'bg-surface-2 text-white hover:bg-border disabled:text-white/40',
}

const sizes: Record<Size, string> = {
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3.5',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    class="inline-flex items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed"
    :class="[variants[variant], sizes[size]]"
  >
    <span
      v-if="loading"
      class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>