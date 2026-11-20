import { getCurrentInstance, inject, readonly, shallowRef, type InjectionKey, type Ref } from 'vue'
import { isClient, type ColorRole } from './theme'

export type ToastColor = Extract<ColorRole, 'success' | 'danger' | 'warning' | 'info' | 'neutral'>
export type ToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface ToastAction {
  label: string
  onClick: (toast: Toast) => void
}

export interface ToastOptions {
  id?: string
  title?: string
  description?: string
  color?: ToastColor
  /** ms; 0 keeps the toast until dismissed. */
  duration?: number
  closable?: boolean
  action?: ToastAction
  onClose?: () => void
}

export interface Toast {
  id: string
  title?: string
  description?: string
  color: ToastColor
  duration: number
  closable: boolean
  action?: ToastAction
  onClose?: () => void
  createdAt: number
}

export interface ToastStoreOptions {
  max?: number
  duration?: number
  position?: ToastPosition
}

export interface PromiseMessages<T> {
  loading: string
  success: string | ((value: T) => string)
  error: string | ((error: unknown) => string)
}

let uid = 0
const nextId = (prefix = 'v') => `${prefix}-${(uid += 1)}`

export function createToastStore(options: ToastStoreOptions = {}) {
  const { max = 5, duration: defaultDuration = 5000, position = 'bottom-right' } = options
  const toasts = shallowRef<Toast[]>([])
  const timers = new Map<
    string,
    { handle?: ReturnType<typeof setTimeout>; remaining: number; startedAt: number }
  >()

  const clearTimer = (id: string) => {
    const t = timers.get(id)
    if (t?.handle) clearTimeout(t.handle)
    timers.delete(id)
  }
  const startTimer = (id: string, ms: number) => {
    clearTimer(id)
    if (!isClient || ms <= 0) return
    timers.set(id, {
      handle: setTimeout(() => dismiss(id), ms),
      remaining: ms,
      startedAt: Date.now(),
    })
  }

  function dismiss(id: string) {
    const toast = toasts.value.find((t) => t.id === id)
    if (!toast) return
    clearTimer(id)
    toasts.value = toasts.value.filter((t) => t.id !== id)
    toast.onClose?.()
  }

  function show(input: ToastOptions | string): string {
    const o = typeof input === 'string' ? { description: input } : input
    const id = o.id ?? nextId('toast')
    const toast: Toast = {
      id,
      title: o.title,
      description: o.description,
      color: o.color ?? 'neutral',
      duration: o.duration ?? defaultDuration,
      closable: o.closable ?? true,
      action: o.action,
      onClose: o.onClose,
      createdAt: Date.now(),
    }
    let list = toasts.value.some((t) => t.id === id)
      ? toasts.value.map((t) => (t.id === id ? toast : t))
      : [...toasts.value, toast]
    while (list.length > max) {
      const [first, ...rest] = list
      if (first) clearTimer(first.id)
      list = rest
    }
    toasts.value = list
    startTimer(id, toast.duration)
    return id
  }

  const shortcut =
    (color: ToastColor) =>
    (description: string, opts: Omit<ToastOptions, 'description' | 'color'> = {}) =>
      show({ ...opts, description, color })

  function update(id: string, patch: Partial<Omit<Toast, 'id'>>) {
    let durationChanged = false
    toasts.value = toasts.value.map((t) => {
      if (t.id !== id) return t
      durationChanged = patch.duration !== undefined && patch.duration !== t.duration
      return { ...t, ...patch, id }
    })
    const t = toasts.value.find((x) => x.id === id)
    if (t && durationChanged) startTimer(id, t.duration)
  }

  function pause(id: string) {
    const t = timers.get(id)
    if (t?.handle) {
      clearTimeout(t.handle)
      t.handle = undefined
      t.remaining -= Date.now() - t.startedAt
    }
  }

  function resume(id: string) {
    const t = timers.get(id)
    if (t && !t.handle) startTimer(id, Math.max(t.remaining, 1000))
  }

  async function promise<T>(p: Promise<T>, messages: PromiseMessages<T>): Promise<T> {
    const id = show({ description: messages.loading, duration: 0, closable: false })
    try {
      const value = await p
      const text =
        typeof messages.success === 'function' ? messages.success(value) : messages.success
      update(id, { description: text, color: 'success', closable: true, duration: defaultDuration })
      return value
    } catch (err) {
      const text = typeof messages.error === 'function' ? messages.error(err) : messages.error
      update(id, { description: text, color: 'danger', closable: true, duration: defaultDuration })
      throw err
    }
  }

  return {
    toasts: readonly(toasts) as Readonly<Ref<readonly Toast[]>>,
    position,
    show,
    success: shortcut('success'),
    error: shortcut('danger'),
    warning: shortcut('warning'),
    info: shortcut('info'),
    update,
    dismiss,
    clear: () => {
      for (const t of [...toasts.value]) dismiss(t.id)
    },
    pause,
    resume,
    promise,
  }
}
export type ToastStore = ReturnType<typeof createToastStore>

export const TOAST_KEY: InjectionKey<ToastStore> = Symbol('violet-ui:toast')

let fallback: ToastStore | undefined
export function useToast(): ToastStore {
  const injected = getCurrentInstance() ? inject(TOAST_KEY, null) : null
  if (injected) return injected
  if (!isClient) return createToastStore()
  return (fallback ??= createToastStore())
}
