import {
  computed,
  getCurrentInstance,
  inject,
  isReactive,
  isRef,
  onBeforeUnmount,
  provide,
  reactive,
  readonly,
  ref,
  shallowRef,
  toRaw,
  unref,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'

// ---------------------------------------------------------------- rules

export interface RuleContext {
  field: string
  values: Record<string, unknown>
  label?: string
}
export type ValidationResult = true | string
export type ValidationRule<T = unknown> = (
  value: T,
  ctx: RuleContext,
) => ValidationResult | Promise<ValidationResult>
export type RuleMessage<P = object> = string | ((params: P & { label: string }) => string)

export async function runRules<T>(
  value: T,
  rules: readonly ValidationRule<T>[],
  ctx: RuleContext,
  { bail = true }: { bail?: boolean } = {},
): Promise<string[]> {
  const errors: string[] = []
  for (const rule of rules) {
    let result: ValidationResult
    try {
      result = await rule(value, ctx)
    } catch (e) {
      result = e instanceof Error ? e.message : String(e)
    }
    if (result !== true) {
      errors.push(result)
      if (bail) break
    }
  }
  return errors
}

export function isEmpty(v: unknown): boolean {
  if (v == null || v === false) return true
  if (typeof v === 'string') return v.trim().length === 0
  if (Array.isArray(v)) return v.length === 0
  if (v instanceof Set || v instanceof Map) return v.size === 0
  return false
}

const msg = <P extends object>(m: RuleMessage<P>, params: P, label: string) =>
  typeof m === 'function' ? m({ ...params, label }) : m
const labelOf = (ctx: RuleContext) => ctx.label ?? 'This field'
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[a-z]{2,}$/i

const measure = (v: unknown) =>
  typeof v === 'number'
    ? Number.isNaN(v)
      ? null
      : { size: v, kind: 'number' as const }
    : typeof v === 'string'
      ? { size: v.length, kind: 'length' as const }
      : Array.isArray(v)
        ? { size: v.length, kind: 'items' as const }
        : null
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`
const boundMessage = (dir: 'least' | 'most', kind: string, n: number, label: string) => {
  switch (kind) {
    case 'length':
      return `${label} must be at ${dir} ${plural(n, 'character')}`
    case 'items':
      return `Select at ${dir} ${plural(n, 'item')}`
    default:
      return `${label} must be at ${dir} ${n}`
  }
}

export function required(message: RuleMessage = ({ label }) => `${label} is required`): ValidationRule {
  return (v, ctx) => (isEmpty(v) ? msg(message, {}, labelOf(ctx)) : true)
}

export function email(message: RuleMessage = 'Please enter a valid email address'): ValidationRule {
  return (v, ctx) => (isEmpty(v) ? true : EMAIL_RE.test(String(v)) || msg(message, {}, labelOf(ctx)))
}

export function min(n: number, message?: RuleMessage<{ min: number }>): ValidationRule {
  return (v, ctx) => {
    if (isEmpty(v)) return true
    const m = measure(v)
    if (!m || m.size >= n) return true
    const label = labelOf(ctx)
    return message ? msg(message, { min: n }, label) : boundMessage('least', m.kind, n, label)
  }
}

export function max(n: number, message?: RuleMessage<{ max: number }>): ValidationRule {
  return (v, ctx) => {
    if (isEmpty(v)) return true
    const m = measure(v)
    if (!m || m.size <= n) return true
    const label = labelOf(ctx)
    return message ? msg(message, { max: n }, label) : boundMessage('most', m.kind, n, label)
  }
}

export function regex(
  pattern: RegExp,
  message: RuleMessage<{ pattern: RegExp }> = ({ label }) => `${label} is invalid`,
): ValidationRule {
  return (v, ctx) => {
    if (isEmpty(v)) return true
    pattern.lastIndex = 0
    return pattern.test(String(v)) || msg(message, { pattern }, labelOf(ctx))
  }
}

export function confirmed(
  target: string,
  message: RuleMessage<{ target: string }> = 'Values do not match',
): ValidationRule {
  return (v, ctx) => v === ctx.values[target] || msg(message, { target }, labelOf(ctx))
}

// ---------------------------------------------------------------- helpers

function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null ||
    Array.isArray(a) !== Array.isArray(b)
  )
    return false
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  return (
    ka.length === kb.length &&
    ka.every((k) => isEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]))
  )
}

function clone<T>(input: T): T {
  const v = isRef(input) ? unref(input) : isReactive(input) ? toRaw(input) : input
  if (v === null || typeof v !== 'object') return v as T
  if (v instanceof Date) return new Date(v.getTime()) as T
  if (Array.isArray(v)) return v.map((x) => clone(x)) as T
  if (typeof Blob !== 'undefined' && v instanceof Blob) return v as T
  const out: Record<string, unknown> = {}
  for (const [k, x] of Object.entries(v)) out[k] = clone(x)
  return out as T
}

// ---------------------------------------------------------------- useForm

export type ValidateTrigger = 'input' | 'blur' | 'submit'
export type FormRules<T> = { [K in keyof T]?: ValidationRule<T[K]>[] }
export type FormErrors<T> = Partial<Record<keyof T, string>>

export interface FieldBinding<V> {
  name: string
  modelValue: V
  // `any` lets one binding fit inputs whose emitted type is wider than V
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'onUpdate:modelValue': (v: any) => void
  onBlur: () => void
  error: string | undefined
}

export interface SubmitHelpers<T> {
  setErrors: (errors: Partial<Record<keyof T, string | string[] | undefined>>) => void
  reset: (values?: Partial<T>) => void
}

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T
  rules?: FormRules<T>
  labels?: Partial<Record<keyof T, string>>
  validateOn?: ValidateTrigger | ValidateTrigger[]
  onSubmit?: (values: T, helpers: SubmitHelpers<T>) => unknown
  onInvalid?: (errors: FormErrors<T>) => void
}

interface FieldRegistration {
  rules: ValidationRule[]
  label?: string
}

interface FormContext {
  values: Record<string, unknown>
  getErrors: (name: string) => string[]
  isTouched: (name: string) => boolean
  isFieldDirty: (name: string) => boolean
  setFieldValue: (name: string, value: unknown) => void
  handleBlur: (name: string) => void
  validateField: (name: string) => Promise<boolean>
  resetField: (name: string) => void
  registerField: (name: string, reg: FieldRegistration) => () => void
}

export const FORM_KEY: InjectionKey<FormContext> = Symbol('violet-ui:form')

export function useForm<T extends Record<string, unknown>>(options: UseFormOptions<T>) {
  type K = keyof T & string
  const triggers = new Set<ValidateTrigger>(
    ([] as ValidateTrigger[]).concat(options.validateOn ?? ['blur', 'submit']),
  )
  const initial = shallowRef<T>(clone(options.initialValues))
  const values = reactive(clone(options.initialValues)) as T
  const errorMap = reactive<Record<string, string[]>>({})
  const touched = reactive<Record<string, boolean>>({})
  const fields = new Map<string, Set<FieldRegistration>>()
  const runIds = new Map<string, number>()
  const pending = ref(0)
  const isSubmitting = ref(false)
  const submitCount = ref(0)

  const fieldNames = () =>
    Array.from(new Set([...Object.keys(values), ...Object.keys(options.rules ?? {}), ...fields.keys()]))
  const rulesFor = (name: string): ValidationRule[] => [
    ...(((options.rules as Record<string, ValidationRule[]> | undefined)?.[name]) ?? []),
    ...Array.from(fields.get(name) ?? []).flatMap((f) => f.rules),
  ]
  const labelFor = (name: string) => {
    for (const f of fields.get(name) ?? []) if (f.label) return f.label
    return (options.labels as Record<string, string> | undefined)?.[name]
  }
  const hasError = (name: string) => (errorMap[name]?.length ?? 0) > 0
  const writeErrors = (name: string, errs?: string[]) => {
    if (errs && errs.length) errorMap[name] = errs
    else delete errorMap[name]
  }

  async function validateField(name: string): Promise<boolean> {
    const rules = rulesFor(name)
    const id = (runIds.get(name) ?? 0) + 1
    runIds.set(name, id)
    if (!rules.length) {
      writeErrors(name, undefined)
      return true
    }
    pending.value += 1
    try {
      const v = values as Record<string, unknown>
      const errs = await runRules(v[name], rules, { field: name, values: v, label: labelFor(name) })
      if (runIds.get(name) === id) writeErrors(name, errs)
      return errs.length === 0
    } finally {
      pending.value -= 1
    }
  }

  async function validate() {
    return (await Promise.all(fieldNames().map((n) => validateField(n)))).every(Boolean)
  }

  function afterChange(name: string) {
    if (triggers.has('input') || hasError(name)) void validateField(name)
    // dependants (e.g. `confirmed`) refresh while they show an error
    for (const other of Object.keys(errorMap)) if (other !== name) void validateField(other)
  }

  function setFieldValue(name: string, value: unknown) {
    ;(values as Record<string, unknown>)[name] = value
    afterChange(name)
  }

  function setValues(next: Partial<T>) {
    Object.assign(values, clone(next))
    for (const k of Object.keys(next)) afterChange(k)
  }

  function handleBlur(name: string) {
    touched[name] = true
    if (triggers.has('blur')) void validateField(name)
  }

  function setErrors(errs: Partial<Record<keyof T, string | string[] | undefined>>) {
    for (const [k, v] of Object.entries(errs))
      writeErrors(k, v === undefined ? undefined : ([] as string[]).concat(v as string | string[]))
  }

  const invalidateRuns = () => {
    for (const [k, v] of runIds) runIds.set(k, v + 1)
  }

  function reset(next?: Partial<T>) {
    if (next) initial.value = { ...initial.value, ...clone(next) }
    const base = clone(initial.value)
    for (const k of Object.keys(values)) if (!(k in base)) delete (values as Record<string, unknown>)[k]
    Object.assign(values, base)
    invalidateRuns()
    for (const k of Object.keys(errorMap)) delete errorMap[k]
    for (const k of Object.keys(touched)) delete touched[k]
    submitCount.value = 0
  }

  function resetField(name: string) {
    ;(values as Record<string, unknown>)[name] = clone((initial.value as Record<string, unknown>)[name])
    runIds.set(name, (runIds.get(name) ?? 0) + 1)
    delete errorMap[name]
    delete touched[name]
  }

  const errors = computed(() => {
    const out: FormErrors<T> = {}
    for (const [k, v] of Object.entries(errorMap)) if (v[0]) out[k as keyof T] = v[0]
    return out
  })

  const helpers: SubmitHelpers<T> = { setErrors, reset }

  function handleSubmit(
    onValid?: UseFormOptions<T>['onSubmit'],
    onInvalid?: UseFormOptions<T>['onInvalid'],
  ) {
    return async (event?: Event) => {
      event?.preventDefault?.()
      if (isSubmitting.value) return
      submitCount.value += 1
      for (const n of fieldNames()) touched[n] = true
      if (!(await validate())) {
        ;(onInvalid ?? options.onInvalid)?.(errors.value)
        return
      }
      const handler = onValid ?? options.onSubmit
      if (!handler) return
      isSubmitting.value = true
      try {
        await handler(clone(values), helpers)
      } finally {
        isSubmitting.value = false
      }
    }
  }

  function register<N extends K>(name: N): FieldBinding<T[N]> {
    return {
      name,
      modelValue: values[name],
      'onUpdate:modelValue': (v) => setFieldValue(name, v),
      onBlur: () => handleBlur(name),
      error: errorMap[name]?.[0],
    }
  }

  const ctx: FormContext = {
    values: values as Record<string, unknown>,
    getErrors: (n) => errorMap[n] ?? [],
    isTouched: (n) => !!touched[n],
    isFieldDirty: (n) =>
      !isEqual((values as Record<string, unknown>)[n], (initial.value as Record<string, unknown>)[n]),
    setFieldValue,
    handleBlur,
    validateField,
    resetField,
    registerField(name, reg) {
      const set = fields.get(name) ?? new Set()
      set.add(reg)
      fields.set(name, set)
      return () => {
        set.delete(reg)
        if (!set.size) fields.delete(name)
      }
    },
  }
  if (getCurrentInstance()) provide(FORM_KEY, ctx)

  return {
    values,
    errors,
    allErrors: readonly(errorMap),
    touched: readonly(touched),
    isDirty: computed(() => !isEqual(values, initial.value)),
    isValid: computed(() => Object.keys(errors.value).length === 0),
    isSubmitting: readonly(isSubmitting),
    isValidating: computed(() => pending.value > 0),
    submitCount: readonly(submitCount),
    validate,
    validateField: (n: K) => validateField(n),
    setFieldValue: <N extends K>(n: N, v: T[N]) => setFieldValue(n, v),
    setValues,
    setFieldError: (n: K, e?: string | string[]) =>
      writeErrors(n, e === undefined ? undefined : ([] as string[]).concat(e)),
    setErrors,
    setTouched: (n: K, v = true) => {
      touched[n] = v
    },
    reset,
    handleSubmit,
    register,
  }
}
export type UseFormReturn<T extends Record<string, unknown>> = ReturnType<typeof useForm<T>>

// ---------------------------------------------------------------- useField

export interface UseFieldOptions<V> {
  rules?: ValidationRule<V>[]
  label?: string
  initialValue?: V
  validateOn?: ValidateTrigger | ValidateTrigger[]
}

export function useField<V = unknown>(name: string, options: UseFieldOptions<V> = {}) {
  const form = getCurrentInstance() ? inject(FORM_KEY, null) : null
  const rules = (options.rules ?? []) as ValidationRule[]

  if (form) {
    const unregister = form.registerField(name, { rules, label: options.label })
    if (getCurrentInstance()) onBeforeUnmount(unregister)
    if (!(name in form.values) && options.initialValue !== undefined)
      form.values[name] = options.initialValue
    const value = computed<V>({
      get: () => form.values[name] as V,
      set: (v) => form.setFieldValue(name, v),
    })
    const error = computed(() => form.getErrors(name)[0])
    const handleBlur = () => form.handleBlur(name)
    return {
      value,
      error,
      errors: computed(() => form.getErrors(name)),
      touched: computed(() => form.isTouched(name)),
      dirty: computed(() => form.isFieldDirty(name)),
      handleBlur,
      validate: () => form.validateField(name),
      reset: () => form.resetField(name),
      bindings: computed(() => ({
        name,
        modelValue: value.value,
        'onUpdate:modelValue': (v: V) => (value.value = v),
        onBlur: handleBlur,
        error: error.value,
      })),
    }
  }

  // standalone
  const triggers = new Set<ValidateTrigger>(
    ([] as ValidateTrigger[]).concat(options.validateOn ?? ['blur']),
  )
  const initial = clone(options.initialValue) as V
  const value = ref(clone(initial)) as Ref<V>
  const touched = ref(false)
  const v = useValidation(value, rules as ValidationRule<V>[], { label: options.label, field: name })
  watch(value, () => {
    if (triggers.has('input') || v.error.value) void v.validate()
  })
  const handleBlur = () => {
    touched.value = true
    if (triggers.has('blur')) void v.validate()
  }
  return {
    value,
    error: v.error,
    errors: v.errors,
    touched: readonly(touched),
    dirty: computed(() => !isEqual(value.value, initial)),
    handleBlur,
    validate: v.validate,
    reset: () => {
      value.value = clone(initial)
      touched.value = false
      v.reset()
    },
    bindings: computed(() => ({
      name,
      modelValue: value.value,
      'onUpdate:modelValue': (x: V) => (value.value = x),
      onBlur: handleBlur,
      error: v.error.value,
    })),
  }
}

// ---------------------------------------------------------------- useValidation

export interface UseValidationOptions {
  label?: string
  field?: string
  watchValue?: boolean
  bail?: boolean
}

export function useValidation<V>(
  source: Ref<V>,
  rules: ValidationRule<V>[],
  options: UseValidationOptions = {},
): {
  errors: Readonly<Ref<readonly string[]>>
  error: ComputedRef<string | undefined>
  isValidating: Readonly<Ref<boolean>>
  validate: () => Promise<boolean>
  reset: () => void
} {
  const errors = ref<string[]>([])
  const isValidating = ref(false)
  let run = 0
  async function validate() {
    const id = ++run
    isValidating.value = true
    try {
      const errs = await runRules(
        source.value,
        rules,
        { field: options.field ?? '', values: {}, label: options.label },
        { bail: options.bail ?? true },
      )
      if (id === run) errors.value = errs
      return errs.length === 0
    } finally {
      if (id === run) isValidating.value = false
    }
  }
  if (options.watchValue) watch(source, () => void validate())
  return {
    errors: readonly(errors),
    error: computed(() => errors.value[0]),
    isValidating: readonly(isValidating),
    validate,
    reset: () => {
      run++
      errors.value = []
      isValidating.value = false
    },
  }
}
