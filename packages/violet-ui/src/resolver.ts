/** Resolver for `unplugin-vue-components` and preset for `unplugin-auto-import`. */

const components = new Set([
  'VButton',
  'VIconButton',
  'VButtonGroup',
  'VSpinner',
  'VFormField',
  'VInput',
  'VTextarea',
  'VPasswordInput',
  'VNumberInput',
  'VSelect',
  'VMultiSelect',
  'VAutocomplete',
  'VCheckbox',
  'VCheckboxGroup',
  'VRadio',
  'VRadioGroup',
  'VSwitch',
  'VCalendar',
  'VDatePicker',
  'VDateRangePicker',
  'VTimePicker',
  'VUpload',
  'VImageUpload',
  'VToast',
  'VToaster',
  'VAlert',
  'VSnackbar',
  'VProgress',
  'VSkeleton',
  'VLoadingOverlay',
  'VModal',
  'VDialog',
  'VDrawer',
  'VTooltip',
  'VPopover',
  'VTabs',
  'VPagination',
  'VMenu',
  'VDropdown',
  'VBreadcrumb',
  'VAvatar',
  'VBadge',
  'VChip',
  'VTag',
  'VCard',
  'VList',
  'VAccordion',
  'VTimeline',
  'VEmptyState',
  'VDataTable',
])

export interface VioletUIResolverOptions {
  /** Also inject `violet-ui/style.css` alongside each component. Default `false`. */
  importStyle?: boolean
}

export function VioletUIResolver(options: VioletUIResolverOptions = {}) {
  return {
    type: 'component' as const,
    resolve(name: string) {
      if (!components.has(name) && !/^Icon[A-Z]/.test(name)) return
      return {
        name,
        from: 'violet-ui',
        sideEffects: options.importStyle ? 'violet-ui/style.css' : undefined,
      }
    },
  }
}

export const VioletUIAutoImports = {
  'violet-ui': [
    'useForm',
    'useField',
    'useValidation',
    'useToast',
    'useTheme',
    'required',
    'email',
    'min',
    'max',
    'regex',
    'confirmed',
  ],
}
