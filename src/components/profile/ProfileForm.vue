<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { updateProfile } from '@/api/profile'
import Button from '@/components/ui/Button.vue'
import FormInput from '@/components/ui/FormInput.vue'
import FormSelect from '@/components/ui/FormSelect.vue'
import { useForm } from '@/composables/useForm'
import { useFormatted } from '@/composables/useFormatted'
import { useAuthStore } from '@/stores/auth'
import { useFilterOptionsStore } from '@/stores/filterOptions'
import type { User } from '@/types/api'
import { formatMobile } from '@/utils/format'
import { dateOfBirth, georgianMobile, maxLength, minLength, required } from '@/utils/validators'

const props = defineProps<{ user: User }>()

const auth = useAuthStore()
const filterOptions = useFilterOptionsStore()

function toValues(user: User) {
  return {
    fullName: user.fullName ?? '',
    mobileNumber: formatMobile(user.mobileNumber ?? ''),
    dateOfBirth: user.dateOfBirth ?? '',
    preferredVenueId: user.preferredVenue ? String(user.preferredVenue.id) : '',
  }
}

const saved = ref(toValues(props.user))
const saving = ref(false)
const justSaved = ref(false)

const { values, formError, error, isValid, validate, validateAll, valid, applyApiError } = useForm(
  toValues(props.user),
  {
    fullName: [
      required('Name'),
      minLength(3, 'Name must be at least 3 characters'),
      maxLength(50, 'Name must not exceed 50 characters'),
    ],
    mobileNumber: [required('Mobile number'), georgianMobile()],
    dateOfBirth: [required('Date of birth'), dateOfBirth()],
  },
)

useFormatted(() => values.mobileNumber, (value) => (values.mobileNumber = value), formatMobile)

const dirty = computed(() =>
  (Object.keys(saved.value) as (keyof typeof saved.value)[]).some(
    (key) => values[key] !== saved.value[key],
  ),
)

watch(dirty, (changed) => {
  if (changed) justSaved.value = false
})

const venueOptions = computed(() =>
  (filterOptions.options?.venues ?? []).map((venue) => ({
    value: String(venue.id),
    label: `${venue.name} · ${venue.city}`,
  })),
)

const eligibility = computed(() => {
  const age = props.user.age
  const ratings = filterOptions.options?.ageRatings
  if (age == null || !ratings) return null
  const blocked = ratings.filter((rating) => rating.minAge > age).map((rating) => rating.code)
  return blocked.length
    ? `You are ${age}, you cannot buy tickets for ${blocked.join(' or ')} titles.`
    : `You are ${age}, you can buy tickets for all age ratings.`
})

async function submit() {
  if (saving.value || !validateAll()) return
  saving.value = true
  justSaved.value = false
  try {
    const venueId = values.preferredVenueId ? Number(values.preferredVenueId) : null
    const hadVenue = props.user.preferredVenue != null
    const updated = await updateProfile({
      fullName: values.fullName.trim(),
      mobileNumber: values.mobileNumber,
      dateOfBirth: values.dateOfBirth,
      preferredVenueId: venueId ?? (hadVenue ? null : undefined),
    })
    auth.setUser(updated)
    saved.value = toValues(updated)
    Object.assign(values, saved.value)
    justSaved.value = true
  } catch (failure) {
    applyApiError(failure)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="flex max-w-[930px] flex-col gap-5" novalidate @submit.prevent="submit">
    <p
      v-if="!user.profileComplete"
      role="status"
      class="rounded-xl bg-tint-warning px-4 py-3 text-xs font-semibold leading-[1.3] text-warning"
    >
      Please complete your profile to enable booking.
    </p>
    <p
      v-else
      role="status"
      class="w-fit rounded-xl bg-tint-green px-4 py-3 text-xs font-semibold leading-[1.3] text-success"
    >
      Profile Complete ✓
    </p>

    <FormInput
      v-model="values.fullName"
      label="Full name"
      autocomplete="name"
      placeholder="e.g. Meri Sanikidze"
      :error="error('fullName')"
      :valid="isValid('fullName')"
      @blur="validate('fullName')"
    />
    <FormInput
      :model-value="user.email"
      label="Email"
      disabled
      hint="Set at registration and cannot be changed"
    />
    <FormInput
      v-model="values.mobileNumber"
      label="Mobile number"
      type="tel"
      autocomplete="tel-national"
      placeholder="e.g. 555 123 456"
      :error="error('mobileNumber')"
      :valid="isValid('mobileNumber')"
      @blur="validate('mobileNumber')"
    />
    <FormInput
      v-model="values.dateOfBirth"
      label="Date of birth"
      type="date"
      autocomplete="bday"
      :error="error('dateOfBirth')"
      :valid="isValid('dateOfBirth')"
      @blur="validate('dateOfBirth')"
    />
    <FormSelect
      v-model="values.preferredVenueId"
      label="Preferred venue (optional)"
      placeholder="Select a venue"
      :options="venueOptions"
      :error="error('preferredVenueId')"
    />

    <p v-if="eligibility" class="text-xs leading-[1.3] text-muted">{{ eligibility }}</p>

    <p
      v-if="formError"
      role="alert"
      class="rounded-xl bg-tint-red px-4 py-3 text-xs font-semibold leading-[1.3] text-accent"
    >
      {{ formError }}
    </p>

    <div class="flex items-center gap-4">
      <Button type="submit" :disabled="!dirty || !valid" :loading="saving">Save changes</Button>
      <span v-if="justSaved" role="status" class="text-xs font-semibold text-success">Profile saved</span>
    </div>
  </form>
</template>