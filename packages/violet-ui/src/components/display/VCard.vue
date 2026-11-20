<script setup lang="ts">
import type { Component } from 'vue'

export interface CardProps {
  title?: string
  subtitle?: string
  variant?: 'outline' | 'elevated' | 'filled'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Render as a link/button with hover state. */
  as?: string | Component
  interactive?: boolean
  /** Image URL shown at the top. */
  image?: string
  imageAlt?: string
}

defineOptions({ name: 'VCard' })
withDefaults(defineProps<CardProps>(), {
  variant: 'outline',
  padding: 'md',
  as: 'div',
  imageAlt: '',
})
</script>

<template>
  <component
    :is="as"
    :class="[
      'v-card',
      `v-card--${variant}`,
      `v-card--pad-${padding}`,
      { 'is-interactive': interactive },
    ]"
  >
    <img v-if="image" :src="image" :alt="imageAlt" class="v-card__image" />
    <slot name="media" />
    <header v-if="title || subtitle || $slots.header || $slots.actions" class="v-card__header">
      <slot name="header">
        <div class="v-card__heading">
          <h3 v-if="title" class="v-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="v-card__subtitle">{{ subtitle }}</p>
        </div>
      </slot>
      <div v-if="$slots.actions" class="v-card__actions"><slot name="actions" /></div>
    </header>
    <div v-if="$slots.default" class="v-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="v-card__footer"><slot name="footer" /></footer>
  </component>
</template>
