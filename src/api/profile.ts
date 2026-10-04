import { http } from '@/api/client'
import type { ApiResponse, User } from '@/types/api'

export interface ProfilePayload {
  fullName: string
  mobileNumber: string
  dateOfBirth: string
  preferredVenueId?: number | null
}

export async function updateProfile(payload: ProfilePayload) {
  const form = new FormData()
  form.append('fullName', payload.fullName)
  form.append('mobileNumber', payload.mobileNumber)
  form.append('dateOfBirth', payload.dateOfBirth)
  if (payload.preferredVenueId !== undefined) {
    form.append('preferredVenueId', payload.preferredVenueId === null ? '' : String(payload.preferredVenueId))
  }
  const res = await http.put<ApiResponse<User>>('/profile', form)
  return res.data
}