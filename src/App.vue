<script setup lang="ts">
import { ref } from 'vue'
import FormInput from '@/components/ui/FormInput.vue'

const a = ref('')
const b = ref('example@gmail.com')
const c = ref('abc')
</script>

<template>
  <div class="max-w-md space-y-5 p-8">
    <FormInput v-model="a" label="Email" placeholder="example@gmail.com" />
    <FormInput v-model="b" label="Email" valid />
    <FormInput v-model="c" label="Password" type="password" error="At least 3 characters" />
    <FormInput model-value="merisanikidze@gmail.com" label="Email" disabled hint="Set at registration and cannot be changed" />
  </div>
</template>