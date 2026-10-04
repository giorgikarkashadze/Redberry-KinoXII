import type { Movie } from '@/types/api'

export function movieKey(movie: Pick<Movie, 'slug'>) {
  return movie.slug
}

export function genreAndRuntime(movie: Pick<Movie, 'genres' | 'runtimeMinutes'>) {
  const genre = movie.genres[0]?.name
  return genre ? `${genre} · ${movie.runtimeMinutes} min` : `${movie.runtimeMinutes} min`
}

export function formatPrice(value: number) {
  return `₾ ${value}`
}

export function releaseDayLabel(releaseDate: string) {
  const date = new Date(releaseDate)
  if (Number.isNaN(date.getTime())) return ''
  const month = date.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' }).toUpperCase()
  return `${date.getUTCDate()} ${month}`
}

export function formatMoney(value: number) {
  return `₾${Number(value.toFixed(2))}`
}