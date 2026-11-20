<script setup lang="ts">
import { computed } from 'vue'
import type { ColorRole, ComponentSize } from '../../theme'

export interface ProgressProps {
  /** 0..max; omit for indeterminate. */
  value?: number
  max?: number
  variant?: 'linear' | 'circular'
  color?: ColorRole
  size?: Extract<ComponentSize, 'sm' | 'md' | 'lg'>
  label?: string
  showValue?: boolean
  striped?: boolean
}

defineOptions({ name: 'VProgress' })
const props = withDefaults(defineProps<ProgressProps>(), {
  max: 100,
  variant: 'linear',
  color: 'primary',
  size: 'md',
})
const indeterminate = computed(() => props.value === undefined || props.value === null)
const pct = computed(() =>
  indeterminate.value ? 0 : Math.min(100, Math.max(0, (props.value! / props.max) * 100)),
)
const R = 18
const C = 2 * Math.PI * R
</script>

<template>
  <div
    :class="[
      'v-progress',
      `v-progress--${variant}`,
      `v-progress--${size}`,
      `v-role--${color}`,
      { 'is-indeterminate': indeterminate, 'is-striped': striped },
    ]"
    role="progressbar"
    :aria-label="label ?? 'Progress'"
    aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuenow="indeterminate ? undefined : value"
  >
    <div v-if="label || showValue" class="v-progress__head">
      <span v-if="label && variant === 'linear'" class="v-progress__label">{{ label }}</span>
      <span v-if="showValue && !indeterminate && variant === 'linear'" class="v-progress__value"
        >{{ Math.round(pct) }}%</span
      >
    </div>
    <div v-if="variant === 'linear'" class="v-progress__track">
      <div class="v-progress__bar" :style="indeterminate ? undefined : { width: `${pct}%` }" />
    </div>
    <div v-else class="v-progress__ring">
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle
          class="v-progress__ring-track"
          cx="22"
          cy="22"
          :r="R"
          fill="none"
          stroke-width="4"
        />
        <circle
          class="v-progress__ring-bar"
          cx="22"
          cy="22"
          :r="R"
          fill="none"
          stroke-width="4"
          stroke-linecap="round"
          :stroke-dasharray="C"
          :stroke-dashoffset="indeterminate ? C * 0.7 : C * (1 - pct / 100)"
        />
      </svg>
      <span v-if="showValue && !indeterminate" class="v-progress__ring-value"
        >{{ Math.round(pct) }}%</span
      >
    </div>
  </div>
</template>
