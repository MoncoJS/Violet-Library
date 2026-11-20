<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { IconCalendar, IconClose } from '../../icons'
import type { ComponentSize } from '../../theme'
import { addDays, formatISO, today, type ISODate } from '../../utils/date'
import { useClickOutside, useFloating } from '../../utils/dom'
import VFormField from '../forms/VFormField.vue'
import VCalendar from './VCalendar.vue'

export type DateRange = [ISODate | null, ISODate | null]
export interface DateRangePreset {
  label: string
  value: () => [ISODate, ISODate]
}

export interface DateRangePickerProps {
  modelValue?: DateRange | null
  id?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string | boolean
  min?: ISODate
  max?: ISODate
  isDateDisabled?: (iso: ISODate) => boolean
  locale?: string
  firstDayOfWeek?: number
  displayFormat?: Intl.DateTimeFormatOptions
  size?: ComponentSize
  disabled?: boolean
  required?: boolean
  clearable?: boolean
  /** Side-by-side months. Default 2 (1 on narrow screens via CSS). */
  months?: number
  /** Quick ranges; `true` uses the built-in set. */
  presets?: DateRangePreset[] | boolean
}

defineOptions({ name: 'VDateRangePicker', inheritAttrs: false })
const props = withDefaults(defineProps<DateRangePickerProps>(), {
  modelValue: null,
  firstDayOfWeek: 0,
  size: 'md',
  months: 2,
  placeholder: 'Select range',
  displayFormat: () => ({ dateStyle: 'medium' }),
  presets: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: DateRange | null]
  change: [value: DateRange | null]
}>()

const uid = useId()
const dialogId = `v-range-dialog-${uid}`
const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const popup = ref<HTMLElement | null>(null)
const calendar = ref<InstanceType<typeof VCalendar> | null>(null)
const open = ref(false)

const { style } = useFloating(root, popup, {
  placement: () => 'bottom-start',
  open: () => open.value,
})
useClickOutside(
  [root, popup],
  () => (open.value = false),
  () => open.value,
)

const builtInPresets: DateRangePreset[] = [
  { label: 'Today', value: () => [today(), today()] },
  { label: 'Last 7 days', value: () => [addDays(today(), -6), today()] },
  { label: 'Last 30 days', value: () => [addDays(today(), -29), today()] },
  {
    label: 'This month',
    value: () => {
      const t = today()
      return [`${t.slice(0, 8)}01`, t]
    },
  },
]
const presetList = computed(() =>
  props.presets === true ? builtInPresets : Array.isArray(props.presets) ? props.presets : [],
)

const text = computed(() => {
  const [a, b] = props.modelValue ?? [null, null]
  if (!a) return ''
  const f = (v: ISODate | null) => formatISO(v, props.locale, props.displayFormat)
  return b ? `${f(a)} – ${f(b)}` : f(a)
})

function set(v: DateRange | null) {
  emit('update:modelValue', v)
  emit('change', v)
}
function show() {
  if (props.disabled) return
  open.value = true
  nextTick(() => requestAnimationFrame(() => calendar.value?.focus()))
}
function close() {
  open.value = false
  trigger.value?.focus()
}
function onSelect(v: unknown) {
  set(v as DateRange)
  close()
}
const canClear = computed(() => props.clearable && !!props.modelValue?.[0] && !props.disabled)
// Two months need ~680px; fall back to one on narrow viewports.
const visibleMonths = ref(props.months)
watch(
  open,
  (v) =>
    v &&
    (visibleMonths.value =
      typeof window !== 'undefined' && window.innerWidth < 760 ? 1 : props.months),
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
        'v-date',
        `v-select--${size}`,
        { 'is-open': open, 'is-invalid': invalid, 'is-disabled': disabled },
      ]"
    >
      <button
        :id="fid"
        ref="trigger"
        v-bind="{ ...$attrs, class: undefined }"
        type="button"
        class="v-select__trigger v-date__button"
        aria-haspopup="dialog"
        :aria-expanded="open"
        :aria-controls="dialogId"
        :aria-describedby="describedBy"
        :aria-invalid="invalid ? 'true' : undefined"
        :disabled="disabled"
        @click="open ? close() : show()"
      >
        <span class="v-select__icon"><IconCalendar /></span>
        <span class="v-select__values">
          <span v-if="text" class="v-select__value">{{ text }}</span>
          <span v-else class="v-select__placeholder">{{ placeholder }}</span>
        </span>
        <span
          v-if="canClear"
          role="button"
          tabindex="-1"
          class="v-select__clear"
          aria-label="Clear range"
          @click.stop="set(null)"
        >
          <IconClose />
        </span>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="v-pop">
        <div
          v-if="open"
          :id="dialogId"
          ref="popup"
          class="v-popup v-date__popup v-date__popup--range"
          role="dialog"
          :aria-label="label ?? 'Choose date range'"
          :style="style"
          @keydown.esc.stop="close"
        >
          <ul v-if="presetList.length" class="v-date__presets" role="list">
            <li v-for="p in presetList" :key="p.label">
              <button type="button" class="v-date__preset" @click="onSelect(p.value())">
                {{ p.label }}
              </button>
            </li>
          </ul>
          <VCalendar
            ref="calendar"
            range
            :model-value="modelValue ?? [null, null]"
            :months="visibleMonths"
            :min="min"
            :max="max"
            :is-date-disabled="isDateDisabled"
            :locale="locale"
            :first-day-of-week="firstDayOfWeek"
            @update:model-value="onSelect"
          />
        </div>
      </Transition>
    </Teleport>
  </VFormField>
</template>
