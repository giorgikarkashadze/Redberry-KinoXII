export type Rule<T = Record<string, string>> = (value: string, values: T) => string | null

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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