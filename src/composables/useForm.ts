import { computed, reactive, ref, watch } from 'vue'
import { ApiError } from '@/api/client'
import type { Rule } from '@/utils/validators'

type Rules<T> = { [K in keyof T]?: Rule<T>[] }

const toCamelCase = (key: string) =>
  key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase())

export function useForm<T extends Record<string, string>>(initial: T, rules: Rules<T>) {
  type Name = keyof T & string
  const names = Object.keys(initial) as Name[]

  const values = reactive({ ...initial }) as unknown as T
  const touched = reactive<Record<string, boolean>>({})
  const clientErrors = reactive<Record<string, string | null>>({})
  const serverErrors = reactive<Record<string, string | null>>({})
  const formError = ref<string | null>(null)
  const valueOf = (name: Name) => values[name] ?? ''

  function runRules(name: Name) {
    for (const rule of rules[name] ?? []) {
      const message = rule(valueOf(name), values)
      if (message) {
        clientErrors[name] = message
        return false
      }
    }
    clientErrors[name] = null
    return true
  }

  function validate(name: Name) {
    touched[name] = true
    return runRules(name)
  }

  function validateAll() {
    let ok = true
    for (const name of names) {
      if (!validate(name)) ok = false
    }
    return ok
  }

  const error = (name: Name) => serverErrors[name] ?? clientErrors[name] ?? null
  const isValid = (name: Name) => !!touched[name] && !error(name) && valueOf(name) !== ''
  const filled = computed(() => names.every((name) => valueOf(name).trim() !== ''))

  watch(
    () => ({ ...values }),
    (now, before) => {
      formError.value = null
      for (const name of names) {
        if (now[name] !== before[name]) serverErrors[name] = null
        if (touched[name]) runRules(name)
      }
    },
  )

  function applyApiError(failure: unknown, handledElsewhere: string[] = []) {
    if (!(failure instanceof ApiError)) {
      formError.value = 'Something went wrong. Please try again.'
      return
    }
    if (!failure.isFieldError) {
      formError.value = failure.message
      return
    }
    let leftover: string | null = null
    for (const [key, messages] of Object.entries(failure.errors ?? {})) {
      const name = toCamelCase(key)
      if (names.includes(name as Name)) {
        serverErrors[name] = messages[0] ?? null
        touched[name] = true
      } else if (!handledElsewhere.includes(key)) {
        leftover ??= messages[0] ?? null
      }
    }
    formError.value = leftover
  }

  function reset() {
    Object.assign(values, initial)
    for (const name of names) {
      touched[name] = false
      clientErrors[name] = null
      serverErrors[name] = null
    }
    formError.value = null
  }

  return { values, filled, formError, error, isValid, validate, validateAll, applyApiError, reset }
}