import { onBeforeUnmount, ref, watch, type Ref } from 'vue'

const DRAG_THRESHOLD = 5

export function useDragScroll(target: Ref<HTMLElement | null>) {
  const dragging = ref(false)
  let pointerId: number | null = null
  let startX = 0
  let startScroll = 0
  let moved = false

  function onPointerDown(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const element = target.value
    if (!element) return
    pointerId = event.pointerId
    startX = event.clientX
    startScroll = element.scrollLeft
    moved = false
  }

  function onPointerMove(event: PointerEvent) {
    const element = target.value
    if (!element || pointerId !== event.pointerId) return
    const delta = event.clientX - startX
    if (!moved && Math.abs(delta) < DRAG_THRESHOLD) return
    if (!moved) {
      moved = true
      dragging.value = true
      element.setPointerCapture(event.pointerId)
    }
    element.scrollLeft = startScroll - delta
  }

  function onPointerEnd(event: PointerEvent) {
    if (pointerId !== event.pointerId) return
    pointerId = null
    dragging.value = false
    const element = target.value
    if (element?.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId)
    window.setTimeout(() => {
      moved = false
    }, 0)
  }

  function onClickCapture(event: MouseEvent) {
    if (!moved) return
    event.preventDefault()
    event.stopPropagation()
  }

  function onDragStart(event: DragEvent) {
    event.preventDefault()
  }

  function attach(element: HTMLElement) {
    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', onPointerEnd)
    element.addEventListener('pointercancel', onPointerEnd)
    element.addEventListener('click', onClickCapture, true)
    element.addEventListener('dragstart', onDragStart)
  }

  function detach(element: HTMLElement) {
    element.removeEventListener('pointerdown', onPointerDown)
    element.removeEventListener('pointermove', onPointerMove)
    element.removeEventListener('pointerup', onPointerEnd)
    element.removeEventListener('pointercancel', onPointerEnd)
    element.removeEventListener('click', onClickCapture, true)
    element.removeEventListener('dragstart', onDragStart)
  }

  watch(
    target,
    (element, previous) => {
      if (previous) detach(previous)
      if (element) attach(element)
    },
    { flush: 'post' },
  )

  onBeforeUnmount(() => {
    if (target.value) detach(target.value)
  })

  return { dragging }
}