<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, ChevronDown, LogOut, Ticket, User as UserIcon } from 'lucide-vue-next'
import UserAvatar from '@/components/layout/UserAvatar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const open = ref(false)
const root = ref<HTMLElement | null>(null)

const displayName = computed(() => auth.user?.fullName ?? auth.user?.username ?? '')
const firstName = computed(() => displayName.value.split(/\s+/)[0] ?? '')

function onPointerDown(event: PointerEvent) {
  if (open.value && root.value && !root.value.contains(event.target as Node)) open.value = false
}
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
})

watch(() => route.fullPath, () => (open.value = false))

async function logout() {
  open.value = false
  await auth.logout()
  if (route.name === 'profile') router.push({ name: 'home' })
}

const itemClass =
  'flex h-10 w-full items-center gap-2 rounded-[10px] pl-5 text-left text-sm font-semibold transition-colors hover:bg-tint-white'
</script>

<template>
  <div v-if="auth.user" ref="root" class="relative">
    <button
      type="button"
      class="flex items-center gap-6"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="flex items-center gap-3">
        <UserAvatar :user="auth.user" class="size-10" />
        <span class="text-sm font-semibold leading-[normal]">{{ firstName }}</span>
      </span>
      <ChevronDown class="size-4 transition-transform" :class="open && 'rotate-180'" />
    </button>

    <div
      v-if="open"
      role="menu"
      class="absolute right-0 top-full z-40 mt-4 w-[302px] rounded-2xl bg-bg pb-2.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)]"
    >
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2.5 pl-5 pt-5">
          <UserAvatar :user="auth.user" class="size-[42px]" />
          <div class="flex w-[190px] flex-col gap-0.5">
            <p class="truncate text-sm font-semibold leading-[normal]">{{ displayName }}</p>
            <p class="truncate text-xs leading-[1.3] text-muted">{{ auth.user.email }}</p>
          </div>
        </div>

        <div class="px-5">
          <div
            v-if="auth.user.profileComplete"
            class="flex items-center gap-1.5 rounded-[10px] bg-tint-green px-3 py-2.5 text-sm font-semibold text-success"
          >
            Profile Complete
            <Check class="size-4" />
          </div>
          <div v-else class="flex flex-col gap-0.5 rounded-[10px] bg-tint-warning px-3 py-2.5">
            <p class="text-sm font-semibold leading-[normal] text-warning">Profile incomplete</p>
            <p class="text-xs leading-[1.3] text-muted">Please complete your profile to enable booking</p>
          </div>
        </div>
      </div>

      <div class="mt-1 flex flex-col gap-1">
        <div class="flex flex-col gap-0.5 pt-1">
          <RouterLink :to="{ name: 'profile' }" role="menuitem" :class="itemClass" @click="open = false">
            <UserIcon class="size-4" />
            My Profile
          </RouterLink>
          <RouterLink
            :to="{ name: 'profile', query: { tab: 'tickets' } }"
            role="menuitem"
            :class="itemClass"
            @click="open = false"
          >
            <Ticket class="size-4" />
            My Tickets
          </RouterLink>
        </div>

        <div class="h-px w-full bg-tint-white" />

        <button type="button" role="menuitem" :class="[itemClass, 'text-accent']" @click="logout">
          <LogOut class="size-4" />
          Log out
        </button>
      </div>
    </div>
  </div>
</template>