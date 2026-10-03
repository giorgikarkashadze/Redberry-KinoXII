import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Movie } from '@/types/api'

export type RecentMovie = Pick<
  Movie,
  'id' | 'slug' | 'title' | 'posterUrl' | 'backdropUrl' | 'runtimeMinutes' | 'genres' | 'ageRating'
>

const STORAGE_KEY = 'kinoxii_recently_viewed'
const MAX_ITEMS = 4

function readStored(): RecentMovie[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as RecentMovie[]) : []
  } catch {
    return []
  }
}

export const useRecentlyViewedStore = defineStore('recentlyViewed', () => {
  const items = ref<RecentMovie[]>(readStored())

  function add(movie: Movie) {
    const entry: RecentMovie = {
      id: movie.id,
      slug: movie.slug,
      title: movie.title,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      runtimeMinutes: movie.runtimeMinutes,
      genres: movie.genres,
      ageRating: movie.ageRating,
    }
    items.value = [entry, ...items.value.filter((item) => item.id !== movie.id)].slice(0, MAX_ITEMS)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch {
      return
    }
  }

  return { items, add }
})