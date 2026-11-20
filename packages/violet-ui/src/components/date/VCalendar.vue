<script setup lang="ts">
/**
 * Month grid used by VDatePicker / VDateRangePicker (also usable inline).
 * Implements the WAI-ARIA date-grid keyboard model: arrows, Home/End,
 * PageUp/PageDown (Shift = year), Enter/Space to select.
 */
import { computed, nextTick, ref, watch } from 'vue'
import { IconChevronLeft, IconChevronRight } from '../../icons'
import {
  addDays,
  addMonths,
  isBetween,
  monthGrid,
  monthName,
  parseISO,
  today,
  weekdayNames,
  type ISODate,
} from '../../utils/date'

export interface CalendarProps {
  /** Single date, or `[start, end]` in range mode. */
  modelValue?: ISODate | null | [ISODate | null, ISODate | null]
  range?: boolean
  min?: ISODate
  max?: ISODate
  isDateDisabled?: (iso: ISODate) => boolean
  locale?: string
  /** 0 = Sunday … 6 = Saturday */
  firstDayOfWeek?: number
  /** Number of months side by side. */
  months?: number
}

defineOptions({ name: 'VCalendar' })
const props = withDefaults(defineProps<CalendarProps>(), { firstDayOfWeek: 0, months: 1 })
const emit = defineEmits<{
  'update:modelValue': [value: ISODate | [ISODate, ISODate]]
  select: [iso: ISODate]
}>()

const startValue = computed(() =>
  Array.isArray(props.modelValue)
    ? props.modelValue[0]
    : (props.modelValue as ISODate | null | undefined),
)
const endValue = computed(() => (Array.isArray(props.modelValue) ? props.modelValue[1] : null))

const initial =
  parseISO(startValue.value) ?? parseISO(props.min && props.min > today() ? props.min : today())!
const view = ref({ year: initial.getFullYear(), month: initial.getMonth() })
const focusIso = ref<ISODate>(startValue.value ?? toFocusable(today()))
const pendingStart = ref<ISODate | null>(null)
const hoverIso = ref<ISODate | null>(null)
const root = ref<HTMLElement | null>(null)

function toFocusable(iso: ISODate) {
  if (props.min && iso < props.min) return props.min
  if (props.max && iso > props.max) return props.max
  return iso
}

watch(startValue, (v) => {
  if (!v) return
  const d = parseISO(v)!
  focusIso.value = v
  view.value = { year: d.getFullYear(), month: d.getMonth() }
})

const panels = computed(() =>
  Array.from({ length: props.months }, (_, i) => {
    const { year, month } = addMonths(view.value.year, view.value.month, i)
    return {
      year,
      month,
      title: monthName(props.locale, year, month),
      days: monthGrid(year, month, props.firstDayOfWeek),
    }
  }),
)
const weekdays = computed(() => weekdayNames(props.locale, props.firstDayOfWeek, 'short'))
const todayIso = today()

const disabled = (iso: ISODate) =>
  (!!props.min && iso < props.min) ||
  (!!props.max && iso > props.max) ||
  !!props.isDateDisabled?.(iso)

const rangeStart = computed(() => (props.range ? (pendingStart.value ?? startValue.value) : null))
const rangeEnd = computed(() =>
  props.range ? (pendingStart.value ? hoverIso.value : endValue.value) : null,
)
const isSelected = (iso: ISODate) =>
  props.range ? iso === rangeStart.value || iso === rangeEnd.value : iso === startValue.value
const inRange = (iso: ISODate) => props.range && isBetween(iso, rangeStart.value, rangeEnd.value)

function select(iso: ISODate) {
  if (disabled(iso)) return
  focusIso.value = iso
  if (!props.range) {
    emit('update:modelValue', iso)
    emit('select', iso)
    return
  }
  if (!pendingStart.value) {
    pendingStart.value = iso
    hoverIso.value = iso
    return
  }
  const [a, b] = [pendingStart.value, iso].sort() as [ISODate, ISODate]
  pendingStart.value = null
  emit('update:modelValue', [a, b])
  emit('select', iso)
}

function shiftMonth(n: number) {
  view.value = addMonths(view.value.year, view.value.month, n)
}

function moveFocus(iso: ISODate) {
  focusIso.value = iso
  const d = parseISO(iso)!
  const first = new Date(view.value.year, view.value.month, 1)
  const last = new Date(view.value.year, view.value.month + props.months, 0)
  if (d < first || d > last) view.value = { year: d.getFullYear(), month: d.getMonth() }
  if (pendingStart.value) hoverIso.value = iso
  nextTick(() => root.value?.querySelector<HTMLElement>(`[data-iso="${iso}"]`)?.focus())
}

function onKeydown(e: KeyboardEvent) {
  const cur = focusIso.value
  const d = parseISO(cur)!
  const jump = (months: number) => {
    const t = new Date(d.getFullYear(), d.getMonth() + months, 1)
    const dim = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(Math.min(d.getDate(), dim)).padStart(2, '0')}`
  }
  const dow = (d.getDay() - props.firstDayOfWeek + 7) % 7
  const map: Record<string, () => ISODate> = {
    ArrowLeft: () => addDays(cur, -1),
    ArrowRight: () => addDays(cur, 1),
    ArrowUp: () => addDays(cur, -7),
    ArrowDown: () => addDays(cur, 7),
    Home: () => addDays(cur, -dow),
    End: () => addDays(cur, 6 - dow),
    PageUp: () => jump(e.shiftKey ? -12 : -1),
    PageDown: () => jump(e.shiftKey ? 12 : 1),
  }
  if (map[e.key]) {
    e.preventDefault()
    moveFocus(map[e.key]!())
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    select(cur)
  }
}

defineExpose({
  focus: () => moveFocus(focusIso.value),
})
</script>

<template>
  <div ref="root" class="v-calendar" @keydown="onKeydown">
    <div v-for="(p, pi) in panels" :key="`${p.year}-${p.month}`" class="v-calendar__panel">
      <div class="v-calendar__header">
        <button
          v-if="pi === 0"
          type="button"
          class="v-calendar__nav"
          aria-label="Previous month"
          @click="shiftMonth(-1)"
        >
          <IconChevronLeft />
        </button>
        <span v-else class="v-calendar__nav-spacer" />
        <span class="v-calendar__title" aria-live="polite">{{ p.title }}</span>
        <button
          v-if="pi === panels.length - 1"
          type="button"
          class="v-calendar__nav"
          aria-label="Next month"
          @click="shiftMonth(1)"
        >
          <IconChevronRight />
        </button>
        <span v-else class="v-calendar__nav-spacer" />
      </div>
      <table class="v-calendar__grid" role="grid" :aria-label="p.title">
        <thead>
          <tr>
            <th v-for="w in weekdays" :key="w" scope="col" :abbr="w">{{ w.slice(0, 2) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in 6" :key="row">
            <td
              v-for="cell in p.days.slice((row - 1) * 7, row * 7)"
              :key="cell.iso"
              role="gridcell"
              :aria-selected="isSelected(cell.iso)"
            >
              <button
                v-if="cell.inMonth"
                type="button"
                :data-iso="cell.iso"
                :tabindex="cell.iso === focusIso ? 0 : -1"
                :disabled="disabled(cell.iso)"
                :aria-current="cell.iso === todayIso ? 'date' : undefined"
                :aria-label="cell.iso"
                :class="[
                  'v-calendar__day',
                  {
                    'is-today': cell.iso === todayIso,
                    'is-selected': isSelected(cell.iso),
                    'is-in-range': inRange(cell.iso),
                    'is-range-start': range && cell.iso === rangeStart,
                    'is-range-end': range && cell.iso === rangeEnd,
                  },
                ]"
                @click="select(cell.iso)"
                @mouseenter="pendingStart && (hoverIso = cell.iso)"
              >
                {{ cell.day }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
