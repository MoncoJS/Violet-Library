<script setup lang="ts">
/**
 * A custom input that participates in any parent `useForm()` automatically:
 * <ColorField name="brandColor" label="Brand color" />
 */
import { useId } from 'vue'
import { regex, required, useField } from 'violet-ui'

const props = defineProps<{ name: string; label: string }>()

const { value, error, handleBlur } = useField<string>(props.name, {
  label: props.label,
  initialValue: '#7c3aed',
  rules: [required(), regex(/^#[0-9a-f]{6}$/i, 'Use a 6-digit hex color')],
})

const id = useId()
</script>

<template>
  <div class="color-field">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="value"
      type="color"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? `${id}-error` : undefined"
      @blur="handleBlur"
    />
    <p v-if="error" :id="`${id}-error`" role="alert">{{ error }}</p>
  </div>
</template>
