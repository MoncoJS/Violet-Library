<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useId, watch, type Component } from 'vue'

export interface TabItem {
  value: string | number
  label: string
  icon?: Component
  disabled?: boolean
  /** Small count shown next to the label. */
  badge?: string | number
}

export interface TabsProps {
  modelValue?: string | number
  items: TabItem[]
  variant?: 'line' | 'pills' | 'segmented'
  orientation?: 'horizontal' | 'vertical'
  /** Arrow keys move focus only; Enter/Space selects. */
  manual?: boolean
  fill?: boolean
  label?: string
  /** Keep inactive panels mounted (v-show). */
  keepAlive?: boolean
}

defineOptions({ name: 'VTabs' })
const props = withDefaults(defineProps<TabsProps>(), { variant: 'line', orientation: 'horizontal' })
const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()
const uid = useId()
const tabId = (v: string | number) => `v-tab-${uid}-${v}`
const panelId = (v: string | number) => `v-tabpanel-${uid}-${v}`
const list = ref<HTMLElement | null>(null)
const indicator = ref<Record<string, string>>({})

const current = computed(() => props.modelValue ?? props.items.find((i) => !i.disabled)?.value)
const enabled = computed(() => props.items.filter((i) => !i.disabled))

function select(v: string | number) {
  if (v === current.value) return
  emit('update:modelValue', v)
  emit('change', v)
}

function focusTab(v: string | number) {
  document.getElementById(tabId(v))?.focus()
}

function onKeydown(e: KeyboardEvent) {
  const vertical = props.orientation === 'vertical'
  const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
  const focused = (document.activeElement as HTMLElement | null)?.dataset.value
  const idx = enabled.value.findIndex((i) => String(i.value) === focused)
  let next: TabItem | undefined
  if (e.key === keys[0])
    next = enabled.value[(idx - 1 + enabled.value.length) % enabled.value.length]
  else if (e.key === keys[1]) next = enabled.value[(idx + 1) % enabled.value.length]
  else if (e.key === 'Home') next = enabled.value[0]
  else if (e.key === 'End') next = enabled.value[enabled.value.length - 1]
  else if ((e.key === 'Enter' || e.key === ' ') && props.manual && idx >= 0) {
    e.preventDefault()
    return select(enabled.value[idx]!.value)
  }
  if (!next) return
  e.preventDefault()
  focusTab(next.value)
  if (!props.manual) select(next.value)
}

function updateIndicator() {
  if (props.variant !== 'line' || !list.value || current.value === undefined) return
  const el = document.getElementById(tabId(current.value))
  if (!el) return
  indicator.value =
    props.orientation === 'vertical'
      ? { top: `${el.offsetTop}px`, height: `${el.offsetHeight}px` }
      : { left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` }
}
onMounted(updateIndicator)
watch(
  () => [current.value, props.items],
  () => nextTick(updateIndicator),
  { deep: true },
)
</script>

<template>
  <div
    :class="['v-tabs', `v-tabs--${variant}`, `v-tabs--${orientation}`, { 'v-tabs--fill': fill }]"
  >
    <div
      ref="list"
      class="v-tabs__list"
      role="tablist"
      :aria-label="label"
      :aria-orientation="orientation"
      @keydown="onKeydown"
    >
      <button
        v-for="t in items"
        :id="tabId(t.value)"
        :key="t.value"
        type="button"
        role="tab"
        :data-value="t.value"
        :class="['v-tabs__tab', { 'is-active': t.value === current }]"
        :aria-selected="t.value === current"
        :aria-controls="panelId(t.value)"
        :tabindex="t.value === current ? 0 : -1"
        :disabled="t.disabled"
        @click="select(t.value)"
      >
        <component :is="t.icon" v-if="t.icon" class="v-tabs__icon" aria-hidden="true" />
        <span>{{ t.label }}</span>
        <span v-if="t.badge !== undefined" class="v-tabs__badge">{{ t.badge }}</span>
      </button>
      <span
        v-if="variant === 'line'"
        class="v-tabs__indicator"
        :style="indicator"
        aria-hidden="true"
      />
    </div>
    <template v-for="t in items" :key="t.value">
      <div
        v-if="keepAlive || t.value === current"
        v-show="t.value === current"
        :id="panelId(t.value)"
        class="v-tabs__panel"
        role="tabpanel"
        :aria-labelledby="tabId(t.value)"
        tabindex="0"
      >
        <slot :name="`panel-${t.value}`" :item="t">
          <slot :item="t" />
        </slot>
      </div>
    </template>
  </div>
</template>
