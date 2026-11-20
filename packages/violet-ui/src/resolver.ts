/** Resolver for `unplugin-vue-components` and preset for `unplugin-auto-import`. */

const components = new Set([
  'VButton',
  'VIconButton',
  'VButtonGroup',
  'VSpinner',
  'VInput',
  'VToast',
  'VToaster',
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
