<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import AppLogo from '@/components/layout/AppLogo.vue'
import Button from '@/components/ui/Button.vue'
import { useAuthStore } from '@/stores/auth'
  const auth = useAuthStore()
</script>

<template>
  <header class="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/50 to-transparent">
    <div class="flex items-center gap-10 px-6 py-6 lg:px-20">
      <AppLogo class="text-xl" />

      <RouterLink
        to="/sessions"
        class="text-sm font-bold uppercase tracking-wide text-white/80 hover:text-white"
        active-class="!text-white"
      >
        Sessions
      </RouterLink>

      <div class="relative ml-auto w-full max-w-[560px]">
        <Search
          class="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/70"
        />
        <input
          type="text"
          placeholder="Search films and live events"
          class="w-full rounded-full bg-white/15 py-3 pl-11 pr-4 text-sm text-white backdrop-blur placeholder:text-white/70 focus-visible:outline-2 focus-visible:outline-white/60"
        />
      </div>

      <div v-if="!auth.isAuthenticated" class="flex items-center gap-3">
        <Button @click="auth.openModal('register')">Sign up</Button>
        <Button variant="light" @click="auth.openModal('login')">Log in</Button>
      </div>
    </div>
  </header>
</template>