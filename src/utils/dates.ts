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

export function formatLongDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatShortDate(iso: string) {
  const date = new Date(iso)
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })
  const month = date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  return `${weekday} ${date.getUTCDate()} ${month}`
}

export function formatWeekdayDate(iso: string) {
  const date = new Date(iso)
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' })
  const month = date.toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' })
  return `${weekday} ${date.getUTCDate()} ${month}`
}

export function refundCutoffLabel(date: string, time: string, hours = 2) {
  const cutoff = new Date(new Date(`${date}T${time}:00Z`).getTime() - hours * 60 * 60 * 1000)
  const clock = cutoff.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
  const weekday = cutoff.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })
  const month = cutoff.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  return `${clock}, ${weekday} ${cutoff.getUTCDate()} ${month}`
}