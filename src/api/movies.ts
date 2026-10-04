import { http } from '@/api/client'
import type { ApiResponse, Movie, MovieDetail, VenueSessions } from '@/types/api'

export type FeaturedMovie = Movie & Partial<Pick<MovieDetail, 'synopsis'>>

interface ListOptions {
  limit?: number
  signal?: AbortSignal
}

export async function fetchFeatured(signal?: AbortSignal) {
  const res = await http.get<ApiResponse<FeaturedMovie[]>>('/movies/featured', { signal })
  return res.data
}

export async function fetchNowPlaying({ limit, signal }: ListOptions = {}) {
  const res = await http.get<ApiResponse<Movie[]>>('/movies/now-playing', {
    query: { limit },
    signal,
  })
  return res.data
}

export async function fetchComingSoon({ limit, signal }: ListOptions = {}) {
  const res = await http.get<ApiResponse<Movie[]>>('/movies/coming-soon', {
    query: { limit },
    signal,
  })
  return res.data
}

export async function notifyMovie(key: string) {
  const res = await http.post<ApiResponse<{ movieId: number; subscribed: boolean }>>(
    `/movies/${key}/notify`,
  )
  return res.data
}

export async function fetchMovie(key: string, signal?: AbortSignal) {
  const res = await http.get<ApiResponse<MovieDetail>>(`/movies/${key}`, { signal })
  return res.data
}

export async function fetchMovieSessions(key: string, dates: string[], signal?: AbortSignal) {
  const entries = await Promise.all(
    dates.map(async (date) => {
      const res = await http.get<ApiResponse<VenueSessions[]>>(`/movies/${key}/sessions`, {
        query: { date },
        signal,
      })
      return [date, res.data] as const
    }),
  )
  return Object.fromEntries(entries) as Record<string, VenueSessions[]>
}