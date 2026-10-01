<script setup lang="ts">
import { onMounted } from 'vue'
import { login, fetchMe } from '@/api/auth'
import { setToken } from '@/api/client'

onMounted(async () => {
  try {
    const { token, user } = await login({ email: 'karkash@example.com', password: 'secret' })
    console.log('logged in', user)
    setToken(token)
    console.log('me', await fetchMe())
  } catch (e) {
    console.log('login failed', e)
  }

  try {
    await login({ email: 'karkash@example.com', password: 'wrongpass' })
  } catch (e) {
    console.log('expected error', e)
  }
})
</script>

<template><RouterView /></template>