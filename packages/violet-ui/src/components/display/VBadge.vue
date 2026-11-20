<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { ColorRole } from '../../theme'

export interface BadgeProps {
  /** Number or text; numbers above `max` show as `max+`. */
  content?: string | number
  max?: number
  /** Small dot instead of content. */
  dot?: boolean
  color?: ColorRole
  variant?: 'solid' | 'soft' | 'outline'
  /** Hide when content is 0. */
  hideZero?: boolean
  /** Accessible description, e.g. "3 unread messages". */
  label?: string
}

defineOptions({ name: 'VBadge' })
const props = withDefaults(defineProps<BadgeProps>(), {
  max: 99,
  color: 'danger',
  variant: 'solid',
})
const slots = useSlots()
const text = computed(() =>
  typeof props.content === 'number' && props.content > props.max ? `${props.max}+` : props.content,
)
const hidden = computed(() => props.hideZero && props.content === 0)
const attached = computed(() => !!slots.default)
</script>

<template>
  <span v-if="attached" class="v-badge-host">
    <slot />
    <span
      v-if="!hidden"
      :class="[
        'v-badge',
        `v-badge--${variant}`,
        `v-role--${color}`,
        'v-badge--attached',
        { 'v-badge--dot': dot },
      ]"
      :aria-label="label"
      :role="label ? 'status' : undefined"
    >
      <template v-if="!dot">{{ text }}</template>
    </span>
  </span>
  <span
    v-else-if="!hidden"
    :class="['v-badge', `v-badge--${variant}`, `v-role--${color}`, { 'v-badge--dot': dot }]"
    :aria-label="label"
  >
    <template v-if="!dot">{{ text }}</template>
  </span>
</template>
