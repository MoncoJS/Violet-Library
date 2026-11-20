<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { IconAlertTriangle, IconCircleCheck, IconInfo } from '../../icons'
import type { ColorRole } from '../../theme'
import VButton from '../VButton.vue'
import VModal from './VModal.vue'

export interface DialogProps {
  modelValue?: boolean
  title: string
  message?: string
  /** Tone of the confirm button and icon. */
  color?: Extract<ColorRole, 'primary' | 'danger' | 'warning' | 'success' | 'info'>
  confirmText?: string
  cancelText?: string
  /** Hide the cancel button (alert style). */
  hideCancel?: boolean
  /** Runs on confirm; while pending the button shows a spinner. Resolve `false` to keep it open. */
  onConfirm?: () => unknown
  persistent?: boolean
  icon?: Component | false
}

defineOptions({ name: 'VDialog' })
const props = withDefaults(defineProps<DialogProps>(), {
  color: 'primary',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  icon: undefined,
})
const emit = defineEmits<{ 'update:modelValue': [open: boolean]; confirm: []; cancel: [] }>()
const busy = ref(false)
const iconComp = computed(() => {
  if (props.icon === false) return undefined
  if (props.icon) return props.icon
  return props.color === 'danger' || props.color === 'warning'
    ? IconAlertTriangle
    : props.color === 'success'
      ? IconCircleCheck
      : IconInfo
})

async function confirm() {
  busy.value = true
  try {
    const result = await props.onConfirm?.()
    emit('confirm')
    if (result !== false) emit('update:modelValue', false)
  } finally {
    busy.value = false
  }
}
function cancel() {
  if (busy.value) return
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<template>
  <VModal
    :model-value="modelValue"
    size="sm"
    role="alertdialog"
    hide-close
    :persistent="persistent || busy"
    :scrollable="false"
    initial-focus=".v-dialog__cancel, .v-dialog__confirm"
    class="v-dialog"
    @update:model-value="!$event && cancel()"
  >
    <template #header>
      <div class="v-dialog__head">
        <span v-if="iconComp" :class="['v-dialog__icon', `v-role--${color}`]" aria-hidden="true"
          ><component :is="iconComp"
        /></span>
        <div>
          <h2 class="v-modal__title">{{ title }}</h2>
          <div v-if="message || $slots.default" class="v-dialog__message">
            <slot>{{ message }}</slot>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <VButton
        v-if="!hideCancel"
        class="v-dialog__cancel"
        variant="outline"
        color="neutral"
        :disabled="busy"
        @click="cancel"
      >
        {{ cancelText }}
      </VButton>
      <VButton class="v-dialog__confirm" :color="color" :loading="busy" @click="confirm">{{
        confirmText
      }}</VButton>
    </template>
  </VModal>
</template>
