<script setup lang="ts">
import { provide, reactive, toRef } from 'vue'
import type { ColorRole, ComponentSize } from '../theme'
import { BUTTON_GROUP_KEY, type ButtonVariant } from './context'

export interface ButtonGroupProps {
  variant?: ButtonVariant
  color?: ColorRole
  size?: ComponentSize
  disabled?: boolean
  attached?: boolean
  vertical?: boolean
  label?: string
}

defineOptions({ name: 'VButtonGroup' })
const props = withDefaults(defineProps<ButtonGroupProps>(), { disabled: undefined, attached: true })

provide(
  BUTTON_GROUP_KEY,
  reactive({
    variant: toRef(props, 'variant'),
    color: toRef(props, 'color'),
    size: toRef(props, 'size'),
    disabled: toRef(props, 'disabled'),
  }),
)
</script>

<template>
  <div
    role="group"
    :aria-label="label"
    :class="[
      'v-button-group',
      { 'v-button-group--attached': attached, 'v-button-group--vertical': vertical },
    ]"
  >
    <slot />
  </div>
</template>
