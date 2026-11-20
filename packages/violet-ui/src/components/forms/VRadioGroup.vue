<script setup lang="ts">
import { computed, provide, useId } from 'vue'
import type { ColorRole } from '../../theme'
import { normalizeOptions, type OptionInput } from '../../utils/dom'
import { RADIO_GROUP_KEY } from './context'
import VFormField from './VFormField.vue'
import VRadio from './VRadio.vue'

export interface RadioGroupProps {
  modelValue?: unknown
  options?: readonly OptionInput[]
  label?: string
  hint?: string
  error?: string | boolean
  name?: string
  disabled?: boolean
  required?: boolean
  inline?: boolean
  color?: ColorRole
  /** Render options as a segmented card list. */
  variant?: 'default' | 'cards'
}

defineOptions({ name: 'VRadioGroup' })
const props = withDefaults(defineProps<RadioGroupProps>(), { color: 'primary', variant: 'default' })
const emit = defineEmits<{ 'update:modelValue': [value: unknown]; change: [value: unknown] }>()
const uid = useId()

provide(RADIO_GROUP_KEY, {
  value: computed(() => props.modelValue),
  select: (v) => {
    emit('update:modelValue', v)
    emit('change', v)
  },
  disabled: computed(() => !!props.disabled),
  invalid: computed(() => !!props.error),
  name: computed(() => props.name ?? `v-radio-group-${uid}`),
  color: computed(() => props.color),
  required: computed(() => !!props.required),
})
const opts = computed(() => normalizeOptions(props.options ?? []))
</script>

<template>
  <VFormField
    group
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    :disabled="disabled"
  >
    <div
      role="radiogroup"
      :class="[
        'v-choice-group',
        `v-choice-group--${variant}`,
        { 'v-choice-group--inline': inline },
      ]"
    >
      <VRadio
        v-for="o in opts"
        :key="String(o.value)"
        :value="o.value"
        :label="o.label"
        :description="o.description"
        :disabled="o.disabled"
      />
      <slot />
    </div>
  </VFormField>
</template>
