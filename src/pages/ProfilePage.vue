<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAllTickets } from '@/api/tickets'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import TicketsPanel from '@/components/profile/TicketsPanel.vue'
import Button from '@/components/ui/Button.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useRequest } from '@/composables/useRequest'
import { useAuthStore } from '@/stores/auth'

type Tab = 'personal' | 'tickets'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const tab = computed<Tab>(() => (route.query.tab === 'tickets' ? 'tickets' : 'personal'))

const {
  data: tickets,
  error: ticketsError,
  loading: ticketsLoading,
  run: loadTickets,
} = useRequest((signal) => fetchAllTickets(signal), { immediate: false })

const tabs = computed(() => [
  { id: 'personal' as const, label: 'Personal Information', count: 0 },
  { id: 'tickets' as const, label: 'My Tickets', count: tickets.value?.upcoming.length ?? 0 },
])

function setTab(next: Tab) {
  router.replace({ name: 'profile', query: next === 'tickets' ? { tab: 'tickets' } : {} })
}

watch(
  () => auth.user?.id,
  (id) => {
    if (id) loadTickets()
  },
  { immediate: true },
)

watch(
  () => [auth.ready, auth.isAuthenticated] as const,
  ([ready, authenticated]) => {
    if (ready && !authenticated) auth.openModal('login')
  },
  { immediate: true },
)
</script>

<template>
  <div class="px-6 pb-16 pt-[117px] lg:px-[51px]">
    <template v-if="auth.user">
      <h1 class="text-2xl font-extrabold leading-[normal]">My Profile</h1>

      <div class="mt-6 flex gap-8 border-b border-surface-2" role="tablist">
        <button
          v-for="item in tabs"
          :key="item.id"
          type="button"
          role="tab"
          :aria-selected="tab === item.id"
          class="relative -mb-px flex items-center gap-2 pb-3 text-sm font-semibold leading-[normal] transition-colors"
          :class="tab === item.id ? 'text-white' : 'text-muted hover:text-white'"
          @click="setTab(item.id)"
        >
          {{ item.label }}
          <span
            v-if="item.count"
            class="grid min-w-[18px] place-items-center rounded-full bg-accent px-1.5 text-[10px] font-semibold leading-[18px] text-white"
          >
            {{ item.count }}
          </span>
          <span v-if="tab === item.id" class="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
        </button>
      </div>

      <div class="mt-8">
        <ProfileForm v-if="tab === 'personal'" :key="auth.user.id" :user="auth.user" />
        <TicketsPanel
          v-else
          :upcoming="tickets?.upcoming ?? []"
          :past="tickets?.past ?? []"
          :ready="tickets !== null"
          :loading="ticketsLoading"
          :error="ticketsError"
          @changed="loadTickets"
          @retry="loadTickets"
        />
      </div>
    </template>

    <div v-else-if="!auth.ready" class="flex max-w-[930px] flex-col gap-5" aria-hidden="true">
      <Skeleton class="h-8 w-48 rounded-lg" />
      <Skeleton class="h-10 w-full rounded-xl" />
      <Skeleton class="h-10 w-full rounded-xl" />
    </div>

    <EmptyState
      v-else
      title="Log in to see your profile"
      description="Your personal information and tickets are available once you are signed in."
    >
      <Button @click="auth.openModal('login')">Log in</Button>
    </EmptyState>
  </div>
</template>