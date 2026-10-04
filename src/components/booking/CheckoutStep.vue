<script setup lang="ts">
import { watch } from 'vue'
import Button from '@/components/ui/Button.vue'
import FormInput from '@/components/ui/FormInput.vue'
import { useForm } from '@/composables/useForm'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'
import { formatShortDate } from '@/utils/dates'
import { formatCardNumber, formatCvv, formatExpiry, formatMobile } from '@/utils/format'
import { formatMoney } from '@/utils/movie'
import { ticketSummary } from '@/utils/order'
import {
  cardNumber,
  cvv,
  email,
  futureExpiry,
  georgianMobile,
  minLength,
  required,
} from '@/utils/validators'

const auth = useAuthStore()
const booking = useBookingStore()

const { values, formError, error, isValid, validate, validateAll, applyApiError } = useForm(
  {
    fullName: auth.user?.fullName ?? '',
    email: auth.user?.email ?? '',
    mobileNumber: formatMobile(auth.user?.mobileNumber ?? ''),
    cardNumber: '',
    expiry: '',
    cvv: '',
  },
  {
    fullName: [required('Full name'), minLength(3)],
    email: [required('Email'), email()],
    mobileNumber: [required('Mobile number'), georgianMobile()],
    cardNumber: [required('Card number'), cardNumber()],
    expiry: [required('Expiry'), futureExpiry()],
    cvv: [required('CVV'), cvv()],
  },
)

function keepFormatted(read: () => string, write: (value: string) => void, format: (value: string) => string) {
  watch(read, (value) => {
    const next = format(value)
    if (next !== value) write(next)
  })
}

keepFormatted(() => values.cardNumber, (value) => (values.cardNumber = value), formatCardNumber)
keepFormatted(() => values.expiry, (value) => (values.expiry = value), formatExpiry)
keepFormatted(() => values.cvv, (value) => (values.cvv = value), formatCvv)
keepFormatted(() => values.mobileNumber, (value) => (values.mobileNumber = value), formatMobile)

async function submit() {
  if (booking.busy || !validateAll()) return
  try {
    await booking.pay({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      mobileNumber: values.mobileNumber,
      cardNumber: values.cardNumber,
      expiry: values.expiry,
      cvv: values.cvv,
    })
  } catch (failure) {
    applyApiError(failure)
  }
}
</script>

<template>
  <div class="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
    <form id="checkout-form" class="flex flex-col gap-5" novalidate @submit.prevent="submit">
      <FormInput
        v-model="values.fullName"
        label="Full name"
        autocomplete="name"
        placeholder="e.g. Meri Sanikidze"
        :error="error('fullName')"
        :valid="isValid('fullName')"
        @blur="validate('fullName')"
      />
      <div class="grid gap-5 sm:grid-cols-2">
        <FormInput
          v-model="values.email"
          label="Email"
          type="email"
          autocomplete="email"
          placeholder="e.g. example@gmail.com"
          :error="error('email')"
          :valid="isValid('email')"
          @blur="validate('email')"
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
      </div>

      <div class="h-px bg-surface-2" />

      <FormInput
        v-model="values.cardNumber"
        label="Card number"
        autocomplete="cc-number"
        placeholder="e.g. 1234 4567 8901 2345"
        :error="error('cardNumber')"
        :valid="isValid('cardNumber')"
        @blur="validate('cardNumber')"
      />
      <div class="grid gap-5 sm:grid-cols-2">
        <FormInput
          v-model="values.expiry"
          label="Expiry"
          autocomplete="cc-exp"
          placeholder="e.g. 12/34"
          :error="error('expiry')"
          :valid="isValid('expiry')"
          @blur="validate('expiry')"
        />
        <FormInput
          v-model="values.cvv"
          label="CVV"
          autocomplete="cc-csc"
          placeholder="e.g. 123"
          :error="error('cvv')"
          :valid="isValid('cvv')"
          @blur="validate('cvv')"
        />
      </div>

      <p
        v-if="formError"
        role="alert"
        class="rounded-xl bg-tint-red px-4 py-3 text-xs font-semibold leading-[1.3] text-accent"
      >
        {{ formError }}
      </p>
    </form>

    <aside
      v-if="booking.hold && booking.target"
      class="flex min-h-[320px] flex-col gap-4 border-t border-surface-2 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
    >
      <h3 class="text-sm font-extrabold leading-[normal]">Summary</h3>

      <div class="flex flex-col gap-3 rounded-xl bg-surface p-4">
        <div class="flex flex-col gap-1.5">
          <p class="text-sm font-extrabold uppercase leading-[normal]">{{ booking.target.movieTitle }}</p>
          <p class="text-xs leading-[1.3] text-muted">
            Hall {{ booking.target.hallName }} · {{ formatShortDate(booking.target.date) }} ·
            {{ booking.target.time }}
          </p>
        </div>
        <div class="h-px bg-surface-2" />
        <dl class="flex flex-col gap-2 text-xs leading-[1.3]">
          <div class="flex justify-between gap-4">
            <dt class="text-muted">Seats</dt>
            <dd class="text-right font-semibold">
              {{ booking.hold.seats.map((seat) => seat.code).join(', ') }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-muted">Tickets</dt>
            <dd class="text-right font-semibold">{{ ticketSummary(booking.hold.seats) }}</dd>
          </div>
        </dl>
      </div>

      <div class="mt-auto flex flex-col gap-4 pt-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase leading-[normal] tracking-[0.06em]">Subtotal</span>
          <span class="text-2xl font-extrabold leading-[normal]">{{ formatMoney(booking.hold.subtotal) }}</span>
        </div>
        <Button type="submit" form="checkout-form" class="w-full" :loading="booking.busy">
          Pay: Complete order
        </Button>
        <button
          type="button"
          :disabled="booking.busy"
          class="text-xs font-semibold text-muted transition-colors hover:text-white disabled:opacity-50"
          @click="booking.backToSeats()"
        >
          Back to seats
        </button>
      </div>
    </aside>
  </div>
</template>