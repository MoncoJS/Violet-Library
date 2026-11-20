import { nextTick, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import { isClient } from '../../theme'
import { getFocusable, lockScroll, trapTab, useOverlayStack } from '../../utils/dom'

export interface ModalBehaviorOptions {
  open: () => boolean
  close: (reason: 'escape' | 'backdrop' | 'close') => void
  closeOnEsc: () => boolean
  closeOnBackdrop: () => boolean
  lockScroll?: () => boolean
  /** Element (or selector inside the panel) to focus first. */
  initialFocus?: () => string | undefined
}

/**
 * Shared modal mechanics: focus trap + restore, Escape for the top-most
 * overlay only, body scroll lock, backdrop click detection.
 */
export function useModalBehavior(panel: Ref<HTMLElement | null>, o: ModalBehaviorOptions) {
  const stack = useOverlayStack()
  const visible = ref(false)
  let restoreTo: HTMLElement | null = null
  let unlock: (() => void) | undefined

  function onKeydown(e: KeyboardEvent) {
    if (!stack.isTop()) return
    if (e.key === 'Escape' && o.closeOnEsc()) {
      e.stopPropagation()
      o.close('escape')
    } else trapTab(panel.value, e)
  }

  let downOnBackdrop = false
  const onBackdropDown = (e: PointerEvent) => (downOnBackdrop = e.target === e.currentTarget)
  const onBackdropClick = (e: MouseEvent) => {
    if (downOnBackdrop && e.target === e.currentTarget && o.closeOnBackdrop()) o.close('backdrop')
    downOnBackdrop = false
  }

  watch(
    o.open,
    async (open) => {
      if (!isClient) return
      if (open) {
        visible.value = true
        restoreTo = document.activeElement as HTMLElement | null
        stack.push()
        if (o.lockScroll?.() ?? true) unlock = lockScroll()
        document.addEventListener('keydown', onKeydown, true)
        await nextTick()
        const sel = o.initialFocus?.()
        const target =
          (sel && panel.value?.querySelector<HTMLElement>(sel)) ||
          panel.value?.querySelector<HTMLElement>('[autofocus]') ||
          (panel.value &&
            getFocusable(panel.value).find((el) => !el.classList.contains('v-modal__close'))) ||
          panel.value
        target?.focus({ preventScroll: true })
      } else teardown(true)
    },
    { immediate: true },
  )

  function teardown(restore: boolean) {
    stack.pop()
    unlock?.()
    unlock = undefined
    if (isClient) document.removeEventListener('keydown', onKeydown, true)
    if (restore && restoreTo?.isConnected) restoreTo.focus({ preventScroll: true })
    restoreTo = null
  }
  onBeforeUnmount(() => teardown(false))

  return { visible, onBackdropDown, onBackdropClick, afterLeave: () => (visible.value = false) }
}
