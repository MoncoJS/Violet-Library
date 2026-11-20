<script setup lang="ts">
import { computed, useId } from 'vue'

/** Shared label / hint / error frame used by every form control. */
export interface FormFieldProps {
  id?: string
  label?: string
  hint?: string
  error?: string | boolean
  required?: boolean
  disabled?: boolean
  /** Render as a fieldset with a legend (for checkbox / radio groups). */
  group?: boolean
}

defineOptions({ name: 'VFormField' })
const props = defineProps<FormFieldProps>()
const uid = useId()
const fieldId = computed(() => props.id ?? `v-field-${uid}`)
const errorText = computed(() =>
  typeof props.error === 'string' && props.error ? props.error : undefined,
)
const invalid = computed(() => !!props.error)
const hintId = computed(() => `${fieldId.value}-hint`)
const errorId = computed(() => `${fieldId.value}-error`)
const describedBy = computed(
  () =>
    (errorText.value ? errorId.value : props.hint ? hintId.value : undefined) as string | undefined,
)
</script>

<template>
  <component
    :is="group ? 'fieldset' : 'div'"
    :class="[
      'v-field',
      { 'is-invalid': invalid, 'is-disabled': disabled, 'v-field--group': group },
    ]"
    :aria-describedby="group ? describedBy : undefined"
    :aria-invalid="group && invalid ? 'true' : undefined"
  >
    <template v-if="label || $slots.label">
      <legend v-if="group" class="v-field__label">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" class="v-field__required" aria-hidden="true">*</span>
      </legend>
      <label v-else :for="fieldId" class="v-field__label">
        <slot name="label">{{ label }}</slot>
        <span v-if="required" class="v-field__required" aria-hidden="true">*</span>
      </label>
    </template>
    <slot :id="fieldId" :described-by="describedBy" :invalid="invalid" />
    <p v-if="errorText" :id="errorId" class="v-field__error" aria-live="polite">{{ errorText }}</p>
    <p v-else-if="hint" :id="hintId" class="v-field__hint">{{ hint }}</p>
  </component>
</template>
