import { onBeforeUnmount, onMounted, type Ref } from 'vue'

export function useDismissable(root: Ref<HTMLElement | null>, isOpen: Ref<boolean>) {
  function onPointerDown(event: PointerEvent) {
    if (isOpen.value && root.value && !root.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') isOpen.value = false
  }

  onMounted(() => {
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeydown)
  })
}