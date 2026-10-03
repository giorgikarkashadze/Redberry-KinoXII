import { http } from '@/api/client'
import type { ApiResponse, Movie, MovieDetail } from '@/types/api'

export type FeaturedMovie = Movie & Partial<Pick<MovieDetail, 'synopsis'>>

export async function fetchFeatured(signal?: AbortSignal) {
  const res = await http.get<ApiResponse<FeaturedMovie[]>>('/movies/featured', { signal })
  return res.data
}

export async function fetchNowPlaying(signal?: AbortSignal) {
  const res = await http.get<ApiResponse<Movie[]>>('/movies/now-playing', { signal })
  return res.data
}

export async function fetchComingSoon(signal?: AbortSignal) {
  const res = await http.get<ApiResponse<Movie[]>>('/movies/coming-soon', { signal })
  return res.data
}