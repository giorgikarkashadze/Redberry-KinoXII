<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

type Variant = 'primary' | 'secondary' | 'transparent' | 'outline'

withDefaults(
  defineProps<{
    variant?: Variant
    type?: 'button' | 'submit'
    loading?: boolean
    disabled?: boolean
    compact?: boolean
    to?: RouteLocationRaw
  }>(),
  { variant: 'primary', type: 'button', loading: false, disabled: false, compact: false },
)

const base = 'px-[22px] text-sm font-extrabold disabled:bg-disabled disabled:text-muted'
const variants: Record<Variant, string> = {
  primary: `${base} bg-accent text-white hover:brightness-110`,
  secondary: `${base} bg-white text-bg hover:bg-white/90`,
  transparent: `${base} bg-tint-white text-white hover:bg-muted`,
  outline:
    'border border-muted px-3 py-1.5 text-xs font-semibold text-white hover:bg-tint-white disabled:opacity-50',
}
</script>

<template>
  <component
    :is="to ? RouterLink : 'button'"
    v-bind="to ? { to } : { type, disabled: disabled || loading, 'aria-busy': loading }"
    class="inline-flex items-center justify-center gap-1 rounded-full leading-[normal] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed"
    :class="[variants[variant], variant !== 'outline' && (compact ? 'py-2.5' : 'py-[13px]')]"
  >
    <span
      v-if="loading"
      class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <slot />
  </component>
</template>