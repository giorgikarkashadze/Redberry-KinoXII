export type Rule<T = Record<string, string>> = (value: string, values: T) => string | null

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const withoutSpaces = (value: string) => value.replace(/\s+/g, '')

export const required =
  (label: string): Rule =>
  (value) =>
    value.trim() ? null : `${label} is required`

export const minLength =
  (min: number): Rule =>
  (value) =>
    value.length >= min ? null : `At least ${min} characters`

export const email = (): Rule => (value) =>
  EMAIL_PATTERN.test(value.trim()) ? null : 'Enter a valid email address'

export const matches =
  (otherField: string, message = 'Passwords do not match'): Rule =>
  (value, values) =>
    value === values[otherField] ? null : message

  export const georgianMobile = (): Rule => (value) => {
  const digits = withoutSpaces(value)
  if (!/^\d{9}$/.test(digits)) return 'Mobile number must be 9 digits'
  return digits.startsWith('5') ? null : 'Georgian mobile numbers must start with 5'
}

export const cardNumber = (): Rule => (value) =>
  /^\d{16}$/.test(withoutSpaces(value)) ? null : 'Card number must be 16 digits'

export const cvv = (): Rule => (value) => (/^\d{3}$/.test(value) ? null : 'CVV must be 3 digits')

export const futureExpiry = (): Rule => (value) => {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value)
  if (!match) return 'Use MM/YY format'
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  return new Date(year, month, 1) > new Date() ? null : 'Card has expired'
}