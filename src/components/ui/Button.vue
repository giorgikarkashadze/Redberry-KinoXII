<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'transparent' | 'outline'

withDefaults(
  defineProps<{
    variant?: Variant
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false },
)

const base = 'px-[22px] py-[13px] text-sm font-extrabold disabled:bg-disabled disabled:text-muted'
const variants: Record<Variant, string> = {
  primary: `${base} bg-accent text-white enabled:hover:brightness-110`,
  secondary: `${base} bg-white text-bg enabled:hover:bg-white/90`,
  transparent: `${base} bg-tint-white text-white enabled:hover:bg-muted`,
  outline:
    'border border-muted px-3 py-1.5 text-xs font-semibold text-white enabled:hover:bg-tint-white disabled:opacity-50',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading"
    class="inline-flex items-center justify-center gap-1 rounded-full leading-[normal] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed"
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