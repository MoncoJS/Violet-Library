<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { IconMinus, IconPlus } from '../../icons'
import type { ComponentSize } from '../../theme'
import { clamp } from '../../utils/dom'
import VFormField from './VFormField.vue'

export interface NumberInputProps {
  modelValue?: number | null
  id?: string
  name?: string
  label?: string
  hint?: string
  error?: string | boolean
  placeholder?: string
  min?: number
  max?: number
  step?: number
  /** Decimal places shown/rounded to. Defaults to the step's precision. */
  precision?: number
  size?: ComponentSize
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  /** Hide the -/+ buttons. */
  hideControls?: boolean
  prefix?: string
  suffix?: string
}

defineOptions({ name: 'VNumberInput', inheritAttrs: false })
const props = withDefaults(defineProps<NumberInputProps>(), {
  modelValue: null,
  min: -Infinity,
  max: Infinity,
  step: 1,
  size: 'md',
})
const emit = defineEmits<{ 'update:modelValue': [value: number | null]; blur: [e: FocusEvent] }>()

const decimals = computed(() => props.precision ?? String(props.step).split('.')[1]?.length ?? 0)
const round = (n: number) => Number(n.toFixed(decimals.value))
const format = (n: number | null | undefined) =>
  n === null || n === undefined || Number.isNaN(n) ? '' : n.toFixed(decimals.value)

const text = ref(format(props.modelValue))
watch(
  () => props.modelValue,
  (v) => {
    if (Number.parseFloat(text.value) !== v) text.value = format(v)
  },
)

function commit(n: number | null) {
  const next = n === null ? null : round(clamp(n, props.min, props.max))
  text.value = format(next)
  emit('update:modelValue', next)
}
function onInput(e: Event) {
  text.value = (e.target as HTMLInputElement).value
  const n = Number.parseFloat(text.value)
  if (text.value.trim() === '') emit('update:modelValue', null)
  else if (!Number.isNaN(n) && n >= props.min && n <= props.max) emit('update:modelValue', round(n))
}
function onBlur(e: FocusEvent) {
  const n = Number.parseFloat(text.value)
  commit(text.value.trim() === '' || Number.isNaN(n) ? null : n)
  emit('blur', e)
}
function stepBy(dir: 1 | -1, mult = 1) {
  if (props.disabled || props.readonly) return
  const base = props.modelValue ?? (Number.isFinite(props.min) ? props.min : 0)
  commit(base + dir * props.step * mult)
}
function onKeydown(e: KeyboardEvent) {
  const big = e.shiftKey ? 10 : 1
  const actions: Record<string, (() => void) | undefined> = {
    ArrowUp: () => stepBy(1, big),
    ArrowDown: () => stepBy(-1, big),
    Home: Number.isFinite(props.min) ? () => commit(props.min) : undefined,
    End: Number.isFinite(props.max) ? () => commit(props.max) : undefined,
  }
  const run = actions[e.key]
  if (run) {
    e.preventDefault()
    run()
  }
}
const atMin = computed(() => props.modelValue !== null && props.modelValue <= props.min)
const atMax = computed(() => props.modelValue !== null && props.modelValue >= props.max)
</script>

<template>
  <VFormField
    :id="id"
    v-slot="{ id: fid, describedBy, invalid }"
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    :disabled="disabled"
    :class="$attrs.class"
  >
    <div
      :class="['v-number', `v-number--${size}`, { 'is-invalid': invalid, 'is-disabled': disabled }]"
    >
      <button
        v-if="!hideControls"
        type="button"
        class="v-number__btn"
        tabindex="-1"
        aria-label="Decrease"
        :disabled="disabled || readonly || atMin"
        @click="stepBy(-1)"
      >
        <IconMinus />
      </button>
      <span v-if="prefix" class="v-number__affix">{{ prefix }}</span>
      <input
        :id="fid"
        v-bind="{ ...$attrs, class: undefined }"
        class="v-number__field"
        type="text"
        inputmode="decimal"
        role="spinbutton"
        :name="name"
        :value="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-valuenow="modelValue ?? undefined"
        :aria-valuemin="Number.isFinite(min) ? min : undefined"
        :aria-valuemax="Number.isFinite(max) ? max : undefined"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="onInput"
        @blur="onBlur"
        @keydown="onKeydown"
      />
      <span v-if="suffix" class="v-number__affix">{{ suffix }}</span>
      <button
        v-if="!hideControls"
        type="button"
        class="v-number__btn"
        tabindex="-1"
        aria-label="Increase"
        :disabled="disabled || readonly || atMax"
        @click="stepBy(1)"
      >
        <IconPlus />
      </button>
    </div>
  </VFormField>
</template>
