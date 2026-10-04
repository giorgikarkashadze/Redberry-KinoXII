import { http } from '@/api/client'
import type { ApiResponse, FilterOptions, SessionGroup, SessionsMeta } from '@/types/api'

export interface SessionsQuery {
  date?: string
  venues?: string[]
  formats?: string[]
  languages?: string[]
  bands?: string[]
  sort?: string
  page?: number
  search?: string
}

export interface SessionsResult {
  groups: SessionGroup[]
  meta: SessionsMeta
}

export async function fetchFilterOptions(signal?: AbortSignal) {
  const res = await http.get<ApiResponse<FilterOptions>>('/filter-options', { signal })
  return res.data
}

export async function fetchSessions(query: SessionsQuery, signal?: AbortSignal): Promise<SessionsResult> {
  const res = await http.get<{ data: SessionGroup[]; meta: SessionsMeta }>('/sessions', {
    query: { ...query },
    signal,
  })
  return { groups: res.data, meta: res.meta }
}