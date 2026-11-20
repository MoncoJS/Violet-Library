<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { ColorRole, ComponentSize } from '../theme'
import VButton from './VButton.vue'
import type { ButtonVariant } from './context'

export interface IconButtonProps {
  icon?: Component
  /** Required accessible name (also used as tooltip). */
  label: string
  as?: string | Component
  type?: 'button' | 'submit' | 'reset'
  href?: string
  variant?: ButtonVariant
  color?: ColorRole
  size?: ComponentSize
  disabled?: boolean
  loading?: boolean
  pill?: boolean
}

defineOptions({ name: 'VIconButton' })
const props = withDefaults(defineProps<IconButtonProps>(), {
  as: undefined,
  type: 'button',
  variant: 'ghost',
  color: 'neutral',
  size: undefined,
  disabled: undefined,
})
defineEmits<{ click: [event: MouseEvent] }>()

const forwarded = computed(() => {
  const { icon: _icon, label: _label, ...rest } = props
  return rest
})
</script>

<template>
  <VButton
    v-bind="forwarded"
    icon-only
    :aria-label="label"
    :title="label"
    class="v-icon-button"
    @click="$emit('click', $event)"
  >
    <span class="v-icon-button__icon" aria-hidden="true">
      <slot><component :is="icon" /></slot>
    </span>
  </VButton>
</template>
