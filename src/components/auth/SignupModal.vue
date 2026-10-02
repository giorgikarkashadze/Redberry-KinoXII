<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { Upload } from 'lucide-vue-next'
import { ApiError } from '@/api/client'
import Button from '@/components/ui/Button.vue'
import FormInput from '@/components/ui/FormInput.vue'
import Modal from '@/components/ui/Modal.vue'
import { useForm } from '@/composables/useForm'
import { useAuthStore } from '@/stores/auth'
import { email, matches, minLength, required } from '@/utils/validators'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_AVATAR_BYTES = 2 * 1024 * 1024

const auth = useAuthStore()
const submitting = ref(false)
const isOpen = computed(() => auth.modal === 'register')

const { values, filled, formError, error, isValid, validate, validateAll, applyApiError, reset } =
  useForm(
    { username: '', email: '', password: '', passwordConfirmation: '' },
    {
      username: [required('Username'), minLength(3)],
      email: [required('Email'), email()],
      password: [required('Password'), minLength(3)],
      passwordConfirmation: [required('Confirm password'), matches('password')],
    },
  )

const fileInput = ref<HTMLInputElement | null>(null)
const avatar = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarError = ref<string | null>(null)

function clearAvatar() {
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatar.value = null
  avatarPreview.value = null
  avatarError.value = null
}

function onPickAvatar(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  clearAvatar()
  if (!ALLOWED_TYPES.includes(file.type)) {
    avatarError.value = 'Avatar must be a JPG, PNG or WEBP image'
    return
  }
  if (file.size > MAX_AVATAR_BYTES) {
    avatarError.value = 'Avatar must be 2MB or smaller'
    return
  }
  avatar.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

watch(isOpen, (open) => {
  if (open) {
    reset()
    clearAvatar()
    submitting.value = false
  }
})

onBeforeUnmount(clearAvatar)

function onUpdate(open: boolean) {
  if (!open) auth.closeModal()
}

async function submit() {
  if (submitting.value || !validateAll()) return
  submitting.value = true
  try {
    await auth.register({
      username: values.username.trim(),
      email: values.email.trim(),
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
      avatar: avatar.value,
    })
  } catch (failure) {
    applyApiError(failure, ['avatar'])
    if (failure instanceof ApiError && failure.errors?.avatar) {
      avatarError.value = failure.errors.avatar[0] ?? null
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Modal
    :model-value="isOpen"
    :closable="!submitting"
    title="Sign up"
    description="Welcome to Kino XII"
    panel-class="max-w-[520px]"
    @update:model-value="onUpdate"
  >
    <form class="mt-6 space-y-5" novalidate @submit.prevent="submit">
      <div>
        <div class="flex items-center gap-4">
          <button
            type="button"
            aria-label="Upload avatar"
            class="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface text-muted transition-colors hover:text-white"
            @click="fileInput?.click()"
          >
            <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" class="size-full object-cover" />
            <Upload v-else class="size-4" />
          </button>
          <div>
            <p class="text-sm font-bold">Upload avatar (optional)</p>
            <p class="text-xs text-muted">JPG, PNG or WEBP</p>
          </div>
          <button
            v-if="avatar"
            type="button"
            class="ml-auto text-xs text-muted hover:text-white"
            @click="clearAvatar"
          >
            Remove
          </button>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onPickAvatar"
        />
        <p v-if="avatarError" role="alert" class="mt-1.5 text-xs text-accent">{{ avatarError }}</p>
      </div>

      <FormInput
        v-model="values.username"
        label="Username"
        autocomplete="username"
        placeholder="User"
        :error="error('username')"
        :valid="isValid('username')"
        @blur="validate('username')"
      />
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

      <div class="grid grid-cols-2 gap-4">
        <FormInput
          v-model="values.password"
          label="Password"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          :error="error('password')"
          :valid="isValid('password')"
          @blur="validate('password')"
        />
        <FormInput
          v-model="values.passwordConfirmation"
          label="Confirm password"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          :error="error('passwordConfirmation')"
          :valid="isValid('passwordConfirmation')"
          @blur="validate('passwordConfirmation')"
        />
      </div>

      <p v-if="formError" role="alert" class="rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">
        {{ formError }}
      </p>

      <Button type="submit" size="lg" class="w-full" :disabled="!filled" :loading="submitting">
        Sign up
      </Button>
    </form>

    <p class="mt-5 text-center text-sm text-muted">
      Already have an account?
      <button type="button" class="font-bold text-accent hover:underline" @click="auth.openModal('login')">
        Log in
      </button>
    </p>
  </Modal>
</template>