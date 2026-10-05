<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import AppLogo from '@/components/layout/AppLogo.vue'
import UserMenu from '@/components/layout/UserMenu.vue'
import Button from '@/components/ui/Button.vue'
import SearchBar from '@/components/search/SearchBar.vue'
import { useAuthStore } from '@/stores/auth'


const auth = useAuthStore()
</script>

<template>
  <header class="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/50 to-transparent">
    <div class="flex items-center justify-between px-6 pb-10 pt-[30px] lg:px-[60px]">
      <div class="flex items-center gap-9">
        <AppLogo class="text-xl" />
        <RouterLink
          to="/sessions"
          class="text-xs font-semibold uppercase tracking-[0.06em] text-white"
        >
          Sessions
        </RouterLink>
      </div>

      <div class="flex items-center gap-8">
        <SearchBar />

        <div v-if="!auth.ready" class="h-10 w-[120px]" aria-hidden="true" />
        <UserMenu v-else-if="auth.isAuthenticated" />
        <div v-else class="flex items-center gap-3">
          <Button @click="auth.openModal('register')">Sign up</Button>
          <Button variant="secondary" @click="auth.openModal('login')">Log in</Button>
        </div>
      </div>
    </div>
  </header>
</template>