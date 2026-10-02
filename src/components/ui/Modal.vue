<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    panelClass?: string
    closable?: boolean
  }>(),
  { closable: true, panelClass: 'max-w-md' },
)

const open = defineModel<boolean>({ required: true })

const panel = ref<HTMLElement | null>(null)
const titleId = useId()
let previouslyFocused: HTMLElement | null = null

function close() {
  if (props.closable) open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

function cleanup() {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
}

watch(
  open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement | null
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeydown)
      await nextTick()
      panel.value?.focus()
    } else {
      cleanup()
      previouslyFocused?.focus()
    }
  },
  { immediate: true },
)

onBeforeUnmount(cleanup)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md">
        <div
          class="flex min-h-full items-center justify-center p-4"
          @mousedown.self="close"
        >
          <div
            ref="panel"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? titleId : undefined"
            tabindex="-1"
            class="relative w-full rounded-[28px] border border-surface-2 bg-bg p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] outline-none"
            :class="panelClass"
          >
            <button
              v-if="closable"
              type="button"
              aria-label="Close"
              class="absolute right-8 top-8 text-white transition-opacity hover:opacity-70"
              @click="close"
            >
              <X class="size-6" />
            </button>

            <slot name="header">
              <header v-if="title" class="pr-10">
                <h2 :id="titleId" class="text-xl font-extrabold leading-none">{{ title }}</h2>
                <p v-if="description" class="mt-2 text-xs leading-[1.3] text-muted">{{ description }}</p>
              </header>
            </slot>

            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active [role='dialog'],
.modal-leave-active [role='dialog'] {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from [role='dialog'],
.modal-leave-to [role='dialog'] {
  transform: scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .modal-enter-active,
  .modal-leave-active,
  .modal-enter-active [role='dialog'],
  .modal-leave-active [role='dialog'] {
    transition: none;
  }
}
</style>