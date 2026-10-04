import type { ApiErrorBody } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_URL as string

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message)
  }

  get isFieldError() {
    return this.status === 422 && !!this.errors
  }

  get isRuleError() {
    return this.status === 422 && !this.errors
  }
}

type QueryValue = string | number | boolean | null | undefined | string[]
type Query = Record<string, QueryValue>
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface RequestOptions {
  query?: Query
  signal?: AbortSignal
  replayOn401?: boolean
}

let token: string | null = null
let unauthorizedHandler: (() => Promise<void>) | null = null

export function setToken(value: string | null) {
  token = value
}

export function setUnauthorizedHandler(handler: (() => Promise<void>) | null) {
  unauthorizedHandler = handler
}

function buildUrl(path: string, query?: Query) {
  const url = new URL(BASE_URL + path)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(`${key}[]`, item)
    } else if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

async function request<T>(
  path: string,
  method: Method,
  body?: unknown,
  options: RequestOptions = {},
  isReplay = false,
): Promise<T> {
  const { query, signal, replayOn401 = true } = options

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  let payload: BodyInit | undefined
  if (body instanceof FormData) {
    payload = body
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path, query), { method, headers, body: payload, signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'Network error. Please check your connection and try again.')
  }

  if (response.ok) {
    const text = await response.text()
    return (text ? JSON.parse(text) : undefined) as T
  }

  const errorBody = (await response.json().catch(() => null)) as Partial<ApiErrorBody> | null
  const error = new ApiError(
    response.status,
    errorBody?.message ?? 'Something went wrong. Please try again.',
    errorBody?.errors,
  )

  if (response.status === 401 && replayOn401 && !isReplay && unauthorizedHandler) {
    try {
      await unauthorizedHandler()
    } catch {
      throw error
    }
    return request<T>(path, method, body, options, true)
  }

  throw error
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, 'GET', undefined, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, 'POST', body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, 'PUT', body, options),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, 'DELETE', undefined, options),
}