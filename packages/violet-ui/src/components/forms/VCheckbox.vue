<script setup lang="ts">
import { computed, inject, onMounted, ref, useId, watch } from 'vue'
import { IconCheck, IconMinus } from '../../icons'
import type { ColorRole, ComponentSize } from '../../theme'
import { CHECKBOX_GROUP_KEY } from './context'

export interface CheckboxProps {
  modelValue?: boolean | unknown[]
  /** Value used inside a VCheckboxGroup or with an array v-model. */
  value?: unknown
  label?: string
  description?: string
  id?: string
  name?: string
  indeterminate?: boolean
  disabled?: boolean
  required?: boolean
  error?: string | boolean
  color?: ColorRole
  size?: Extract<ComponentSize, 'sm' | 'md' | 'lg'>
  /** Ignore a surrounding VCheckboxGroup (e.g. a "select all" control). */
  standalone?: boolean
}

defineOptions({ name: 'VCheckbox', inheritAttrs: false })
const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: undefined,
  value: () => true,
  color: 'primary',
  size: 'md',
})
const emit = defineEmits<{
  'update:modelValue': [value: boolean | unknown[]]
  change: [checked: boolean]
}>()
const group = props.standalone ? null : inject(CHECKBOX_GROUP_KEY, null)
const uid = useId()
const inputId = computed(() => props.id ?? `v-checkbox-${uid}`)
const input = ref<HTMLInputElement | null>(null)

const checked = computed(() => {
  if (group) return group.isChecked(props.value)
  if (Array.isArray(props.modelValue)) return props.modelValue.includes(props.value)
  return !!props.modelValue
})
const isDisabled = computed(() => props.disabled || !!group?.disabled.value)
const invalid = computed(() => !!props.error || !!group?.invalid.value)

function onChange(e: Event) {
  const on = (e.target as HTMLInputElement).checked
  if (group) group.toggle(props.value, on)
  else if (Array.isArray(props.modelValue))
    emit(
      'update:modelValue',
      on ? [...props.modelValue, props.value] : props.modelValue.filter((v) => v !== props.value),
    )
  else emit('update:modelValue', on)
  emit('change', on)
}

const syncIndeterminate = () => input.value && (input.value.indeterminate = !!props.indeterminate)
onMounted(syncIndeterminate)
watch(() => props.indeterminate, syncIndeterminate)
</script>

<template>
  <label
    :for="inputId"
    :class="[
      'v-check',
      `v-check--${color}`,
      `v-check--${size}`,
      $attrs.class,
      { 'is-checked': checked || indeterminate, 'is-disabled': isDisabled, 'is-invalid': invalid },
    ]"
  >
    <input
      :id="inputId"
      ref="input"
      v-bind="{ ...$attrs, class: undefined }"
      class="v-check__input"
      type="checkbox"
      :name="name ?? group?.name.value"
      :checked="checked"
      :disabled="isDisabled"
      :required="required"
      :aria-checked="indeterminate ? 'mixed' : undefined"
      :aria-invalid="invalid ? 'true' : undefined"
      :aria-describedby="description ? `${inputId}-desc` : undefined"
      @change="onChange"
    />
    <span class="v-check__box" aria-hidden="true">
      <IconMinus v-if="indeterminate" stroke-width="3" />
      <IconCheck v-else-if="checked" stroke-width="3" />
    </span>
    <span v-if="label || description || $slots.default" class="v-check__text">
      <span class="v-check__label"
        ><slot>{{ label }}</slot></span
      >
      <span v-if="description" :id="`${inputId}-desc`" class="v-check__desc">{{
        description
      }}</span>
    </span>
  </label>
</template>
