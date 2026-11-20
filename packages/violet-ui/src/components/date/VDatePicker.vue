<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { IconCalendar, IconClose } from '../../icons'
import type { ComponentSize } from '../../theme'
import { formatISO, parseTyped, today, type ISODate } from '../../utils/date'
import { useClickOutside, useFloating } from '../../utils/dom'
import VFormField from '../forms/VFormField.vue'
import VCalendar from './VCalendar.vue'

export interface DatePickerProps {
  /** ISO date `YYYY-MM-DD`. */
  modelValue?: ISODate | null
  id?: string
  name?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string | boolean
  min?: ISODate
  max?: ISODate
  isDateDisabled?: (iso: ISODate) => boolean
  locale?: string
  firstDayOfWeek?: number
  /** Intl options for the displayed text. */
  displayFormat?: Intl.DateTimeFormatOptions
  size?: ComponentSize
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  /** Render the calendar inline instead of in a popup. */
  inline?: boolean
  /** Show a "Today" shortcut. */
  showToday?: boolean
}

defineOptions({ name: 'VDatePicker', inheritAttrs: false })
const props = withDefaults(defineProps<DatePickerProps>(), {
  modelValue: null,
  firstDayOfWeek: 0,
  size: 'md',
  displayFormat: () => ({ dateStyle: 'medium' }),
  showToday: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: ISODate | null]
  change: [value: ISODate | null]
  blur: [e: FocusEvent]
}>()

const uid = useId()
const dialogId = `v-date-dialog-${uid}`
const root = ref<HTMLElement | null>(null)
const popup = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)
const calendar = ref<InstanceType<typeof VCalendar> | null>(null)
const open = ref(false)
const text = ref('')

const display = (v: ISODate | null) => formatISO(v, props.locale, props.displayFormat)
watch(
  () => props.modelValue,
  (v) => (text.value = display(v)),
  { immediate: true },
)

const { style } = useFloating(root, popup, {
  placement: () => 'bottom-start',
  open: () => open.value,
})
useClickOutside(
  [root, popup],
  () => (open.value = false),
  () => open.value,
)

function set(v: ISODate | null) {
  emit('update:modelValue', v)
  emit('change', v)
  text.value = display(v)
}
function openPopup(focusGrid = false) {
  if (props.disabled || props.readonly || props.inline) return
  open.value = true
  if (focusGrid) nextTick(() => requestAnimationFrame(() => calendar.value?.focus()))
}
function close(refocus = true) {
  open.value = false
  if (refocus) input.value?.focus()
}
function onSelect(v: ISODate | [ISODate, ISODate]) {
  set(v as ISODate)
  close()
}
function commitText() {
  if (!text.value.trim()) return set(null)
  const parsed = parseTyped(text.value, props.locale)
  const ok =
    parsed &&
    !(props.min && parsed < props.min) &&
    !(props.max && parsed > props.max) &&
    !props.isDateDisabled?.(parsed)
  if (ok) set(parsed)
  else text.value = display(props.modelValue)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || (e.key === 'Enter' && !open.value && !text.value)) {
    e.preventDefault()
    openPopup(true)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    commitText()
  } else if (e.key === 'Escape' && open.value) {
    e.stopPropagation()
    close()
  }
}
function onPopupKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.stopPropagation()
    close()
  } else if (e.key === 'Tab') close(false)
}
const canClear = computed(
  () => props.clearable && !!props.modelValue && !props.disabled && !props.readonly,
)
const pickToday = () => {
  set(today())
  close()
}
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
    <VCalendar
      v-if="inline"
      class="v-popup v-date__inline"
      :model-value="modelValue"
      :min="min"
      :max="max"
      :is-date-disabled="isDateDisabled"
      :locale="locale"
      :first-day-of-week="firstDayOfWeek"
      @update:model-value="set($event as ISODate)"
    />
    <div
      v-else
      ref="root"
      :class="[
        'v-select',
        'v-date',
        `v-select--${size}`,
        { 'is-open': open, 'is-invalid': invalid, 'is-disabled': disabled },
      ]"
    >
      <div class="v-select__trigger" @click="openPopup()">
        <input
          :id="fid"
          ref="input"
          v-bind="{ ...$attrs, class: undefined }"
          v-model="text"
          class="v-select__search"
          type="text"
          autocomplete="off"
          :name="name"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :aria-invalid="invalid ? 'true' : undefined"
          :aria-describedby="describedBy"
          aria-haspopup="dialog"
          :aria-expanded="open"
          :aria-controls="dialogId"
          @keydown="onKeydown"
          @blur="(commitText(), emit('blur', $event))"
        />
        <button
          v-if="canClear"
          type="button"
          class="v-select__clear"
          tabindex="-1"
          aria-label="Clear date"
          @click.stop="set(null)"
        >
          <IconClose />
        </button>
        <button
          type="button"
          class="v-select__clear v-date__toggle"
          :disabled="disabled || readonly"
          aria-label="Choose date"
          @click.stop="open ? close() : openPopup(true)"
        >
          <IconCalendar />
        </button>
      </div>
      <input v-if="name" type="hidden" :name="name" :value="modelValue ?? ''" />
    </div>

    <Teleport to="body">
      <Transition name="v-pop">
        <div
          v-if="open"
          :id="dialogId"
          ref="popup"
          class="v-popup v-date__popup"
          role="dialog"
          aria-modal="false"
          :aria-label="label ?? 'Choose date'"
          :style="style"
          @keydown="onPopupKeydown"
        >
          <VCalendar
            ref="calendar"
            :model-value="modelValue"
            :min="min"
            :max="max"
            :is-date-disabled="isDateDisabled"
            :locale="locale"
            :first-day-of-week="firstDayOfWeek"
            @update:model-value="onSelect"
          />
          <div v-if="showToday" class="v-date__footer">
            <button type="button" class="v-date__link" @click="pickToday">Today</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </VFormField>
</template>
