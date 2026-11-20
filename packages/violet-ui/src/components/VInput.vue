<script setup lang="ts">
import { computed, ref, useAttrs, useId, useSlots, type Component } from 'vue'
import { IconClose } from '../icons'
import type { ComponentSize } from '../theme'
import VSpinner from './VSpinner.vue'

export type InputValue = string | number | null | undefined

export interface InputProps {
  modelValue?: InputValue
  modelModifiers?: { trim?: boolean; number?: boolean; lazy?: boolean }
  type?: string
  id?: string
  name?: string
  label?: string
  placeholder?: string
  hint?: string
  /** `true` marks invalid without a message; a string also renders it. */
  error?: string | boolean
  size?: ComponentSize
  variant?: 'outline' | 'filled'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  loading?: boolean
  maxlength?: number
  showCount?: boolean
  autocomplete?: string
  inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  prependIcon?: Component
  appendIcon?: Component
}

export interface InputExposed {
  focus: () => void
  blur: () => void
  select: () => void
  readonly input: HTMLInputElement | null
}

defineOptions({ name: 'VInput', inheritAttrs: false })
const props = withDefaults(defineProps<InputProps>(), {
  modelValue: undefined,
  modelModifiers: () => ({}),
  type: 'text',
  size: 'md',
  variant: 'outline',
})
const emit = defineEmits<{
  'update:modelValue': [value: InputValue]
  change: [value: InputValue]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  clear: []
}>()

const slots = useSlots()
const attrs = useAttrs()
const uid = useId()

const inputId = computed(() => props.id ?? `v-input-${uid}`)
const hintId = computed(() => `${inputId.value}-hint`)
const errorId = computed(() => `${inputId.value}-error`)
const errorText = computed(() =>
  typeof props.error === 'string' && props.error ? props.error : undefined,
)
const invalid = computed(() => !!props.error)
const showHint = computed(() => !errorText.value && !!(props.hint || slots.hint))
const describedBy = computed(
  () =>
    [errorText.value && errorId.value, showHint.value && hintId.value, attrs['aria-describedby']]
      .filter(Boolean)
      .join(' ') || undefined,
)
const rootAttrs = computed(() => ({ class: attrs.class, style: attrs.style }))
const fieldAttrs = computed(() => {
  const { class: _c, style: _s, 'aria-describedby': _d, ...rest } = attrs
  return rest
})

const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)
/** Raw text while typing, so `1.` or `-` are not clobbered by number parsing. */
const draft = ref<string | null>(null)
let composing = false

const numeric = computed(() => props.type === 'number' || !!props.modelModifiers.number)

function parse(raw: string): InputValue {
  const v = props.modelModifiers.trim ? raw.trim() : raw
  if (!numeric.value) return v
  if (v === '') return null
  const n = Number.parseFloat(v)
  return Number.isNaN(n) ? v : n
}

const same = (a: InputValue, b: InputValue) => (a ?? null) === (b ?? null)
const display = computed(() =>
  draft.value !== null && same(parse(draft.value), props.modelValue)
    ? draft.value
    : props.modelValue === null || props.modelValue === undefined
      ? ''
      : String(props.modelValue),
)
const hasValue = computed(() => display.value.length > 0)
const canClear = computed(
  () => props.clearable && hasValue.value && !props.disabled && !props.readonly,
)
const count = computed(() => display.value.length)

function onInput(e: Event) {
  if (composing) return
  draft.value = (e.target as HTMLInputElement).value
  if (!props.modelModifiers.lazy) emit('update:modelValue', parse(draft.value))
}
function onChange(e: Event) {
  const v = parse((e.target as HTMLInputElement).value)
  if (props.modelModifiers.lazy) emit('update:modelValue', v)
  emit('change', v)
}
function onCompositionEnd(e: Event) {
  composing = false
  onInput(e)
}
function onFocus(e: FocusEvent) {
  focused.value = true
  emit('focus', e)
}
function onBlur(e: FocusEvent) {
  focused.value = false
  draft.value = null
  emit('blur', e)
}
function clear() {
  draft.value = null
  emit('update:modelValue', numeric.value ? null : '')
  emit('clear')
  inputRef.value?.focus()
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && canClear.value) {
    e.stopPropagation()
    clear()
  }
}
function onControlMousedown(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target !== inputRef.value && !target.closest('button')) {
    e.preventDefault()
    inputRef.value?.focus()
  }
}

const classes = computed(() => [
  'v-input',
  `v-input--${props.size}`,
  `v-input--${props.variant}`,
  {
    'is-focused': focused.value,
    'is-invalid': invalid.value,
    'is-disabled': props.disabled,
    'is-readonly': props.readonly,
    'has-value': hasValue.value,
  },
])

defineExpose<InputExposed>({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select(),
  get input() {
    return inputRef.value
  },
})
</script>

<template>
  <div :class="[classes, rootAttrs.class]" :style="rootAttrs.style as any">
    <label v-if="label || $slots.label" :for="inputId" class="v-input__label">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="v-input__required" aria-hidden="true">*</span>
    </label>
    <div class="v-input__control" @mousedown="onControlMousedown">
      <span v-if="$slots.prefix || prependIcon" class="v-input__affix v-input__affix--prefix">
        <slot name="prefix"><component :is="prependIcon" /></slot>
      </span>
      <input
        :id="inputId"
        ref="inputRef"
        v-bind="fieldAttrs"
        class="v-input__field"
        :type="type"
        :name="name"
        :value="display"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-required="required ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-busy="loading ? 'true' : undefined"
        @input="onInput"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
        @compositionstart="composing = true"
        @compositionend="onCompositionEnd"
      />
      <VSpinner v-if="loading" class="v-input__spinner" />
      <button
        v-if="canClear"
        type="button"
        class="v-input__clear"
        aria-label="Clear"
        tabindex="-1"
        @click="clear"
      >
        <IconClose />
      </button>
      <span v-if="$slots.suffix || appendIcon" class="v-input__affix v-input__affix--suffix">
        <slot name="suffix"><component :is="appendIcon" /></slot>
      </span>
    </div>
    <div v-if="errorText || showHint || showCount" class="v-input__footer">
      <p v-if="errorText" :id="errorId" class="v-input__error" aria-live="polite">
        {{ errorText }}
      </p>
      <p v-else-if="showHint" :id="hintId" class="v-input__hint">
        <slot name="hint">{{ hint }}</slot>
      </p>
      <span v-if="showCount" class="v-input__count">
        {{ maxlength ? `${count} / ${maxlength}` : count }}
      </span>
    </div>
  </div>
</template>
