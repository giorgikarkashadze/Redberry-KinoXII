import { http } from '@/api/client'
import type { ApiResponse, Order } from '@/types/api'

export type TicketFilter = 'upcoming' | 'past'

export interface TicketLists {
  upcoming: Order[]
  past: Order[]
}

async function fetchTickets(filter: TicketFilter, signal?: AbortSignal) {
  const res = await http.get<ApiResponse<Order[]>>('/tickets', { query: { filter }, signal })
  return res.data
}

export async function fetchAllTickets(signal?: AbortSignal): Promise<TicketLists> {
  const [upcoming, past] = await Promise.all([
    fetchTickets('upcoming', signal),
    fetchTickets('past', signal),
  ])
  return { upcoming, past }
}

export async function refundOrder(reference: string) {
  const res = await http.post<ApiResponse<Order>>(`/orders/${reference}/refund`)
  return res.data
}