import { http } from '@/api/client'
import type { ApiResponse, Order, SeatHold, SeatMap } from '@/types/api'

export interface HoldSeatInput {
  seatId: number
  ticketType: string
}

export interface OrderPayload {
  holdId: string
  fullName: string
  email: string
  mobileNumber: string
  cardNumber: string
  expiry: string
  cvv: string
}

export async function fetchSeatMap(sessionId: number, signal?: AbortSignal) {
  const res = await http.get<ApiResponse<SeatMap>>(`/sessions/${sessionId}/seats`, { signal })
  return res.data
}

export async function createHold(sessionId: number, seats: HoldSeatInput[]) {
  const res = await http.post<ApiResponse<SeatHold>>(`/sessions/${sessionId}/holds`, { seats })
  return res.data
}

export function releaseHold(holdId: string) {
  return http.delete<void>(`/holds/${holdId}`)
}

export async function createOrder(payload: OrderPayload) {
  const res = await http.post<ApiResponse<Order>>('/orders', payload)
  return res.data
}