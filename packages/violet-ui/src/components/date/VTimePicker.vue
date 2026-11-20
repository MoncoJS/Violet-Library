<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { IconClock, IconClose } from '../../icons'
import type { ComponentSize } from '../../theme'
import { useClickOutside, useFloating } from '../../utils/dom'
import VFormField from '../forms/VFormField.vue'

export interface TimePickerProps {
  /** `HH:mm` (24h) */
  modelValue?: string | null
  id?: string
  name?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string | boolean
  /** Minute increments shown in the list. */
  minuteStep?: number
  /** Display 12-hour clock with AM/PM. */
  hour12?: boolean
  min?: string
  max?: string
  size?: ComponentSize
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
}

defineOptions({ name: 'VTimePicker', inheritAttrs: false })
const props = withDefaults(defineProps<TimePickerProps>(), {
  modelValue: null,
  minuteStep: 5,
  size: 'md',
  placeholder: '--:--',
})
const emit = defineEmits<{
  'update:modelValue': [value: string | null]
  change: [value: string | null]
}>()

const uid = useId()
const listId = `v-time-${uid}`
const root = ref<HTMLElement | null>(null)
const popup = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const open = ref(false)
const text = ref('')

const pad = (n: number) => String(n).padStart(2, '0')
const parse = (s: string | null | undefined) => {
  const m = /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i.exec(s?.trim() ?? '')
  if (!m) return null
  let h = Number(m[1])
  const min = Number(m[2])
  if (m[3]) h = (h % 12) + (m[3].toLowerCase() === 'pm' ? 12 : 0)
  return h < 24 && min < 60 ? `${pad(h)}:${pad(min)}` : null
}
const display = (v: string | null | undefined) => {
  if (!v) return ''
  if (!props.hour12) return v
  const [h, m] = v.split(':').map(Number) as [number, number]
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`
}
watch(
  () => props.modelValue,
  (v) => (text.value = display(v)),
  { immediate: true },
)

const outOfRange = (v: string) => (!!props.min && v < props.min) || (!!props.max && v > props.max)
const slots = computed(() => {
  const out: string[] = []
  for (let m = 0; m < 24 * 60; m += props.minuteStep) {
    const v = `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
    if (!outOfRange(v)) out.push(v)
  }
  return out
})
const active = ref(-1)

const { style } = useFloating(root, popup, {
  placement: () => 'bottom-start',
  open: () => open.value,
  matchWidth: true,
})
useClickOutside(
  [root, popup],
  () => (open.value = false),
  () => open.value,
)

function set(v: string | null) {
  emit('update:modelValue', v)
  emit('change', v)
  text.value = display(v)
}
function show() {
  if (props.disabled || props.readonly) return
  open.value = true
  const target =
    props.modelValue ??
    slots.value.find((s) => s >= new Date().toTimeString().slice(0, 5)) ??
    slots.value[0]
  active.value = Math.max(
    0,
    slots.value.findIndex((s) => s >= (target ?? '')),
  )
  nextTick(() => requestAnimationFrame(scroll))
}
function scroll() {
  popup.value
    ?.querySelector(`[data-index="${active.value}"]`)
    ?.scrollIntoView?.({ block: 'center' })
}
function pick(v: string) {
  set(v)
  open.value = false
  input.value?.focus()
}
function commit() {
  if (!text.value.trim()) return set(null)
  const v = parse(text.value)
  if (v && !outOfRange(v)) set(v)
  else text.value = display(props.modelValue)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!open.value) return show()
    active.value = Math.min(
      slots.value.length - 1,
      Math.max(0, active.value + (e.key === 'ArrowDown' ? 1 : -1)),
    )
    nextTick(() =>
      popup.value
        ?.querySelector(`[data-index="${active.value}"]`)
        ?.scrollIntoView?.({ block: 'nearest' }),
    )
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (open.value && slots.value[active.value]) pick(slots.value[active.value]!)
    else commit()
  } else if (e.key === 'Escape' && open.value) {
    e.stopPropagation()
    open.value = false
  }
}
const canClear = computed(
  () => props.clearable && !!props.modelValue && !props.disabled && !props.readonly,
)
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
      ref="root"
      :class="[
        'v-select',
        'v-time',
        `v-select--${size}`,
        { 'is-open': open, 'is-invalid': invalid, 'is-disabled': disabled },
      ]"
    >
      <div class="v-select__trigger" @click="show">
        <span class="v-select__icon"><IconClock /></span>
        <input
          :id="fid"
          ref="input"
          v-bind="{ ...$attrs, class: undefined }"
          v-model="text"
          class="v-select__search"
          type="text"
          role="combobox"
          autocomplete="off"
          :name="name"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :aria-expanded="open"
          :aria-controls="listId"
          :aria-activedescendant="open && active >= 0 ? `${listId}-${active}` : undefined"
          :aria-invalid="invalid ? 'true' : undefined"
          :aria-describedby="describedBy"
          @keydown="onKeydown"
          @blur="commit"
        />
        <button
          v-if="canClear"
          type="button"
          class="v-select__clear"
          tabindex="-1"
          aria-label="Clear time"
          @click.stop="set(null)"
        >
          <IconClose />
        </button>
      </div>
    </div>
    <Teleport to="body">
      <Transition name="v-pop">
        <div v-if="open" ref="popup" class="v-popup" :style="style">
          <ul :id="listId" class="v-select__list" role="listbox" :aria-label="label ?? 'Time'">
            <li
              v-for="(s, i) in slots"
              :id="`${listId}-${i}`"
              :key="s"
              :data-index="i"
              role="option"
              :aria-selected="s === modelValue"
              :class="[
                'v-select__option',
                'v-time__option',
                { 'is-active': i === active, 'is-selected': s === modelValue },
              ]"
              @mousedown.prevent
              @mousemove="active = i"
              @click="pick(s)"
            >
              {{ display(s) }}
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </VFormField>
</template>
