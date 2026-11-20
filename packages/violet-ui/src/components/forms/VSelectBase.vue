<script setup lang="ts">
/**
 * Shared engine behind VSelect, VMultiSelect and VAutocomplete:
 * ARIA 1.2 combobox + listbox, keyboard navigation, typeahead, filtering,
 * single / multiple selection and a teleported, auto-flipping popup.
 */
import { computed, nextTick, ref, useId, watch } from 'vue'
import { IconCheck, IconChevronDown, IconClose } from '../../icons'
import type { ComponentSize } from '../../theme'
import {
  normalizeOptions,
  useClickOutside,
  useFloating,
  type OptionInput,
  type SelectOption,
} from '../../utils/dom'
import VSpinner from '../VSpinner.vue'
import VFormField from './VFormField.vue'

export interface SelectBaseProps {
  modelValue?: unknown
  options?: readonly OptionInput[]
  optionLabel?: string
  optionValue?: string
  multiple?: boolean
  /** Text input inside the trigger that filters options (autocomplete). */
  searchable?: boolean
  /** Filter locally. Set `false` when you filter server-side via `@search`. */
  filter?: boolean
  /** Allow committing typed text that matches no option (autocomplete only). */
  allowCustom?: boolean
  id?: string
  name?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string | boolean
  size?: ComponentSize
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  clearable?: boolean
  loading?: boolean
  noDataText?: string
  /** Max chips shown before "+N" (multiple). */
  maxTags?: number
  /** Max selectable items (multiple). */
  maxSelected?: number
}

defineOptions({ name: 'VSelectBase', inheritAttrs: false })
const props = withDefaults(defineProps<SelectBaseProps>(), {
  options: () => [],
  optionLabel: 'label',
  optionValue: 'value',
  filter: true,
  size: 'md',
  noDataText: 'No options',
  maxTags: 3,
})
const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
  search: [query: string]
  open: []
  close: []
  blur: [e: FocusEvent]
}>()

const uid = useId()
const listId = `v-select-list-${uid}`
const optionId = (i: number) => `v-select-opt-${uid}-${i}`

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const popup = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref('')
const active = ref(-1)

const all = computed(() => normalizeOptions(props.options, props.optionLabel, props.optionValue))
const eq = (a: unknown, b: unknown) => Object.is(a, b) || JSON.stringify(a) === JSON.stringify(b)
const selectedValues = computed<unknown[]>(() =>
  props.multiple
    ? Array.isArray(props.modelValue)
      ? props.modelValue
      : []
    : props.modelValue === undefined || props.modelValue === null || props.modelValue === ''
      ? []
      : [props.modelValue],
)
const isSelected = (o: SelectOption) => selectedValues.value.some((v) => eq(v, o.value))
const selectedOptions = computed(() =>
  selectedValues.value.map(
    (v) =>
      all.value.find((o) => eq(o.value, v)) ?? ({ label: String(v), value: v } as SelectOption),
  ),
)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!props.searchable || !props.filter || !q) return all.value
  return all.value.filter((o) => o.label.toLowerCase().includes(q))
})
const limitReached = computed(
  () => !!props.multiple && !!props.maxSelected && selectedValues.value.length >= props.maxSelected,
)
const isDisabledOption = (o: SelectOption) => !!o.disabled || (limitReached.value && !isSelected(o))

const { style: popupStyle } = useFloating(trigger, popup, {
  placement: () => 'bottom-start',
  open: () => open.value,
  matchWidth: true,
})
useClickOutside(
  [root, popup],
  () => close(),
  () => open.value,
)

function openList() {
  if (open.value || props.disabled || props.readonly) return
  open.value = true
  const firstSelected = filtered.value.findIndex((o) => isSelected(o))
  active.value = firstSelected >= 0 ? firstSelected : firstEnabled(0, 1)
  emit('open')
  nextTick(scrollActive)
}
function close() {
  if (!open.value) return
  open.value = false
  active.value = -1
  if (props.searchable && !props.multiple && !props.allowCustom)
    query.value = selectedOptions.value[0]?.label ?? ''
  emit('close')
}
const toggleOpen = () => (open.value ? close() : openList())

function firstEnabled(from: number, dir: 1 | -1) {
  const list = filtered.value
  for (let i = from; i >= 0 && i < list.length; i += dir) if (!isDisabledOption(list[i]!)) return i
  return -1
}
function move(dir: 1 | -1) {
  const list = filtered.value
  if (!list.length) return
  let i = active.value
  for (let n = 0; n < list.length; n++) {
    i = (i + dir + list.length) % list.length
    if (!isDisabledOption(list[i]!)) break
  }
  active.value = i
  nextTick(scrollActive)
}
function scrollActive() {
  document.getElementById(optionId(active.value))?.scrollIntoView?.({ block: 'nearest' })
}

function update(v: unknown) {
  emit('update:modelValue', v)
  emit('change', v)
}
function choose(o: SelectOption) {
  if (isDisabledOption(o)) return
  if (props.multiple) {
    const next = isSelected(o)
      ? selectedValues.value.filter((v) => !eq(v, o.value))
      : [...selectedValues.value, o.value]
    update(next)
    if (props.searchable) query.value = ''
    searchInput.value?.focus()
  } else {
    update(o.value)
    if (props.searchable) query.value = o.label
    close()
    ;(props.searchable ? searchInput.value : trigger.value)?.focus()
  }
}
function remove(v: unknown) {
  update(selectedValues.value.filter((x) => !eq(x, v)))
}
function clear() {
  query.value = ''
  update(props.multiple ? [] : null)
  ;(props.searchable ? searchInput.value : trigger.value)?.focus()
}

function jumpTo(i: number, e: KeyboardEvent) {
  e.preventDefault()
  active.value = i
  nextTick(scrollActive)
}

let typeahead = ''
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined
function onKeydown(e: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (!open.value) openList()
      else move(1)
      break
    case 'ArrowUp':
      e.preventDefault()
      if (!open.value) openList()
      else move(-1)
      break
    case 'Home':
      if (open.value && !props.searchable) jumpTo(firstEnabled(0, 1), e)
      break
    case 'End':
      if (open.value && !props.searchable) jumpTo(firstEnabled(filtered.value.length - 1, -1), e)
      break
    case 'Enter': {
      if (!open.value) return openList()
      e.preventDefault()
      const o = filtered.value[active.value]
      if (o) choose(o)
      else if (props.allowCustom && query.value.trim()) {
        const custom = query.value.trim()
        if (props.multiple) {
          update([...selectedValues.value, custom])
          query.value = ''
        } else {
          update(custom)
          close()
        }
      }
      break
    }
    case ' ':
      if (props.searchable) return
      e.preventDefault()
      if (!open.value) openList()
      else if (filtered.value[active.value]) choose(filtered.value[active.value]!)
      break
    case 'Escape':
      if (open.value) {
        e.preventDefault()
        e.stopPropagation()
        close()
      }
      break
    case 'Tab':
      close()
      break
    case 'Backspace':
      if (props.multiple && props.searchable && !query.value && selectedValues.value.length)
        remove(selectedValues.value[selectedValues.value.length - 1])
      break
    default:
      if (!props.searchable && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        clearTimeout(typeaheadTimer)
        typeahead += e.key.toLowerCase()
        typeaheadTimer = setTimeout(() => (typeahead = ''), 500)
        const i = filtered.value.findIndex(
          (o) => !isDisabledOption(o) && o.label.toLowerCase().startsWith(typeahead),
        )
        if (i >= 0) {
          if (!open.value) openList()
          active.value = i
          nextTick(scrollActive)
        }
      }
  }
}

function onSearchInput(e: Event) {
  query.value = (e.target as HTMLInputElement).value
  emit('search', query.value)
  if (!open.value) openList()
  active.value = firstEnabled(0, 1)
  if (!props.multiple && !query.value && !props.allowCustom) update(null)
}

// keep the text in sync with external changes (single autocomplete)
watch(
  () => [props.modelValue, all.value] as const,
  () => {
    if (props.searchable && !props.multiple && !open.value)
      query.value =
        selectedOptions.value[0]?.label ?? (props.allowCustom ? String(props.modelValue ?? '') : '')
  },
  { immediate: true },
)

const hasValue = computed(() => selectedValues.value.length > 0)
const canClear = computed(
  () => props.clearable && hasValue.value && !props.disabled && !props.readonly,
)
const visibleTags = computed(() => selectedOptions.value.slice(0, props.maxTags))
const hiddenCount = computed(() => Math.max(0, selectedOptions.value.length - props.maxTags))
const activeDescendant = computed(() =>
  open.value && active.value >= 0 ? optionId(active.value) : undefined,
)

defineExpose({ open: openList, close, focus: () => (searchInput.value ?? trigger.value)?.focus() })
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
        `v-select--${size}`,
        {
          'is-open': open,
          'is-invalid': invalid,
          'is-disabled': disabled,
          'is-multiple': multiple,
          'is-searchable': searchable,
        },
      ]"
    >
      <div
        :id="searchable ? undefined : fid"
        ref="trigger"
        class="v-select__trigger"
        :role="searchable ? undefined : 'combobox'"
        :tabindex="searchable || disabled ? undefined : 0"
        :aria-haspopup="searchable ? undefined : 'listbox'"
        :aria-expanded="searchable ? undefined : open"
        :aria-controls="searchable ? undefined : listId"
        :aria-activedescendant="searchable ? undefined : activeDescendant"
        :aria-invalid="!searchable && invalid ? 'true' : undefined"
        :aria-describedby="searchable ? undefined : describedBy"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-required="required ? 'true' : undefined"
        @click="searchable ? openList() : toggleOpen()"
        @keydown="searchable ? undefined : onKeydown($event)"
        @blur="emit('blur', $event)"
      >
        <div class="v-select__values">
          <template v-if="multiple">
            <span v-for="o in visibleTags" :key="String(o.value)" class="v-select__tag">
              <span class="v-select__tag-label">{{ o.label }}</span>
              <button
                v-if="!disabled && !readonly"
                type="button"
                class="v-select__tag-remove"
                tabindex="-1"
                :aria-label="`Remove ${o.label}`"
                @click.stop="remove(o.value)"
              >
                <IconClose />
              </button>
            </span>
            <span v-if="hiddenCount" class="v-select__tag v-select__tag--more"
              >+{{ hiddenCount }}</span
            >
          </template>
          <input
            v-if="searchable"
            :id="fid"
            ref="searchInput"
            v-bind="{ ...$attrs, class: undefined }"
            class="v-select__search"
            type="text"
            role="combobox"
            autocomplete="off"
            aria-autocomplete="list"
            :name="name"
            :value="query"
            :placeholder="multiple && hasValue ? '' : placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :aria-expanded="open"
            :aria-controls="listId"
            :aria-activedescendant="activeDescendant"
            :aria-invalid="invalid ? 'true' : undefined"
            :aria-describedby="describedBy"
            :aria-required="required ? 'true' : undefined"
            @input="onSearchInput"
            @keydown="onKeydown"
            @focus="openList"
            @blur="emit('blur', $event)"
          />
          <template v-else-if="!multiple">
            <span v-if="hasValue" class="v-select__value">
              <slot name="selection" :option="selectedOptions[0]">{{
                selectedOptions[0]?.label
              }}</slot>
            </span>
            <span v-else class="v-select__placeholder">{{ placeholder }}</span>
          </template>
          <span v-else-if="!hasValue" class="v-select__placeholder">{{ placeholder }}</span>
        </div>
        <VSpinner v-if="loading" class="v-select__icon" />
        <button
          v-if="canClear"
          type="button"
          class="v-select__clear"
          tabindex="-1"
          aria-label="Clear selection"
          @click.stop="clear"
        >
          <IconClose />
        </button>
        <span class="v-select__icon v-select__chevron" aria-hidden="true"><IconChevronDown /></span>
      </div>
      <input
        v-if="name && !searchable"
        type="hidden"
        :name="name"
        :value="multiple ? JSON.stringify(selectedValues) : (modelValue ?? '')"
      />
    </div>

    <Teleport to="body">
      <Transition name="v-pop">
        <div v-if="open" ref="popup" class="v-select__popup v-popup" :style="popupStyle">
          <ul
            :id="listId"
            role="listbox"
            class="v-select__list"
            :aria-multiselectable="multiple ? 'true' : undefined"
            :aria-label="label"
            tabindex="-1"
          >
            <li
              v-for="(o, i) in filtered"
              :id="optionId(i)"
              :key="String(o.value)"
              role="option"
              :aria-selected="isSelected(o)"
              :aria-disabled="isDisabledOption(o) ? 'true' : undefined"
              :class="[
                'v-select__option',
                {
                  'is-active': i === active,
                  'is-selected': isSelected(o),
                  'is-disabled': isDisabledOption(o),
                },
              ]"
              @mousedown.prevent
              @mousemove="!isDisabledOption(o) && (active = i)"
              @click="choose(o)"
            >
              <span v-if="multiple" class="v-select__check" aria-hidden="true">
                <IconCheck v-if="isSelected(o)" />
              </span>
              <span class="v-select__option-text">
                <slot name="option" :option="o" :selected="isSelected(o)">
                  <span class="v-select__option-label">{{ o.label }}</span>
                  <span v-if="o.description" class="v-select__option-desc">{{
                    o.description
                  }}</span>
                </slot>
              </span>
              <IconCheck v-if="!multiple && isSelected(o)" class="v-select__tick" />
            </li>
            <li v-if="!filtered.length" class="v-select__empty" role="presentation">
              <slot name="empty">{{
                loading
                  ? 'Loading…'
                  : allowCustom && query
                    ? `Press Enter to add “${query}”`
                    : noDataText
              }}</slot>
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </VFormField>
</template>
