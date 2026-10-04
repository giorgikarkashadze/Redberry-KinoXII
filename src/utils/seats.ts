import type { Seat } from '@/types/api'

export function isSelectable(seat: Seat) {
  return seat.state === 'available' || (seat.state === 'held' && seat.isMine)
}