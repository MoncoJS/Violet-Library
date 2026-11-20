// Global component types for templates: `"types": ["violet-ui/volar"]`
declare module 'vue' {
  export interface GlobalComponents {
    VButton: (typeof import('violet-ui'))['VButton']
    VIconButton: (typeof import('violet-ui'))['VIconButton']
    VButtonGroup: (typeof import('violet-ui'))['VButtonGroup']
    VSpinner: (typeof import('violet-ui'))['VSpinner']
    VInput: (typeof import('violet-ui'))['VInput']
    VToast: (typeof import('violet-ui'))['VToast']
    VToaster: (typeof import('violet-ui'))['VToaster']
  }
}
export {}
