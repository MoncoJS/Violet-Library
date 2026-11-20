<script setup lang="ts">
import { computed, ref, type Component } from 'vue'

export interface BreadcrumbItem {
  label: string
  href?: string
  /** For vue-router: rendered with `as` (e.g. RouterLink) and passed as `to`. */
  to?: unknown
  icon?: Component
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string
  /** Collapse the middle when there are more items than this. */
  maxItems?: number
  /** Link component, e.g. RouterLink. Defaults to a plain anchor. */
  as?: string | Component
  label?: string
}

defineOptions({ name: 'VBreadcrumb' })
const props = withDefaults(defineProps<BreadcrumbProps>(), { separator: '/', label: 'Breadcrumb' })
const expanded = ref(false)

type Entry = BreadcrumbItem | { ellipsis: true }
const visible = computed<Entry[]>(() => {
  const all = props.items
  if (expanded.value || !props.maxItems || all.length <= props.maxItems) return all
  return [all[0]!, { ellipsis: true }, ...all.slice(all.length - (props.maxItems - 1))]
})
const linkProps = (it: BreadcrumbItem) => (it.to !== undefined ? { to: it.to } : { href: it.href })
</script>

<template>
  <nav class="v-breadcrumb" :aria-label="label">
    <ol class="v-breadcrumb__list">
      <li v-for="(it, i) in visible" :key="i" class="v-breadcrumb__item">
        <button
          v-if="'ellipsis' in it"
          type="button"
          class="v-breadcrumb__ellipsis"
          aria-label="Show full path"
          @click="expanded = true"
        >
          …
        </button>
        <span
          v-else-if="i === visible.length - 1"
          class="v-breadcrumb__current"
          aria-current="page"
        >
          <component :is="it.icon" v-if="it.icon" aria-hidden="true" />{{ it.label }}
        </span>
        <component
          :is="as ?? 'a'"
          v-else-if="it.href || it.to !== undefined"
          class="v-breadcrumb__link"
          v-bind="linkProps(it)"
        >
          <component :is="it.icon" v-if="it.icon" aria-hidden="true" />{{ it.label }}
        </component>
        <span v-else class="v-breadcrumb__text"
          ><component :is="it.icon" v-if="it.icon" aria-hidden="true" />{{ it.label }}</span
        >
        <span v-if="i < visible.length - 1" class="v-breadcrumb__sep" aria-hidden="true">
          <slot name="separator">{{ separator }}</slot>
        </span>
      </li>
    </ol>
  </nav>
</template>
