<script setup lang="ts">
import { computed } from 'vue'

export interface SpinnerProps {
  size?: number | string
  /** Accessible label; when omitted the spinner is decorative. */
  label?: string
}

defineOptions({ name: 'VSpinner' })
const props = withDefaults(defineProps<SpinnerProps>(), { size: '1em' })
const px = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
</script>

<template>
  <span
    class="v-spinner"
    :role="label ? 'status' : undefined"
    :aria-hidden="label ? undefined : 'true'"
    :style="{ width: px, height: px }"
  >
    <svg viewBox="0 0 24 24" fill="none" focusable="false">
      <circle class="v-spinner__track" cx="12" cy="12" r="9.5" stroke-width="3" />
      <path
        class="v-spinner__arc"
        d="M21.5 12A9.5 9.5 0 0 0 12 2.5"
        stroke-width="3"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="label" class="v-spinner__label">{{ label }}</span>
  </span>
</template>
