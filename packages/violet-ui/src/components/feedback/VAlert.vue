<script setup lang="ts">
import { computed, type Component } from 'vue'
import { IconAlertTriangle, IconCircleCheck, IconCircleX, IconClose, IconInfo } from '../../icons'
import type { ColorRole } from '../../theme'

export interface AlertProps {
  color?: Extract<ColorRole, 'info' | 'success' | 'warning' | 'danger' | 'neutral' | 'primary'>
  variant?: 'soft' | 'outline' | 'solid' | 'accent'
  title?: string
  description?: string
  /** Custom icon; `false` hides it. */
  icon?: Component | false
  closable?: boolean
}

defineOptions({ name: 'VAlert' })
const props = withDefaults(defineProps<AlertProps>(), {
  color: 'info',
  variant: 'soft',
  icon: undefined,
})
const emit = defineEmits<{ close: [] }>()
const defaults: Record<string, Component | undefined> = {
  info: IconInfo,
  success: IconCircleCheck,
  warning: IconAlertTriangle,
  danger: IconCircleX,
  primary: IconInfo,
}
const iconComp = computed(() =>
  props.icon === false ? undefined : (props.icon ?? defaults[props.color]),
)
const role = computed(() =>
  props.color === 'danger' || props.color === 'warning' ? 'alert' : 'status',
)
</script>

<template>
  <div :class="['v-alert', `v-role--${color}`, `v-alert--${variant}`]" :role="role">
    <span v-if="iconComp" class="v-alert__icon" aria-hidden="true"
      ><component :is="iconComp"
    /></span>
    <div class="v-alert__body">
      <p v-if="title || $slots.title" class="v-alert__title">
        <slot name="title">{{ title }}</slot>
      </p>
      <div v-if="description || $slots.default" class="v-alert__description">
        <slot>{{ description }}</slot>
      </div>
      <div v-if="$slots.actions" class="v-alert__actions"><slot name="actions" /></div>
    </div>
    <button
      v-if="closable"
      type="button"
      class="v-alert__close"
      aria-label="Dismiss"
      @click="emit('close')"
    >
      <IconClose />
    </button>
  </div>
</template>
