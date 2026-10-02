<script setup lang="ts">
import { computed, ref } from 'vue'
import type { User } from '@/types/api'

const props = defineProps<{ user: User }>()

const imageFailed = ref(false)

const initials = computed(() => {
  const source = (props.user.fullName ?? props.user.username).trim()
  const [first = '', second] = source.split(/\s+/)
  const letters = second ? `${first.charAt(0)}${second.charAt(0)}` : source.slice(0, 2)
  return letters.toUpperCase()
})
</script>

<template>
  <div class="relative shrink-0">
    <img
      v-if="user.avatar && !imageFailed"
      :src="user.avatar"
      alt=""
      class="size-full rounded-lg object-cover"
      @error="imageFailed = true"
    />
    <div
      v-else
      class="flex size-full items-center justify-center rounded-lg bg-surface text-xs font-semibold"
    >
      {{ initials }}
    </div>
    <span
      class="absolute -bottom-px -right-px size-2 rounded-full ring-2 ring-bg"
      :class="user.profileComplete ? 'bg-success' : 'bg-warning'"
    />
  </div>
</template>