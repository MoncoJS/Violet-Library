<script setup lang="ts">
import { computed, provide } from 'vue'
import { normalizeOptions, type OptionInput } from '../../utils/dom'
import { CHECKBOX_GROUP_KEY } from './context'
import VCheckbox from './VCheckbox.vue'
import VFormField from './VFormField.vue'

export interface CheckboxGroupProps {
  modelValue?: unknown[]
  options?: readonly OptionInput[]
  label?: string
  hint?: string
  error?: string | boolean
  name?: string
  disabled?: boolean
  required?: boolean
  inline?: boolean
  /** Render a "Select all" checkbox above the options. */
  selectAll?: boolean | string
}

defineOptions({ name: 'VCheckboxGroup' })
const props = withDefaults(defineProps<CheckboxGroupProps>(), { modelValue: () => [] })
const emit = defineEmits<{ 'update:modelValue': [value: unknown[]] }>()

const opts = computed(() => normalizeOptions(props.options ?? []))
const enabledValues = computed(() => opts.value.filter((o) => !o.disabled).map((o) => o.value))
const allChecked = computed(
  () =>
    enabledValues.value.length > 0 &&
    enabledValues.value.every((v) => props.modelValue.includes(v)),
)
const someChecked = computed(
  () => !allChecked.value && enabledValues.value.some((v) => props.modelValue.includes(v)),
)

provide(CHECKBOX_GROUP_KEY, {
  isChecked: (v) => props.modelValue.includes(v),
  toggle: (v, on) =>
    emit(
      'update:modelValue',
      on ? [...props.modelValue, v] : props.modelValue.filter((x) => x !== v),
    ),
  disabled: computed(() => !!props.disabled),
  invalid: computed(() => !!props.error),
  name: computed(() => props.name),
})

function toggleAll(on: boolean | unknown[]) {
  const keep = props.modelValue.filter((v) => !enabledValues.value.includes(v))
  emit('update:modelValue', on ? [...keep, ...enabledValues.value] : keep)
}
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
    <div :class="['v-choice-group', { 'v-choice-group--inline': inline }]">
      <VCheckbox
        v-if="selectAll && opts.length"
        standalone
        :model-value="allChecked"
        :indeterminate="someChecked"
        :label="typeof selectAll === 'string' ? selectAll : 'Select all'"
        :disabled="disabled"
        class="v-choice-group__all"
        @update:model-value="toggleAll"
      />
      <VCheckbox
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
