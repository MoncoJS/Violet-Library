<script setup lang="ts">
import { computed, inject, useId } from 'vue'
import type { ColorRole, ComponentSize } from '../../theme'
import { RADIO_GROUP_KEY } from './context'

export interface RadioProps {
  modelValue?: unknown
  value: unknown
  label?: string
  description?: string
  id?: string
  name?: string
  disabled?: boolean
  color?: ColorRole
  size?: Extract<ComponentSize, 'sm' | 'md' | 'lg'>
}

defineOptions({ name: 'VRadio', inheritAttrs: false })
const props = withDefaults(defineProps<RadioProps>(), { modelValue: undefined, size: 'md' })
const emit = defineEmits<{ 'update:modelValue': [value: unknown] }>()
const group = inject(RADIO_GROUP_KEY, null)
const uid = useId()
const inputId = computed(() => props.id ?? `v-radio-${uid}`)

const checked = computed(() => (group ? group.value.value : props.modelValue) === props.value)
const isDisabled = computed(() => props.disabled || !!group?.disabled.value)
const color = computed(() => props.color ?? group?.color.value ?? 'primary')

function select() {
  if (group) group.select(props.value)
  else emit('update:modelValue', props.value)
}
</script>

<template>
  <label
    :for="inputId"
    :class="[
      'v-check',
      'v-check--radio',
      `v-check--${color}`,
      `v-check--${size}`,
      $attrs.class,
      { 'is-checked': checked, 'is-disabled': isDisabled, 'is-invalid': group?.invalid.value },
    ]"
  >
    <input
      :id="inputId"
      v-bind="{ ...$attrs, class: undefined }"
      class="v-check__input"
      type="radio"
      :name="name ?? group?.name.value"
      :value="typeof value === 'string' || typeof value === 'number' ? value : undefined"
      :checked="checked"
      :disabled="isDisabled"
      :required="group?.required.value"
      :aria-describedby="description ? `${inputId}-desc` : undefined"
      @change="select"
    />
    <span class="v-check__box" aria-hidden="true"><span class="v-check__dot" /></span>
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
