import { computed } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import type { SessionsQuery } from '@/api/sessions'
import { useFilterOptionsStore } from '@/stores/filterOptions'

export type FilterGroup = 'venues' | 'formats' | 'languages' | 'bands'

export interface SessionFilters {
  venues: string[]
  formats: string[]
  languages: string[]
  bands: string[]
  date: string | null
  sort: string | null
  page: number
}

const GROUPS: FilterGroup[] = ['venues', 'formats', 'languages', 'bands']

function readList(value: unknown): string[] {
  const items = Array.isArray(value) ? value : value == null ? [] : [value]
  return items.filter((item): item is string => typeof item === 'string' && item !== '')
}

function readString(value: unknown): string | null {
  const first = Array.isArray(value) ? value[0] : value
  return typeof first === 'string' && first !== '' ? first : null
}

function toQuery(next: SessionFilters): LocationQueryRaw {
  return {
    'venues[]': next.venues.length ? next.venues : undefined,
    'formats[]': next.formats.length ? next.formats : undefined,
    'languages[]': next.languages.length ? next.languages : undefined,
    'bands[]': next.bands.length ? next.bands : undefined,
    date: next.date ?? undefined,
    sort: next.sort ?? undefined,
    page: next.page > 1 ? String(next.page) : undefined,
  }
}

export function useSessionFilters() {
  const route = useRoute()
  const router = useRouter()
  const filterOptions = useFilterOptionsStore()

  const filters = computed<SessionFilters>(() => {
    const query = route.query
    const page = Number.parseInt(readString(query.page) ?? '1', 10)
    return {
      venues: readList(query['venues[]']),
      formats: readList(query['formats[]']),
      languages: readList(query['languages[]']),
      bands: readList(query['bands[]']),
      date: readString(query.date),
      sort: readString(query.sort),
      page: Number.isFinite(page) && page > 0 ? page : 1,
    }
  })

  function formatsOfVenues(venues: string[]) {
    const options = filterOptions.options
    if (!options || !venues.length) return null
    return new Set(
      options.venues
        .filter((venue) => venues.includes(venue.slug))
        .flatMap((venue) => venue.formats.map((format) => format.slug)),
    )
  }

  const availableFormats = computed(() => {
    const options = filterOptions.options
    if (!options) return []
    const allowed = formatsOfVenues(filters.value.venues)
    return allowed ? options.formats.filter((format) => allowed.has(format.slug)) : options.formats
  })

  const activeCount = computed(
    () => GROUPS.filter((group) => filters.value[group].length > 0).length,
  )

  const apiQuery = computed<SessionsQuery>(() => ({
    date: filters.value.date ?? undefined,
    venues: filters.value.venues,
    formats: filters.value.formats,
    languages: filters.value.languages,
    bands: filters.value.bands,
    sort: filters.value.sort ?? undefined,
    page: filters.value.page,
  }))

  function update(patch: Partial<SessionFilters>) {
    const next: SessionFilters = { ...filters.value, ...patch }
    if (!('page' in patch)) next.page = 1
    if ('venues' in patch) {
      const allowed = formatsOfVenues(next.venues)
      if (allowed) next.formats = next.formats.filter((slug) => allowed.has(slug))
    }
    router.push({ name: 'sessions', query: { ...route.query, ...toQuery(next) } })
  }

  function toggle(group: FilterGroup, slug: string) {
    const current = filters.value[group]
    const list = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    update({ [group]: list } as Partial<SessionFilters>)
  }

  function clear() {
    update({ venues: [], formats: [], languages: [], bands: [] })
  }

  return { filters, availableFormats, activeCount, apiQuery, update, toggle, clear }
}