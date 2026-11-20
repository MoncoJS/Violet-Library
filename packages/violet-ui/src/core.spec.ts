import { nextTick } from 'vue'
import {
  colorRoles,
  contrastRatio,
  createTheme,
  darkTheme,
  lightTheme,
  renderThemeCss,
} from './theme'
import { confirmed, email, max, min, regex, required, useForm } from './form'
import { createToastStore } from './toast'
import { toCSV } from './components/table/csv'
import { monthGrid, parseTyped, toISO } from './utils/date'

describe('theme', () => {
  it.each([
    ['light', lightTheme],
    ['dark', darkTheme],
  ])('%s theme: every role meets WCAG AA (4.5:1) for contrast text', (_, theme) => {
    for (const role of colorRoles) {
      const c = theme.colors[role]
      if (c.base.startsWith('#') && c.contrast.startsWith('#'))
        expect(contrastRatio(c.base, c.contrast), role).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('derives a full role from one brand color with readable contrast', () => {
    const t = createTheme({ colors: { primary: '#0369a1' } })
    expect(t.colors.primary.base).toBe('#0369a1')
    expect(contrastRatio(t.colors.primary.base, t.colors.primary.contrast)).toBeGreaterThanOrEqual(
      4.5,
    )
    expect(t.colors.primary.hover).not.toBe(t.colors.primary.base)
  })

  it('renders :root light tokens, dark attribute block and a no-JS media fallback', () => {
    const css = renderThemeCss()
    expect(css).toContain(':root, [data-v-theme="light"]')
    expect(css).toContain('[data-v-theme="dark"]')
    expect(css).toContain('@media (prefers-color-scheme: dark)')
    expect(css).toContain('--v-color-primary:')
    expect(css).toContain('--v-space-4: 1rem')
  })
})

describe('validation rules', () => {
  const ctx = { field: 'f', values: { password: 'secret' }, label: 'Field' }
  it('required', () => {
    expect(required()('', ctx)).toBe('Field is required')
    expect(required()('  ', ctx)).toBe('Field is required')
    expect(required()([], ctx)).toBe('Field is required')
    expect(required()('x', ctx)).toBe(true)
  })
  it('email skips empty values', () => {
    expect(email()('', ctx)).toBe(true)
    expect(email()('a@b.co', ctx)).toBe(true)
    expect(email()('nope', ctx)).not.toBe(true)
  })
  it('min / max on strings, numbers and arrays', () => {
    expect(min(3)('ab', ctx)).toBe('Field must be at least 3 characters')
    expect(min(3)(2, ctx)).toBe('Field must be at least 3')
    expect(max(2)([1, 2, 3], ctx)).toBe('Select at most 2 items')
    expect(min(8, ({ label, min: n }) => `${label} needs ${n}+`)('x', ctx)).toBe('Field needs 8+')
  })
  it('regex and confirmed', () => {
    expect(regex(/^\d+$/)('12a', ctx)).not.toBe(true)
    expect(regex(/^\d+$/g)('12', ctx)).toBe(true)
    expect(confirmed('password')('secret', ctx)).toBe(true)
    expect(confirmed('password')('other', ctx)).toBe('Values do not match')
  })
})

describe('useForm', () => {
  const make = (onSubmit = vi.fn()) =>
    useForm({
      initialValues: { email: '', password: '', confirm: '' },
      labels: { email: 'Email' },
      rules: {
        email: [required(), email()],
        password: [required(), min(8)],
        confirm: [confirmed('password')],
      },
      onSubmit,
    })

  it('blocks submit when invalid and touches every field', async () => {
    const submit = vi.fn()
    const form = make(submit)
    await form.handleSubmit()()
    expect(submit).not.toHaveBeenCalled()
    expect(form.errors.value.email).toBe('Email is required')
    expect(form.touched.password).toBe(true)
    expect(form.submitCount.value).toBe(1)
  })

  it('submits a deep copy and supports server errors + reset', async () => {
    const form = useForm({
      initialValues: { email: '', tags: [] as string[] },
      rules: { email: [required()] },
      onSubmit(values, { setErrors }) {
        values.tags.push('mutated')
        setErrors({ email: 'Taken' })
      },
    })
    form.setFieldValue('email', 'a@b.co')
    expect(form.isDirty.value).toBe(true)
    await form.handleSubmit()()
    expect(form.values.tags).toEqual([])
    expect(form.errors.value.email).toBe('Taken')
    form.reset()
    expect(form.values.email).toBe('')
    expect(form.errors.value).toEqual({})
    expect(form.isDirty.value).toBe(false)
  })

  it('re-validates a dependent field when its target changes', async () => {
    const form = make()
    form.setFieldValue('password', 'password1')
    form.setFieldValue('confirm', 'password2')
    await form.validateField('confirm')
    expect(form.errors.value.confirm).toBeDefined()
    form.setFieldValue('password', 'password2')
    await nextTick()
    await new Promise((r) => setTimeout(r))
    expect(form.errors.value.confirm).toBeUndefined()
  })

  it('register() returns v-bind props', () => {
    const form = make()
    const b = form.register('email')
    expect(b).toMatchObject({ name: 'email', modelValue: '', error: undefined })
    b['onUpdate:modelValue']('x@y.zz')
    expect(form.values.email).toBe('x@y.zz')
  })
})

describe('toast store', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('auto-dismisses, pauses and caps the stack', () => {
    const t = createToastStore({ max: 2, duration: 1000 })
    t.info('a')
    const id = t.success('b')
    t.error('c')
    expect(t.toasts.value.map((x) => x.description)).toEqual(['b', 'c'])
    t.pause(id)
    vi.advanceTimersByTime(1500)
    expect(t.toasts.value.map((x) => x.id)).toEqual([id])
    t.resume(id)
    vi.advanceTimersByTime(1000)
    expect(t.toasts.value).toHaveLength(0)
  })

  it('promise() turns loading into success', async () => {
    const t = createToastStore()
    const p = t.promise(Promise.resolve(42), {
      loading: 'Saving',
      success: (v) => `Saved ${v}`,
      error: 'Failed',
    })
    expect(t.toasts.value[0]?.description).toBe('Saving')
    await p
    expect(t.toasts.value[0]).toMatchObject({ description: 'Saved 42', color: 'success' })
  })
})

describe('utils', () => {
  it('CSV escapes quotes/commas and neutralises formulas', () => {
    const csv = toCSV(
      ['a', 'b'],
      [
        ['x,y', 'say "hi"'],
        ['=SUM(A1)', -5],
      ],
    )
    expect(csv).toBe('a,b\r\n"x,y","say ""hi"""\r\n\'=SUM(A1),-5')
  })
  it('month grid starts on the requested weekday and has 42 cells', () => {
    const g = monthGrid(2024, 1, 1) // Feb 2024, Monday first
    expect(g).toHaveLength(42)
    expect(new Date(g[0]!.iso).getUTCDay()).toBe(1)
    expect(g.filter((d) => d.inMonth)).toHaveLength(29)
  })
  it('parses typed dates', () => {
    expect(parseTyped('2024-03-09')).toBe('2024-03-09')
    expect(parseTyped('9/3/2024', 'en-GB')).toBe('2024-03-09')
    expect(parseTyped('3/9/2024', 'en-US')).toBe('2024-03-09')
    expect(parseTyped('31/02/2024', 'en-GB')).toBeNull()
    expect(toISO(new Date(2024, 0, 5))).toBe('2024-01-05')
  })
})
