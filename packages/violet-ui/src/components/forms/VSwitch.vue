<script setup lang="ts">
import { computed, useId } from 'vue'
import type { ColorRole, ComponentSize } from '../../theme'
import VSpinner from '../VSpinner.vue'

export interface SwitchProps {
  modelValue?: boolean
  label?: string
  description?: string
  id?: string
  name?: string
  disabled?: boolean
  loading?: boolean
  color?: ColorRole
  size?: Extract<ComponentSize, 'sm' | 'md' | 'lg'>
  /** Put the label before the switch. */
  labelPosition?: 'start' | 'end'
}

defineOptions({ name: 'VSwitch', inheritAttrs: false })
const props = withDefaults(defineProps<SwitchProps>(), {
  color: 'primary',
  size: 'md',
  labelPosition: 'end',
})
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; change: [value: boolean] }>()
const uid = useId()
const inputId = computed(() => props.id ?? `v-switch-${uid}`)
const inert = computed(() => props.disabled || props.loading)

function toggle() {
  if (inert.value) return
  emit('update:modelValue', !props.modelValue)
  emit('change', !props.modelValue)
}
</script>

<template>
  <label
    :for="inputId"
    :class="[
      'v-switch',
      `v-switch--${color}`,
      `v-switch--${size}`,
      `v-switch--label-${labelPosition}`,
      $attrs.class,
      { 'is-on': modelValue, 'is-disabled': inert },
    ]"
  >
    <button
      :id="inputId"
      v-bind="{ ...$attrs, class: undefined }"
      type="button"
      role="switch"
      class="v-switch__track"
      :aria-checked="!!modelValue"
      :aria-busy="loading ? 'true' : undefined"
      :aria-describedby="description ? `${inputId}-desc` : undefined"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="v-switch__thumb"><VSpinner v-if="loading" size="0.75em" /></span>
    </button>
    <input v-if="name" type="hidden" :name="name" :value="modelValue ? 'on' : 'off'" />
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
