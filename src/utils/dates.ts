export interface DayOption {
  iso: string
  weekday: string
  day: number
}

export function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function buildDays(count = 7, from = new Date()): DayOption[] {
  return Array.from({ length: count }, (_, offset) => {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset)
    return {
      iso: toIsoDate(date),
      weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      day: date.getDate(),
    }
  })
}