<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <div class="space-y-4 p-8">
    <p>ready: {{ auth.ready }} · user: {{ auth.user?.username ?? 'guest' }}</p>
    <button
      class="mr-3 rounded bg-accent px-4 py-2"
      @click="auth.login({ email: 'karkash@example.com', password: 'secret' })"
    >
      Login
    </button>
    <button class="rounded bg-surface px-4 py-2" @click="auth.logout()">Logout</button>
  </div>
</template>