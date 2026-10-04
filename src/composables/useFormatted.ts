import { watch } from 'vue'

export function useFormatted(
  read: () => string,
  write: (value: string) => void,
  format: (value: string) => string,
) {
  watch(read, (value) => {
    const next = format(value)
    if (next !== value) write(next)
  })
}