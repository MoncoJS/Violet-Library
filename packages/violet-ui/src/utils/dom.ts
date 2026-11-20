import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { isClient } from '../theme'

export type Placement =
  'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'right'

/**
 * Minimal floating positioning: places `floating` next to `reference` using
 * fixed coordinates, flips when it would overflow the viewport, and follows
 * scroll/resize while `open` is true.
 */
export function useFloating(
  reference: Ref<HTMLElement | null | undefined>,
  floating: Ref<HTMLElement | null | undefined>,
  options: {
    placement: () => Placement
    open: () => boolean
    offset?: number
    matchWidth?: boolean
  },
) {
  const style = ref<Record<string, string>>({ position: 'fixed', top: '0px', left: '0px' })
  const actualPlacement = ref<Placement>(options.placement())
  const gap = options.offset ?? 6

  function update() {
    const ref_ = reference.value
    const el = floating.value
    if (!ref_ || !el || !isClient) return
    const r = ref_.getBoundingClientRect()
    const f = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let placement = options.placement()
    const [side, align] = placement.split('-') as [string, string | undefined]

    // flip on the main axis
    let finalSide = side
    if (side === 'bottom' && r.bottom + gap + f.height > vh && r.top - gap - f.height > 0)
      finalSide = 'top'
    else if (side === 'top' && r.top - gap - f.height < 0 && r.bottom + gap + f.height < vh)
      finalSide = 'bottom'
    else if (side === 'right' && r.right + gap + f.width > vw) finalSide = 'left'
    else if (side === 'left' && r.left - gap - f.width < 0) finalSide = 'right'
    placement = (align ? `${finalSide}-${align}` : finalSide) as Placement

    let top = 0
    let left = 0
    if (finalSide === 'bottom' || finalSide === 'top') {
      top = finalSide === 'bottom' ? r.bottom + gap : r.top - gap - f.height
      left =
        align === 'start'
          ? r.left
          : align === 'end'
            ? r.right - f.width
            : r.left + r.width / 2 - f.width / 2
    } else {
      left = finalSide === 'right' ? r.right + gap : r.left - gap - f.width
      top = r.top + r.height / 2 - f.height / 2
    }
    // shift into the viewport
    left = Math.max(8, Math.min(left, vw - f.width - 8))
    top = Math.max(8, Math.min(top, vh - f.height - 8))

    actualPlacement.value = placement
    style.value = {
      position: 'fixed',
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      ...(options.matchWidth ? { minWidth: `${Math.round(r.width)}px` } : {}),
    }
  }

  let raf = 0
  const schedule = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(update)
  }
  const listen = (on: boolean) => {
    if (!isClient) return
    const m = on ? 'addEventListener' : 'removeEventListener'
    window[m]('scroll', schedule, true)
    window[m]('resize', schedule)
  }

  watch(
    options.open,
    (open) => {
      listen(false)
      if (open) {
        listen(true)
        // wait for the floating element to render
        requestAnimationFrame(update)
      }
    },
    { flush: 'post' },
  )
  onBeforeUnmount(() => {
    listen(false)
    cancelAnimationFrame(raf)
  })

  return { style, placement: actualPlacement, update }
}

/** Calls `handler` on pointerdown outside every given element. */
export function useClickOutside(
  targets: Ref<HTMLElement | null | undefined>[],
  handler: (e: PointerEvent) => void,
  enabled: () => boolean = () => true,
) {
  const listener = (e: PointerEvent) => {
    if (!enabled()) return
    const path = e.composedPath()
    if (targets.some((t) => t.value && path.includes(t.value))) return
    handler(e)
  }
  onMounted(() => document.addEventListener('pointerdown', listener, true))
  onBeforeUnmount(() => document.removeEventListener('pointerdown', listener, true))
}

const FOCUSABLE =
  'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]'

export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest('[inert],[hidden]') && (el.checkVisibility?.() ?? true),
  )
}

/** Keeps Tab focus inside `root`; returns a keydown handler to attach. */
export function trapTab(root: HTMLElement | null | undefined, e: KeyboardEvent) {
  if (e.key !== 'Tab' || !root) return
  const items = getFocusable(root)
  if (!items.length) {
    e.preventDefault()
    root.focus()
    return
  }
  const first = items[0]!
  const last = items[items.length - 1]!
  const active = document.activeElement
  if (e.shiftKey && (active === first || active === root)) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
  }
}

let lockCount = 0
let savedOverflow = ''
let savedPadding = ''
/** Reference-counted body scroll lock for stacked overlays. */
export function lockScroll(): () => void {
  if (!isClient) return () => {}
  if (lockCount++ === 0) {
    const body = document.body
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    savedOverflow = body.style.overflow
    savedPadding = body.style.paddingRight
    body.style.overflow = 'hidden'
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`
  }
  let released = false
  return () => {
    if (released) return
    released = true
    if (--lockCount === 0) {
      document.body.style.overflow = savedOverflow
      document.body.style.paddingRight = savedPadding
    }
  }
}

/** Stack of open overlays, so Escape closes only the top-most one. */
const overlayStack: symbol[] = []
export function useOverlayStack() {
  const id = Symbol('overlay')
  return {
    push: () => overlayStack.push(id),
    pop: () => {
      const i = overlayStack.indexOf(id)
      if (i >= 0) overlayStack.splice(i, 1)
    },
    isTop: () => overlayStack[overlayStack.length - 1] === id,
  }
}

/** Normalised option used by select-like components. */
export interface SelectOption<V = unknown> {
  label: string
  value: V
  disabled?: boolean
  description?: string
  group?: string
}
export type OptionInput<V = unknown> = SelectOption<V> | string | number

export function normalizeOptions<V>(
  options: readonly OptionInput<V>[],
  labelKey = 'label',
  valueKey = 'value',
): SelectOption<V>[] {
  return options.map((o) => {
    if (typeof o === 'string' || typeof o === 'number') return { label: String(o), value: o as V }
    const rec = o as unknown as Record<string, unknown>
    return {
      ...o,
      label: String(rec[labelKey] ?? ''),
      value: (rec[valueKey] ?? rec.value) as V,
    }
  })
}

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
