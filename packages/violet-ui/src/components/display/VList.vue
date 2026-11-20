<script setup lang="ts">
import type { Component } from 'vue'
import { IconChevronRight } from '../../icons'
import VAvatar from './VAvatar.vue'

export interface ListItem {
  key?: string | number
  title: string
  subtitle?: string
  icon?: Component
  avatar?: string
  /** Name for initials avatar. */
  avatarName?: string
  /** Right-aligned meta text. */
  meta?: string
  href?: string
  disabled?: boolean
  active?: boolean
}

export interface ListProps {
  items?: ListItem[]
  /** Items are clickable (emit `select`). */
  interactive?: boolean
  dividers?: boolean
  dense?: boolean
  /** Show chevrons on interactive items. */
  chevron?: boolean
  label?: string
}

defineOptions({ name: 'VList' })
const props = withDefaults(defineProps<ListProps>(), { items: () => [] })
const emit = defineEmits<{ select: [item: ListItem] }>()
const tag = (it: ListItem) => (it.href ? 'a' : props.interactive ? 'button' : 'div')
</script>

<template>
  <ul
    :class="['v-list', { 'v-list--dividers': dividers, 'v-list--dense': dense }]"
    :aria-label="label"
  >
    <li v-for="(it, i) in items" :key="it.key ?? i" class="v-list__li">
      <component
        :is="tag(it)"
        :href="it.href"
        :type="tag(it) === 'button' ? 'button' : undefined"
        :disabled="tag(it) === 'button' ? it.disabled : undefined"
        :aria-current="it.active ? 'true' : undefined"
        :class="[
          'v-list__item',
          {
            'is-interactive': interactive || !!it.href,
            'is-active': it.active,
            'is-disabled': it.disabled,
          },
        ]"
        @click="(interactive || it.href) && !it.disabled && emit('select', it)"
      >
        <slot name="prepend" :item="it">
          <VAvatar
            v-if="it.avatar || it.avatarName"
            :src="it.avatar"
            :name="it.avatarName ?? it.title"
            size="sm"
          />
          <span v-else-if="it.icon" class="v-list__icon" aria-hidden="true"
            ><component :is="it.icon"
          /></span>
        </slot>
        <span class="v-list__content">
          <slot name="item" :item="it">
            <span class="v-list__title">{{ it.title }}</span>
            <span v-if="it.subtitle" class="v-list__subtitle">{{ it.subtitle }}</span>
          </slot>
        </span>
        <slot name="append" :item="it">
          <span v-if="it.meta" class="v-list__meta">{{ it.meta }}</span>
        </slot>
        <IconChevronRight
          v-if="chevron && (interactive || it.href)"
          class="v-list__chevron"
          aria-hidden="true"
        />
      </component>
    </li>
    <slot />
  </ul>
</template>
