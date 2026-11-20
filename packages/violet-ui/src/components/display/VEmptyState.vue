<script setup lang="ts">
import type { Component } from 'vue'
import { IconInbox } from '../../icons'

export interface EmptyStateProps {
  title?: string
  description?: string
  icon?: Component
  size?: 'sm' | 'md'
}

defineOptions({ name: 'VEmptyState' })
withDefaults(defineProps<EmptyStateProps>(), {
  title: 'Nothing here yet',
  icon: () => IconInbox,
  size: 'md',
})
</script>

<template>
  <div :class="['v-empty', `v-empty--${size}`]" role="status">
    <span class="v-empty__icon" aria-hidden="true"
      ><slot name="icon"><component :is="icon" /></slot
    ></span>
    <p class="v-empty__title">{{ title }}</p>
    <p v-if="description || $slots.default" class="v-empty__desc">
      <slot>{{ description }}</slot>
    </p>
    <div v-if="$slots.actions" class="v-empty__actions"><slot name="actions" /></div>
  </div>
</template>
