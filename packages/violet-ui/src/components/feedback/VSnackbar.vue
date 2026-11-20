<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { IconClose } from '../../icons'
import type { ColorRole } from '../../theme'

export interface SnackbarProps {
  /** Visibility (v-model). */
  modelValue?: boolean
  text?: string
  /** Auto-hide after ms; 0 keeps it open. */
  timeout?: number
  actionLabel?: string
  color?: Extract<ColorRole, 'neutral' | 'primary' | 'success' | 'danger' | 'warning' | 'info'>
  position?: 'bottom' | 'bottom-left' | 'bottom-right' | 'top'
  closable?: boolean
}

defineOptions({ name: 'VSnackbar' })
const props = withDefaults(defineProps<SnackbarProps>(), {
  timeout: 4000,
  color: 'neutral',
  position: 'bottom',
})
const emit = defineEmits<{ 'update:modelValue': [open: boolean]; action: [] }>()

let timer: ReturnType<typeof setTimeout> | undefined
const stop = () => clearTimeout(timer)
const start = () => {
  stop()
  if (props.modelValue && props.timeout > 0)
    timer = setTimeout(() => emit('update:modelValue', false), props.timeout)
}
watch(() => [props.modelValue, props.text], start, { immediate: true })
onBeforeUnmount(stop)

function onAction() {
  emit('action')
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="v-snackbar">
      <div
        v-if="modelValue"
        :class="['v-snackbar', `v-snackbar--${position}`, `v-snackbar--${color}`]"
        role="status"
        aria-live="polite"
        @mouseenter="stop"
        @mouseleave="start"
        @focusin="stop"
        @focusout="start"
      >
        <span class="v-snackbar__text"
          ><slot>{{ text }}</slot></span
        >
        <button v-if="actionLabel" type="button" class="v-snackbar__action" @click="onAction">
          {{ actionLabel }}
        </button>
        <button
          v-if="closable"
          type="button"
          class="v-snackbar__close"
          aria-label="Close"
          @click="emit('update:modelValue', false)"
        >
          <IconClose />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
