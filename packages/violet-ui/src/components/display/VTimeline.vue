<script setup lang="ts">
import type { Component } from 'vue'
import type { ColorRole } from '../../theme'

export interface TimelineItem {
  key?: string | number
  title: string
  description?: string
  time?: string
  icon?: Component
  color?: ColorRole
}

export interface TimelineProps {
  items: TimelineItem[]
  /** Put timestamps on the left column (wide screens). */
  align?: 'left' | 'alternate'
}

defineOptions({ name: 'VTimeline' })
withDefaults(defineProps<TimelineProps>(), { align: 'left' })
</script>

<template>
  <ol :class="['v-timeline', `v-timeline--${align}`]">
    <li
      v-for="(it, i) in items"
      :key="it.key ?? i"
      :class="['v-timeline__item', `v-role--${it.color ?? 'primary'}`]"
    >
      <span :class="['v-timeline__marker', { 'has-icon': !!it.icon }]" aria-hidden="true">
        <component :is="it.icon" v-if="it.icon" />
      </span>
      <div class="v-timeline__body">
        <slot name="item" :item="it">
          <div class="v-timeline__head">
            <p class="v-timeline__title">{{ it.title }}</p>
            <time v-if="it.time" class="v-timeline__time">{{ it.time }}</time>
          </div>
          <p v-if="it.description" class="v-timeline__desc">{{ it.description }}</p>
        </slot>
      </div>
    </li>
  </ol>
</template>
