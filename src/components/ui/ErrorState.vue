<script setup lang="ts">
import Button from '@/components/ui/Button.vue'

defineProps<{ message?: string; loading?: boolean }>()
defineEmits<{ retry: [] }>()
</script>

<template>
  <div role="alert" class="flex flex-col items-center gap-4 rounded-2xl bg-surface px-6 py-10 text-center">
    <p class="text-lg font-extrabold">Something went wrong</p>
    <p class="max-w-md text-sm text-muted">
      {{ message ?? 'We could not load this. Please try again.' }}
    </p>
    <Button variant="secondary" :loading="loading" @click="$emit('retry')">Try again</Button>
  </div>
</template>