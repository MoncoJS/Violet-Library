import { computed, reactive, readonly, ref, watch, type ComputedRef, type Ref } from 'vue'

export const colorRoles = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',
  'neutral',
] as const
export type ColorRole = (typeof colorRoles)[number]
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

// ---------------------------------------------------------------- palette

export const palette = {
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    950: '#2e1065',
  },
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    300: '#6ee7b7',
    400: '#34d399',
    700: '#047857',
    800: '#065f46',
    950: '#022c22',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    800: '#92400e',
    950: '#451a03',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    300: '#fda4af',
    400: '#fb7185',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    950: '#4c0519',
  },
  sky: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    300: '#7dd3fc',
    400: '#38bdf8',
    700: '#0369a1',
    800: '#075985',
    950: '#082f49',
  },
} as const
const p = palette

// ---------------------------------------------------------------- global tokens

export const tokens = {
  font: {
    family:
      "'Inter var', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    familyMono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    size: {
      xs: '0.75rem',
      sm: '0.8125rem',
      md: '0.875rem',
      lg: '1rem',
      xl: '1.125rem',
      '2xl': '1.375rem',
      '3xl': '1.75rem',
    },
    weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
    lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.7' },
  },
  space: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  },
  radius: {
    none: '0',
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  duration: { fast: '120ms', normal: '200ms', slow: '320ms' },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.3, 0, 0, 1.2)',
    decelerate: 'cubic-bezier(0, 0, 0, 1)',
  },
  zIndex: {
    dropdown: '1000',
    sticky: '1100',
    drawer: '1200',
    modal: '1300',
    popover: '1400',
    toast: '1500',
    tooltip: '1600',
  },
  controlHeight: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '2.75rem', xl: '3.25rem' },
}
export type GlobalTokens = typeof tokens

// ---------------------------------------------------------------- color utils

function hexToRgb(hex: string): [number, number, number] {
  const raw = hex.replace('#', '').trim()
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw
  if (!/^[0-9a-f]{6}$/i.test(full))
    throw new Error(`[violet-ui] Invalid hex color "${hex}". Expected #rgb or #rrggbb.`)
  const n = Number.parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(rgb: number[]): string {
  return `#${rgb
    .map((c) =>
      Math.round(Math.min(255, Math.max(0, c)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

export function mix(a: string, b: string, weight: number): string {
  const x = hexToRgb(a)
  const y = hexToRgb(b)
  return rgbToHex([0, 1, 2].map((i) => x[i]! * (1 - weight) + y[i]! * weight))
}

export function alpha(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgb(${r} ${g} ${b} / ${a})`
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

export function readableOn(bg: string, light = '#ffffff', dark = '#0f172a'): string {
  return contrastRatio(bg, light) >= contrastRatio(bg, dark) ? light : dark
}

// ---------------------------------------------------------------- themes

export interface RoleColors {
  base: string
  hover: string
  active: string
  contrast: string
  soft: string
  softHover: string
  softText: string
}

export interface ThemeColors extends Record<ColorRole, RoleColors> {
  background: string
  surface: string
  surfaceRaised: string
  surfaceSunken: string
  overlay: string
  border: string
  borderStrong: string
  text: string
  textMuted: string
  textSubtle: string
  textDisabled: string
  focusRing: string
}

export interface ThemeDefinition {
  dark: boolean
  colors: ThemeColors
  shadows: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>
}

export interface ThemeOverrides {
  dark?: boolean
  colors?: Partial<Omit<ThemeColors, ColorRole>> & {
    [K in ColorRole]?: string | Partial<RoleColors>
  }
  shadows?: Partial<ThemeDefinition['shadows']>
}

export const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    surfaceRaised: '#ffffff',
    surfaceSunken: p.slate[50],
    overlay: alpha(p.slate[900], 0.48),
    border: p.slate[200],
    borderStrong: p.slate[300],
    text: p.slate[900],
    textMuted: p.slate[600],
    textSubtle: p.slate[500],
    textDisabled: p.slate[400],
    focusRing: p.violet[500],
    primary: {
      base: p.violet[600],
      hover: p.violet[700],
      active: p.violet[800],
      contrast: '#ffffff',
      soft: p.violet[50],
      softHover: p.violet[100],
      softText: p.violet[700],
    },
    secondary: {
      base: p.slate[800],
      hover: p.slate[700],
      active: p.slate[900],
      contrast: '#ffffff',
      soft: p.slate[100],
      softHover: p.slate[200],
      softText: p.slate[800],
    },
    success: {
      base: p.emerald[700],
      hover: p.emerald[800],
      active: p.emerald[800],
      contrast: '#ffffff',
      soft: p.emerald[50],
      softHover: p.emerald[100],
      softText: p.emerald[800],
    },
    warning: {
      base: p.amber[400],
      hover: p.amber[500],
      active: p.amber[600],
      contrast: p.amber[950],
      soft: p.amber[50],
      softHover: p.amber[100],
      softText: p.amber[800],
    },
    danger: {
      base: p.rose[600],
      hover: p.rose[700],
      active: p.rose[800],
      contrast: '#ffffff',
      soft: p.rose[50],
      softHover: p.rose[100],
      softText: p.rose[700],
    },
    info: {
      base: p.sky[700],
      hover: p.sky[800],
      active: p.sky[800],
      contrast: '#ffffff',
      soft: p.sky[50],
      softHover: p.sky[100],
      softText: p.sky[800],
    },
    neutral: {
      base: p.slate[100],
      hover: p.slate[200],
      active: p.slate[300],
      contrast: p.slate[900],
      soft: p.slate[50],
      softHover: p.slate[100],
      softText: p.slate[700],
    },
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(15 23 42 / 0.05)',
    sm: '0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.06)',
    md: '0 4px 8px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.05)',
    lg: '0 12px 24px -6px rgb(15 23 42 / 0.12), 0 4px 8px -4px rgb(15 23 42 / 0.06)',
    xl: '0 24px 48px -12px rgb(15 23 42 / 0.22)',
  },
}

const darkRole = (
  c: { 300: string; 400: string; 950: string },
  extra: Partial<RoleColors> = {},
): RoleColors => ({
  base: c[400],
  hover: c[300],
  active: c[300],
  contrast: c[950],
  soft: alpha(c[400], 0.16),
  softHover: alpha(c[400], 0.24),
  softText: c[300],
  ...extra,
})

export const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#0b0d14',
    surface: '#11141d',
    surfaceRaised: '#171b26',
    surfaceSunken: '#090b10',
    overlay: alpha('#000000', 0.64),
    border: '#262b3a',
    borderStrong: '#363c4f',
    text: p.slate[100],
    textMuted: p.slate[400],
    textSubtle: p.slate[500],
    textDisabled: p.slate[600],
    focusRing: p.violet[400],
    primary: darkRole(p.violet, { active: p.violet[200] }),
    secondary: {
      base: p.slate[200],
      hover: p.slate[100],
      active: p.slate[50],
      contrast: p.slate[900],
      soft: alpha(p.slate[400], 0.16),
      softHover: alpha(p.slate[400], 0.24),
      softText: p.slate[200],
    },
    success: darkRole(p.emerald),
    warning: darkRole(p.amber),
    danger: darkRole(p.rose),
    info: darkRole(p.sky),
    neutral: {
      base: '#232838',
      hover: '#2c3245',
      active: '#363c4f',
      contrast: p.slate[100],
      soft: alpha(p.slate[400], 0.12),
      softHover: alpha(p.slate[400], 0.2),
      softText: p.slate[300],
    },
  },
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.4)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    md: '0 4px 8px -2px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 12px 24px -6px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(255 255 255 / 0.04)',
    xl: '0 24px 48px -12px rgb(0 0 0 / 0.7), 0 0 0 1px rgb(255 255 255 / 0.05)',
  },
}

export const builtinThemes: Record<string, ThemeDefinition> = { light: lightTheme, dark: darkTheme }

/** Derive a full role (hover/active/soft/readable contrast) from one brand color. */
export function deriveRole(base: string, dark: boolean): RoleColors {
  const toward = dark ? '#ffffff' : '#000000'
  return {
    base,
    hover: mix(base, toward, 0.12),
    active: mix(base, toward, 0.22),
    contrast: readableOn(base),
    soft: dark ? alpha(base, 0.16) : mix(base, '#ffffff', 0.92),
    softHover: dark ? alpha(base, 0.24) : mix(base, '#ffffff', 0.84),
    softText: mix(base, dark ? '#ffffff' : '#000000', 0.35),
  }
}

export function createTheme(
  overrides: ThemeOverrides = {},
  base: ThemeDefinition = overrides.dark ? darkTheme : lightTheme,
): ThemeDefinition {
  const dark = overrides.dark ?? base.dark
  const colors = { ...base.colors } as Record<string, unknown>
  for (const [key, value] of Object.entries(overrides.colors ?? {})) {
    if (value === undefined) continue
    if ((colorRoles as readonly string[]).includes(key)) {
      colors[key] =
        typeof value === 'string'
          ? deriveRole(value, dark)
          : { ...(colors[key] as RoleColors), ...(value as Partial<RoleColors>) }
    } else colors[key] = value
  }
  return {
    dark,
    colors: colors as unknown as ThemeColors,
    shadows: { ...base.shadows, ...overrides.shadows },
  }
}

// ---------------------------------------------------------------- CSS rendering

const PREFIX = '--v'
export const THEME_ATTR = 'data-v-theme'
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

export function themeToVars(theme: ThemeDefinition): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [k, v] of Object.entries(theme.colors))
    if (!(colorRoles as readonly string[]).includes(k)) vars[`${PREFIX}-color-${kebab(k)}`] = v as string
  for (const role of colorRoles)
    for (const [k, v] of Object.entries(theme.colors[role])) {
      const suffix = k === 'base' ? '' : `-${kebab(k)}`
      vars[`${PREFIX}-color-${role}${suffix}`] = v
    }
  for (const [k, v] of Object.entries(theme.shadows)) vars[`${PREFIX}-shadow-${k}`] = v
  return vars
}

export function tokensToVars(t: GlobalTokens = tokens): Record<string, string> {
  const vars: Record<string, string> = {
    [`${PREFIX}-font-family`]: t.font.family,
    [`${PREFIX}-font-family-mono`]: t.font.familyMono,
  }
  const groups: [string, Record<string, string>][] = [
    ['font-size', t.font.size],
    ['font-weight', t.font.weight],
    ['line-height', t.font.lineHeight],
    ['space', t.space],
    ['radius', t.radius],
    ['duration', t.duration],
    ['easing', t.easing],
    ['z', t.zIndex],
    ['control-height', t.controlHeight],
  ]
  for (const [name, group] of groups)
    for (const [k, v] of Object.entries(group)) vars[`${PREFIX}-${name}-${k}`] = v
  return vars
}

const declarations = (vars: Record<string, string>, indent = '  ') =>
  Object.entries(vars)
    .map(([k, v]) => `${indent}${k}: ${v};`)
    .join('\n')

const themeSelector = (name: string) => `[${THEME_ATTR}="${name}"]`

export interface RenderThemeCssOptions {
  themes?: Record<string, ThemeDefinition>
  defaultTheme?: string
  /** Theme applied under `prefers-color-scheme: dark` when no theme attribute is set. `false` disables it. */
  systemDarkTheme?: string | false
  includeGlobalTokens?: boolean
}

export function renderThemeCss(options: RenderThemeCssOptions = {}): string {
  const {
    themes = builtinThemes,
    defaultTheme = 'light',
    systemDarkTheme = 'dark',
    includeGlobalTokens = true,
  } = options
  const blocks: string[] = []
  if (includeGlobalTokens) blocks.push(`:root {\n${declarations(tokensToVars())}\n}`)
  for (const [name, theme] of Object.entries(themes)) {
    const selector = name === defaultTheme ? `:root, ${themeSelector(name)}` : themeSelector(name)
    blocks.push(
      `${selector} {\n${declarations(themeToVars(theme))}\n  color-scheme: ${theme.dark ? 'dark' : 'light'};\n}`,
    )
  }
  const sys = systemDarkTheme ? themes[systemDarkTheme] : undefined
  if (sys)
    blocks.push(
      `@media (prefers-color-scheme: dark) {\n  :root:not([${THEME_ATTR}]) {\n${declarations(themeToVars(sys), '    ')}\n    color-scheme: dark;\n  }\n}`,
    )
  return `${blocks.join('\n\n')}\n`
}

// ---------------------------------------------------------------- theme manager

export interface ThemeManagerOptions {
  defaultTheme?: 'system' | (string & {})
  /** localStorage key, or `false` to disable persistence. */
  storageKey?: string | false
  lightTheme?: string
  darkTheme?: string
  themes?: Record<string, ThemeOverrides | ThemeDefinition>
}

export interface ThemeManager {
  preference: Readonly<Ref<string>>
  name: ComputedRef<string>
  current: ComputedRef<ThemeDefinition>
  isDark: ComputedRef<boolean>
  themes: ComputedRef<string[]>
  setTheme: (name: string) => void
  toggle: () => void
  register: (name: string, theme: ThemeOverrides | ThemeDefinition) => void
  renderStyles: () => string
  htmlAttrs: () => Record<string, string>
  mount: (el?: HTMLElement) => () => void
}

const CUSTOM_STYLE_ID = 'violet-ui-custom-themes'

const isFullTheme = (t: ThemeOverrides | ThemeDefinition): t is ThemeDefinition =>
  typeof t.dark === 'boolean' &&
  !!t.shadows &&
  !!t.colors &&
  typeof (t.colors as ThemeColors).background === 'string' &&
  colorRoles.every((r) => {
    const v = t.colors?.[r]
    return typeof v === 'object' && 'contrast' in v
  })

export function createThemeManager(options: ThemeManagerOptions = {}): ThemeManager {
  const {
    defaultTheme = 'system',
    storageKey = 'violet-ui-theme',
    lightTheme: lightName = 'light',
    darkTheme: darkName = 'dark',
  } = options
  const registry = reactive<Record<string, ThemeDefinition>>({ ...builtinThemes })
  const custom = new Set<string>()

  const register = (name: string, theme: ThemeOverrides | ThemeDefinition) => {
    const def = isFullTheme(theme) ? theme : createTheme(theme, registry[name])
    registry[name] = def
    if (def !== builtinThemes[name]) custom.add(name)
  }
  for (const [name, theme] of Object.entries(options.themes ?? {})) register(name, theme)

  const readStored = () => {
    if (!isClient || !storageKey) return null
    try {
      return window.localStorage.getItem(storageKey)
    } catch {
      return null
    }
  }

  const preference = ref<string>(defaultTheme)
  const systemDark = ref(false)
  const name = computed(() => {
    const pref = preference.value
    if (pref === 'system') return systemDark.value ? darkName : lightName
    return pref in registry ? pref : lightName
  })
  const current = computed(() => registry[name.value] ?? lightTheme)
  const setTheme = (n: string) => {
    preference.value = n
  }

  const renderStyles = () => {
    const themes = Object.fromEntries([...custom].map((n) => [n, registry[n]!]))
    return Object.keys(themes).length
      ? renderThemeCss({ themes, defaultTheme: '', systemDarkTheme: false, includeGlobalTokens: false })
      : ''
  }

  function mount(el: HTMLElement = document.documentElement) {
    const stored = readStored()
    if (stored) preference.value = stored
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    systemDark.value = mq?.matches ?? false
    const onChange = (e: MediaQueryListEvent) => (systemDark.value = e.matches)
    mq?.addEventListener?.('change', onChange)

    const stopAttr = watch(name, (n) => el.setAttribute(THEME_ATTR, n), { immediate: true })
    const stopStore = watch(preference, (v) => {
      if (!storageKey) return
      try {
        window.localStorage.setItem(storageKey, v)
      } catch {
        /* storage unavailable */
      }
    })
    const stopCss = watch(
      () => renderStyles(),
      (css) => {
        let style = document.getElementById(CUSTOM_STYLE_ID)
        if (!css) return style?.remove()
        if (!style) {
          style = document.createElement('style')
          style.id = CUSTOM_STYLE_ID
          document.head.appendChild(style)
        }
        style.textContent = css
      },
      { immediate: true },
    )
    return () => {
      mq?.removeEventListener?.('change', onChange)
      stopAttr()
      stopStore()
      stopCss()
    }
  }

  return {
    preference: readonly(preference),
    name,
    current,
    isDark: computed(() => current.value.dark),
    themes: computed(() => Object.keys(registry)),
    setTheme,
    toggle: () => setTheme(current.value.dark ? lightName : darkName),
    register,
    renderStyles,
    htmlAttrs: (): Record<string, string> =>
      preference.value === 'system' ? {} : { [THEME_ATTR]: name.value },
    mount,
  }
}

/**
 * Inline script for `<head>` that applies a persisted theme before first paint
 * (avoids a flash when the saved preference differs from the system one).
 */
export function getThemeInitScript(storageKey = 'violet-ui-theme'): string {
  const key = JSON.stringify(storageKey)
  return `(function(){try{var t=localStorage.getItem(${key});if(t&&t!=='system')document.documentElement.setAttribute(${JSON.stringify(THEME_ATTR)},t)}catch(e){}})()`
}
