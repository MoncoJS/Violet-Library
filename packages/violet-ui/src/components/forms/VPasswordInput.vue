<script setup lang="ts">
import { computed, ref } from 'vue'
import { IconEye, IconEyeOff, IconLock } from '../../icons'
import type { ComponentSize } from '../../theme'
import VInput from '../VInput.vue'

export interface PasswordInputProps {
  modelValue?: string | null
  id?: string
  name?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string | boolean
  size?: ComponentSize
  variant?: 'outline' | 'filled'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autocomplete?: string
  /** Show a strength meter under the field. */
  strength?: boolean
  /** Show the lock icon on the left. Default `true`. */
  lockIcon?: boolean
}

defineOptions({ name: 'VPasswordInput', inheritAttrs: false })
const props = withDefaults(defineProps<PasswordInputProps>(), {
  lockIcon: true,
  size: 'md',
  variant: 'outline',
})
const emit = defineEmits<{
  'update:modelValue': [value: string | number | null | undefined]
  blur: [e: FocusEvent]
}>()
const visible = ref(false)

/** 0–4 score: length, mixed case, digits, symbols. */
const score = computed(() => {
  const v = String(props.modelValue ?? '')
  if (!v) return 0
  let s = 0
  if (v.length >= 8) s++
  if (/[a-z]/.test(v) && /[A-Z]/.test(v)) s++
  if (/\d/.test(v)) s++
  if (/[^A-Za-z0-9]/.test(v)) s++
  return v.length < 6 ? Math.min(s, 1) : s
})
const levels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'] as const
const forwarded = computed(() => {
  const { strength: _s, lockIcon: _l, ...rest } = props
  return rest
})
</script>

<template>
  <div :class="['v-password', $attrs.class]">
    <VInput
      v-bind="{ ...forwarded, ...$attrs, class: undefined }"
      :type="visible ? 'text' : 'password'"
      :prepend-icon="lockIcon ? IconLock : undefined"
      @update:model-value="emit('update:modelValue', $event)"
      @blur="emit('blur', $event)"
    >
      <template #suffix>
        <button
          type="button"
          class="v-password__toggle"
          :aria-label="visible ? 'Hide password' : 'Show password'"
          :aria-pressed="visible"
          :disabled="disabled"
          @click="visible = !visible"
        >
          <component :is="visible ? IconEyeOff : IconEye" />
        </button>
      </template>
    </VInput>
    <div v-if="strength && modelValue" class="v-password__meter" :data-score="score">
      <div class="v-password__bars" aria-hidden="true">
        <span v-for="i in 4" :key="i" :class="{ 'is-on': i <= score }" />
      </div>
      <span class="v-password__label" aria-live="polite">{{ levels[score] }}</span>
    </div>
  </div>
</template>
