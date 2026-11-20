import { getCurrentInstance, inject, type App, type Component, type InjectionKey } from 'vue'
import './styles/tokens.css'
import './style.css'
import './styles/forms.css'
import './styles/date-upload.css'
import './styles/feedback-overlay.css'
import './styles/nav-display.css'
import './styles/table.css'
import './styles/roles.css'
import { createThemeManager, isClient, type ThemeManager, type ThemeManagerOptions } from './theme'
import { createToastStore, TOAST_KEY, type ToastStore, type ToastStoreOptions } from './toast'

export * from './theme'
export * from './form'
export * from './toast'
export * from './icons'
export * from './components'
export type { ButtonProps, ButtonVariant } from './components/context'
export * from './utils/date'
export type { UploadItem } from './components/upload/VUpload.vue'
export type { DateRange, DateRangePreset } from './components/date/VDateRangePicker.vue'
export type {
  DataTableColumn,
  DataTableQuery,
  SortState,
  SortDirection,
} from './components/table/types'
export { toCSV, downloadCSV } from './components/table/csv'
export type { TabItem } from './components/navigation/VTabs.vue'
export type { MenuItem } from './components/navigation/VMenu.vue'
export type { BreadcrumbItem } from './components/navigation/VBreadcrumb.vue'
export type { ListItem } from './components/display/VList.vue'
export type { AccordionItem } from './components/display/VAccordion.vue'
export type { TimelineItem } from './components/display/VTimeline.vue'
export type { OptionInput, Placement, SelectOption } from './utils/dom'

// ---------------------------------------------------------------- useTheme

export const THEME_KEY: InjectionKey<ThemeManager> = Symbol('violet-ui:theme')

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
