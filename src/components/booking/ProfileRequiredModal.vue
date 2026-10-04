<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import { useBookingStore } from '@/stores/booking'

const booking = useBookingStore()
const router = useRouter()

function goToProfile() {
  booking.profileGate = false
  router.push({ name: 'profile' })
}
</script>

<template>
  <Modal
    v-model="booking.profileGate"
    title="Complete your profile"
    description="Please complete your profile to enable booking"
    panel-class="max-w-[403px]"
  >
    <div class="mt-6 flex flex-col gap-3">
      <Button class="w-full" @click="goToProfile">Go to profile</Button>
      <Button variant="transparent" class="w-full" @click="booking.profileGate = false">Not now</Button>
    </div>
  </Modal>
</template>