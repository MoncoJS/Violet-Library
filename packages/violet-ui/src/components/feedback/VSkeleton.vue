<script setup lang="ts">
export interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle' | 'avatar' | 'button'
  width?: string
  height?: string
  /** Repeat count for text lines (last line is shorter). */
  lines?: number
  animated?: boolean
  /** When false, render the default slot instead. */
  loading?: boolean
}

defineOptions({ name: 'VSkeleton' })
withDefaults(defineProps<SkeletonProps>(), {
  variant: 'text',
  lines: 1,
  animated: true,
  loading: true,
})
</script>

<template>
  <slot v-if="!loading" />
  <span v-else-if="variant === 'text' && lines > 1" class="v-skeleton-group" aria-hidden="true">
    <span
      v-for="i in lines"
      :key="i"
      :class="['v-skeleton', 'v-skeleton--text', { 'is-animated': animated }]"
      :style="{ width: i === lines ? '60%' : width, height }"
    />
  </span>
  <span
    v-else
    :class="['v-skeleton', `v-skeleton--${variant}`, { 'is-animated': animated }]"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>
