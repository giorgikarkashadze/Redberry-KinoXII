<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import FormInput from '@/components/ui/FormInput.vue'
import Modal from '@/components/ui/Modal.vue'
import { useForm } from '@/composables/useForm'
import { useAuthStore } from '@/stores/auth'
import { email, minLength, required } from '@/utils/validators'

const auth = useAuthStore()
const submitting = ref(false)
const isOpen = computed(() => auth.modal === 'login')

const { values, filled, formError, error, isValid, validate, validateAll, applyApiError, reset } =
  useForm(
    { email: '', password: '' },
    {
      email: [required('Email'), email()],
      password: [required('Password'), minLength(3)],
    },
  )

watch(isOpen, (open) => {
  if (open) {
    reset()
    submitting.value = false
  }
})

function onUpdate(open: boolean) {
  if (!open) auth.closeModal()
}

async function submit() {
  if (submitting.value || !validateAll()) return
  submitting.value = true
  try {
    await auth.login({ email: values.email.trim(), password: values.password })
  } catch (failure) {
    applyApiError(failure)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Modal
    :model-value="isOpen"
    :closable="!submitting"
    title="Log in"
    description="Welcome back to Kino XII"
    panel-class="max-w-[403px]"
    @update:model-value="onUpdate"
  >
    <form class="mt-6 flex flex-col gap-8" novalidate @submit.prevent="submit">
      <div class="flex flex-col gap-6">
        <FormInput
          v-model="values.email"
          label="Email"
          type="email"
          autocomplete="email"
          placeholder="example@gmail.com"
          :error="error('email')"
          :valid="isValid('email')"
          @blur="validate('email')"
        />
        <FormInput
          v-model="values.password"
          label="Password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          :error="error('password')"
          :valid="isValid('password')"
          @blur="validate('password')"
        />
      </div>

      <div class="flex flex-col items-center gap-6">
        <p v-if="formError" role="alert" class="w-full rounded-xl bg-tint-red px-4 py-3 text-xs font-semibold text-accent">
          {{ formError }}
        </p>
        <Button type="submit" class="w-full" :disabled="!filled" :loading="submitting">Log in</Button>
        <p class="flex items-center gap-1.5 text-sm text-muted">
          Don't have an account?
          <button type="button" class="font-extrabold text-accent hover:underline" @click="auth.openModal('register')">
            Sign up
          </button>
        </p>
      </div>
    </form>
  </Modal>
</template>