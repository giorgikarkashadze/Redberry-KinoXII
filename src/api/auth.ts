import { http } from '@/api/client'
import type { ApiResponse, AuthPayload, User } from '@/types/api'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  passwordConfirmation: string
  avatar?: File | null
}

export async function login(payload: LoginPayload) {
  const res = await http.post<ApiResponse<AuthPayload>>('/login', payload, { replayOn401: false })
  return res.data
}

export async function register(payload: RegisterPayload) {

  const form = new FormData()
  form.append('username', payload.username)
  form.append('email', payload.email)
  form.append('password', payload.password)
  form.append('password_confirmation', payload.passwordConfirmation)
  if (payload.avatar) form.append('avatar', payload.avatar)

  const res = await http.post<ApiResponse<AuthPayload>>('/register', form, { replayOn401: false })
  return res.data
}

export function logout() {
  return http.post<void>('/logout', undefined, { replayOn401: false })
}

export async function fetchMe() {
  const res = await http.get<ApiResponse<User>>('/me', { replayOn401: false })
  return res.data
}