import {
  getCurrentInstance,
  inject,
  type App,
  type Component,
  type Plugin,
} from 'vue'
import './style.css'
import _VButton from './components/VButton.vue'
import _VButtonGroup from './components/VButtonGroup.vue'
import _VIconButton from './components/VIconButton.vue'
import _VInput from './components/VInput.vue'
import _VSpinner from './components/VSpinner.vue'
import _VToast from './components/VToast.vue'
import _VToaster from './components/VToaster.vue'
import {
  createThemeManager,
  isClient,
  type ThemeManager,
  type ThemeManagerOptions,
} from './theme'
import { createToastStore, TOAST_KEY, type ToastStore, type ToastStoreOptions } from './toast'

export * from './theme'
export * from './form'
export * from './toast'
export * from './icons'
export type { ButtonProps, ButtonVariant } from './components/context'

// ---------------------------------------------------------------- components

type WithInstall<T> = T & Plugin
export function withInstall<T extends Component>(main: T, ...extra: Component[]): WithInstall<T> {
  const c = main as WithInstall<T>
  c.install = (app: App) => {
    for (const comp of [main, ...extra]) {
      const name = (comp as { name?: string }).name
      if (name) app.component(name, comp)
    }
  }
  return c
}

export const VButton = /* @__PURE__ */ withInstall(_VButton)
export const VIconButton = /* @__PURE__ */ withInstall(_VIconButton)
export const VButtonGroup = /* @__PURE__ */ withInstall(_VButtonGroup)
export const VSpinner = /* @__PURE__ */ withInstall(_VSpinner)
export const VInput = /* @__PURE__ */ withInstall(_VInput)
export const VToast = /* @__PURE__ */ withInstall(_VToast)
export const VToaster = /* @__PURE__ */ withInstall(_VToaster)

// ---------------------------------------------------------------- useTheme

export const THEME_KEY = Symbol('violet-ui:theme') as import('vue').InjectionKey<ThemeManager>

let fallbackTheme: ThemeManager | undefined
export function useTheme(): ThemeManager {
  const injected = getCurrentInstance() ? inject(THEME_KEY, null) : null
  if (injected) return injected
  if (!isClient) return createThemeManager({ storageKey: false })
  if (!fallbackTheme) {
    fallbackTheme = createThemeManager()
    fallbackTheme.mount()
  }
  return fallbackTheme
}

// ---------------------------------------------------------------- plugin

export interface VioletUIOptions {
  theme?: ThemeManagerOptions
  toast?: ToastStoreOptions
  /** Components to register globally, e.g. `{ VButton, VInput }`. */
  components?: Record<string, Component>
}

export interface VioletUI {
  theme: ThemeManager
  toast: ToastStore
  install: (app: App) => void
}

export function createVioletUI(options: VioletUIOptions = {}): VioletUI {
  const theme = createThemeManager(options.theme)
  const toast = createToastStore(options.toast)
  return {
    theme,
    toast,
    install(app) {
      app.provide(THEME_KEY, theme)
      app.provide(TOAST_KEY, toast)
      for (const [name, comp] of Object.entries(options.components ?? {})) app.component(name, comp)
      if (isClient) {
        const unmountTheme = theme.mount()
        const unmount = app.unmount.bind(app)
        app.unmount = () => {
          unmountTheme()
          unmount()
        }
      }
    },
  }
}
