<script setup lang="ts">
import { computed } from 'vue'
import { IconAlertTriangle, IconCircleCheck, IconCircleX, IconClose, IconInfo } from '../icons'
import type { Toast } from '../toast'

defineOptions({ name: 'VToast' })
const props = defineProps<{ toast: Toast }>()
const emit = defineEmits<{ dismiss: [id: string]; pause: [id: string]; resume: [id: string] }>()

const icon = computed(
  () =>
    ({
      success: IconCircleCheck,
      danger: IconCircleX,
      warning: IconAlertTriangle,
      info: IconInfo,
      neutral: undefined,
    })[props.toast.color],
)
const role = computed(() => (props.toast.color === 'danger' ? 'alert' : 'status'))
</script>

<template>
  <div
    :class="['v-toast', `v-toast--${toast.color}`]"
    :role="role"
    :aria-live="role === 'alert' ? 'assertive' : 'polite'"
    aria-atomic="true"
    @mouseenter="emit('pause', toast.id)"
    @mouseleave="emit('resume', toast.id)"
    @focusin="emit('pause', toast.id)"
    @focusout="emit('resume', toast.id)"
  >
    <span v-if="icon" class="v-toast__icon"><component :is="icon" /></span>
    <div class="v-toast__body">
      <p v-if="toast.title" class="v-toast__title">{{ toast.title }}</p>
      <p v-if="toast.description" class="v-toast__description">{{ toast.description }}</p>
    </div>
    <button
      v-if="toast.action"
      type="button"
      class="v-toast__action"
      @click="toast.action.onClick(toast)"
    >
      {{ toast.action.label }}
    </button>
    <button
      v-if="toast.closable"
      type="button"
      class="v-toast__close"
      aria-label="Dismiss notification"
      @click="emit('dismiss', toast.id)"
    >
      <IconClose />
    </button>
  </div>
</template>
