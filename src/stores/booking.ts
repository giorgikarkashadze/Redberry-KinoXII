import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import {
  createHold,
  createOrder,
  fetchSeatMap,
  releaseHold,
  type OrderPayload,
} from '@/api/booking'
import { ApiError } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { useFilterOptionsStore } from '@/stores/filterOptions'
import type { Order, Seat, SeatHold, SeatMap, SessionSummary } from '@/types/api'
import { isSelectable } from '@/utils/seats'

export interface BookingTarget {
  sessionId: number
  movieTitle: string
  minAge: number
  venueName: string
  hallName: string
  date: string
  time: string
  formatName: string
  languageName: string
  price: number
}

export interface SeatSelection {
  seatId: number
  code: string
  ticketType: string
}

export const EXPIRED_MESSAGE = 'Your hold time expired. Please re-select your seats.'

type Step = 'seats' | 'checkout' | 'confirmation'

export function toBookingTarget(
  session: SessionSummary,
  movie: { title: string; ageRating: { minAge: number } },
): BookingTarget {
  return {
    sessionId: session.id,
    movieTitle: movie.title,
    minAge: movie.ageRating.minAge,
    venueName: session.venue.name,
    hallName: session.hall.name,
    date: session.date,
    time: session.time,
    formatName: session.format.name,
    languageName: session.language.name,
    price: session.price,
  }
}

export const useBookingStore = defineStore('booking', () => {
  const auth = useAuthStore()
  const filterOptions = useFilterOptionsStore()

  const open = ref(false)
  const profileGate = ref(false)
  const target = ref<BookingTarget | null>(null)
  const step = ref<Step>('seats')
  const seatMap = shallowRef<SeatMap | null>(null)
  const seatMapLoading = ref(false)
  const seatMapError = shallowRef<ApiError | null>(null)
  const selection = ref<SeatSelection[]>([])
  const hold = shallowRef<SeatHold | null>(null)
  const holdDeadline = ref(0)
  const notice = ref<string | null>(null)
  const busy = ref(false)
  const order = shallowRef<Order | null>(null)
  const completedCount = ref(0)
  let mapController: AbortController | null = null

  const maxSeats = computed(() => filterOptions.options?.maxSeatsPerOrder ?? 3)

  function defaultTicketType() {
    const types = filterOptions.options?.ticketTypes ?? []
    const preferred =
      types.find((type) => type.slug === 'adult') ?? types.find((type) => type.priceRatio === 1) ?? types[0]
    return preferred?.slug ?? 'adult'
  }

  function priceOf(ticketType: string) {
    const ratio = filterOptions.options?.ticketTypes.find((type) => type.slug === ticketType)?.priceRatio ?? 1
    return (target.value?.price ?? 0) * ratio
  }

  const subtotal = computed(() =>
    selection.value.reduce((sum, item) => sum + priceOf(item.ticketType), 0),
  )

  async function loadSeatMap() {
    const current = target.value
    if (!current) return
    mapController?.abort()
    const controller = (mapController = new AbortController())
    seatMapLoading.value = true
    seatMapError.value = null
    try {
      const map = await fetchSeatMap(current.sessionId, controller.signal)
      if (controller.signal.aborted) return
      seatMap.value = map
      const selectable = new Set(
        map.sections.flatMap((section) =>
          section.rows.flatMap((row) => row.seats.filter(isSelectable).map((seat) => seat.id)),
        ),
      )
      selection.value = selection.value.filter((item) => selectable.has(item.seatId))
    } catch (failure) {
      if (controller.signal.aborted) return
      seatMapError.value =
        failure instanceof ApiError
          ? failure
          : new ApiError(0, 'Something went wrong. Please try again.')
    } finally {
      if (mapController === controller) seatMapLoading.value = false
    }
  }

  async function start(next: BookingTarget) {
    if (!auth.isAuthenticated) {
      try {
        await auth.ensureAuthenticated()
      } catch {
        return
      }
    }
    if (!auth.profileComplete) {
      profileGate.value = true
      return
    }
    target.value = next
    step.value = 'seats'
    selection.value = []
    hold.value = null
    order.value = null
    notice.value = null
    seatMap.value = null
    seatMapError.value = null
    open.value = true
    loadSeatMap()
  }

  function close() {
    const current = hold.value
    if (current && step.value !== 'confirmation') releaseHold(current.holdId).catch(() => undefined)
    hold.value = null
    open.value = false
  }

  function toggleSeat(seat: Seat) {
    if (!isSelectable(seat)) return
    notice.value = null
    if (selection.value.some((item) => item.seatId === seat.id)) {
      selection.value = selection.value.filter((item) => item.seatId !== seat.id)
      return
    }
    if (selection.value.length >= maxSeats.value) {
      notice.value = `You can select up to ${maxSeats.value} seats per order.`
      return
    }
    selection.value = [
      ...selection.value,
      { seatId: seat.id, code: seat.code, ticketType: defaultTicketType() },
    ]
  }

  function removeSeat(seatId: number) {
    notice.value = null
    selection.value = selection.value.filter((item) => item.seatId !== seatId)
  }

  function setTicketType(seatId: number, ticketType: string) {
    selection.value = selection.value.map((item) =>
      item.seatId === seatId ? { ...item, ticketType } : item,
    )
  }

  function applyHold(created: SeatHold) {
    holdDeadline.value = Date.now() + created.secondsRemaining * 1000
    hold.value = created
  }

  function resetToSeats(message: string) {
    selection.value = []
    hold.value = null
    step.value = 'seats'
    notice.value = message
    loadSeatMap()
  }

  function reconcileConflict(failure: ApiError) {
    const lost = failure.contested ?? []
    selection.value = selection.value.filter((item) => !lost.includes(item.code))
    hold.value = null
    step.value = 'seats'
    notice.value = lost.length ? `${failure.message} (${lost.join(', ')})` : failure.message
    loadSeatMap()
  }

  async function submitHold() {
    const current = target.value
    if (busy.value || !current || !selection.value.length) return
    busy.value = true
    notice.value = null
    try {
      const created = await createHold(
        current.sessionId,
        selection.value.map(({ seatId, ticketType }) => ({ seatId, ticketType })),
      )
      applyHold(created)
      step.value = 'checkout'
    } catch (failure) {
      if (!(failure instanceof ApiError)) {
        notice.value = 'Something went wrong. Please try again.'
      } else if (failure.isConflict) {
        reconcileConflict(failure)
      } else if (failure.isFieldError) {
        notice.value = Object.values(failure.errors ?? {}).flat()[0] ?? failure.message
      } else {
        notice.value = failure.message
      }
    } finally {
      busy.value = false
    }
  }

  function backToSeats() {
    notice.value = null
    step.value = 'seats'
  }

  async function pay(payload: Omit<OrderPayload, 'holdId'>) {
    const current = hold.value
    if (busy.value || !current) return
    busy.value = true
    try {
      order.value = await createOrder({ holdId: current.holdId, ...payload })
      hold.value = null
      step.value = 'confirmation'
      completedCount.value += 1
    } catch (failure) {
      if (failure instanceof ApiError && failure.isConflict) {
        reconcileConflict(failure)
        return
      }
      if (failure instanceof ApiError && failure.isRuleError) {
        resetToSeats(failure.message)
        return
      }
      throw failure
    } finally {
      busy.value = false
    }
  }

  function expireHold() {
    if (step.value === 'confirmation' || !hold.value) return
    resetToSeats(EXPIRED_MESSAGE)
  }

  return {
    open,
    profileGate,
    target,
    step,
    seatMap,
    seatMapLoading,
    seatMapError,
    selection,
    hold,
    holdDeadline,
    notice,
    busy,
    order,
    completedCount,
    maxSeats,
    subtotal,
    priceOf,
    loadSeatMap,
    start,
    close,
    toggleSeat,
    removeSeat,
    setTicketType,
    submitHold,
    backToSeats,
    pay,
    expireHold,
  }
})