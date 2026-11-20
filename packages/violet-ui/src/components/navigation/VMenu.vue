<script setup lang="ts">
import { nextTick, ref, type Component } from 'vue'
import type { Placement } from '../../utils/dom'
import VDropdown from './VDropdown.vue'

export type MenuItem =
  | {
      label: string
      value?: string | number
      icon?: Component
      shortcut?: string
      disabled?: boolean
      /** Destructive styling. */
      danger?: boolean
      href?: string
      onSelect?: () => void
    }
  | { divider: true }
  | { heading: string }

export interface MenuProps {
  items: MenuItem[]
  placement?: Placement
  disabled?: boolean
  label?: string
}

defineOptions({ name: 'VMenu' })
withDefaults(defineProps<MenuProps>(), { placement: 'bottom-start' })
const emit = defineEmits<{ select: [item: Extract<MenuItem, { label: string }>] }>()
const dropdown = ref<InstanceType<typeof VDropdown> | null>(null)
const menu = ref<HTMLElement | null>(null)

const isAction = (i: MenuItem): i is Extract<MenuItem, { label: string }> => 'label' in i
const itemsEls = () =>
  Array.from(
    menu.value?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ??
      [],
  )

function focusAt(index: number) {
  const els = itemsEls()
  if (!els.length) return
  els[(index + els.length) % els.length]!.focus()
}
function onOpen(first = true) {
  nextTick(() => requestAnimationFrame(() => focusAt(first ? 0 : -1)))
}

let typeahead = ''
let timer: ReturnType<typeof setTimeout> | undefined
function onMenuKeydown(e: KeyboardEvent) {
  const els = itemsEls()
  const i = els.indexOf(document.activeElement as HTMLElement)
  const target: Record<string, number> = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: -1 }
  if (e.key in target) {
    e.preventDefault()
    focusAt(target[e.key]!)
  } else if (e.key === 'Tab') dropdown.value?.close()
  else if (e.key.length === 1 && /\S/.test(e.key)) {
    clearTimeout(timer)
    typeahead += e.key.toLowerCase()
    timer = setTimeout(() => (typeahead = ''), 500)
    const hit = els.findIndex((el) => el.textContent?.trim().toLowerCase().startsWith(typeahead))
    if (hit >= 0) focusAt(hit)
  }
}
function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    dropdown.value?.open()
    onOpen(e.key === 'ArrowDown')
  }
}
function choose(item: Extract<MenuItem, { label: string }>) {
  if (item.disabled) return
  item.onSelect?.()
  emit('select', item)
  dropdown.value?.close()
  ;(menu.value?.closest('.v-dropdown__panel') as HTMLElement | null)?.blur()
}
</script>

<template>
  <VDropdown
    ref="dropdown"
    :placement="placement"
    :disabled="disabled"
    popup-role="menu"
    @open="onOpen()"
  >
    <template #trigger="{ props: triggerProps, open }">
      <span class="v-menu__trigger" @keydown="onTriggerKeydown">
        <slot name="trigger" :props="triggerProps" :open="open" />
      </span>
    </template>
    <ul ref="menu" class="v-menu" role="menu" :aria-label="label" @keydown="onMenuKeydown">
      <template v-for="(item, i) in items" :key="i">
        <li v-if="'divider' in item" class="v-menu__divider" role="separator" />
        <li v-else-if="'heading' in item" class="v-menu__heading" role="presentation">
          {{ item.heading }}
        </li>
        <li v-else-if="isAction(item)" role="none">
          <component
            :is="item.href ? 'a' : 'button'"
            :href="item.href"
            :type="item.href ? undefined : 'button'"
            role="menuitem"
            tabindex="-1"
            :class="['v-menu__item', { 'is-danger': item.danger, 'is-disabled': item.disabled }]"
            :aria-disabled="item.disabled ? 'true' : undefined"
            @click="choose(item)"
          >
            <component :is="item.icon" v-if="item.icon" class="v-menu__icon" aria-hidden="true" />
            <span class="v-menu__label">{{ item.label }}</span>
            <kbd v-if="item.shortcut" class="v-menu__shortcut">{{ item.shortcut }}</kbd>
          </component>
        </li>
      </template>
    </ul>
  </VDropdown>
</template>
