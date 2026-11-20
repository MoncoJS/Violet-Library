<script setup lang="ts">
import type { ColorRole } from '../../theme'

/** Small, static status label (non-interactive). Use VChip for interactive ones. */
export interface TagProps {
  label?: string
  color?: ColorRole
  variant?: 'soft' | 'solid' | 'outline'
  /** Leading status dot. */
  dot?: boolean
  rounded?: boolean
}

defineOptions({ name: 'VTag' })
withDefaults(defineProps<TagProps>(), { color: 'neutral', variant: 'soft' })
</script>

<template>
  <span :class="['v-tag', `v-tag--${variant}`, `v-role--${color}`, { 'v-tag--rounded': rounded }]">
    <span v-if="dot" class="v-tag__dot" aria-hidden="true" />
    <slot>{{ label }}</slot>
  </span>
</template>
