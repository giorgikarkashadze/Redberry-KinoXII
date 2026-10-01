<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'

const open = ref(false)
</script>

<template>
  <div class="p-8">
    <Button @click="open = true">Open modal</Button>
    <p class="mt-4">Some page content behind the modal.</p>

    <Modal v-model="open" title="Log in" description="Welcome back to Kino XII">
      <input class="mt-6 w-full rounded-xl bg-surface p-3" placeholder="Type here" />
    </Modal>
  </div>
</template>