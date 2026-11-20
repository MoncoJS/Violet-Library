<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue'
import { getFocusable, useClickOutside, useFloating, type Placement } from '../../utils/dom'

export interface PopoverProps {
  /** Controlled open state (optional). */
  modelValue?: boolean
  placement?: Placement
  /** `click` toggles; `hover` opens on pointer/focus. */
  trigger?: 'click' | 'hover'
  title?: string
  /** Panel width (CSS). */
  width?: string
  closeOnOutside?: boolean
  disabled?: boolean
  offset?: number
}

defineOptions({ name: 'VPopover' })
const props = withDefaults(defineProps<PopoverProps>(), {
  modelValue: undefined,
  placement: 'bottom',
  trigger: 'click',
  closeOnOutside: true,
  offset: 8,
})
const emit = defineEmits<{ 'update:modelValue': [open: boolean] }>()
const uid = useId()
const panelId = `v-popover-${uid}`
const titleId = `${panelId}-title`
const host = ref<HTMLElement | null>(null)
const anchor = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const inner = ref(false)
const open = computed(() => props.modelValue ?? inner.value)
let hoverTimer: ReturnType<typeof setTimeout> | undefined

function set(v: boolean) {
  if (props.disabled && v) return
  inner.value = v
  emit('update:modelValue', v)
}
const { style } = useFloating(anchor, panel, {
  placement: () => props.placement,
  open: () => open.value,
  offset: props.offset,
})
useClickOutside(
  [host, panel],
  () => set(false),
  () => open.value && props.closeOnOutside,
)

function triggerEl() {
  return (host.value?.firstElementChild as HTMLElement | null) ?? host.value
}
watch(
  open,
  (v) => {
    anchor.value = triggerEl()
    const el = triggerEl()
    if (el && el !== host.value) {
      el.setAttribute('aria-expanded', String(v))
      el.setAttribute('aria-controls', panelId)
      el.setAttribute('aria-haspopup', 'dialog')
    }
    if (v && props.trigger === 'click')
      nextTick(() =>
        requestAnimationFrame(
          () => panel.value && (getFocusable(panel.value)[0] ?? panel.value).focus(),
        ),
      )
  },
  { flush: 'post' },
)

function onTriggerClick() {
  if (props.trigger === 'click') set(!open.value)
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    e.stopPropagation()
    set(false)
    triggerEl()?.focus()
  }
}
const hoverIn = () => props.trigger === 'hover' && (clearTimeout(hoverTimer), set(true))
const hoverOut = () => props.trigger === 'hover' && (hoverTimer = setTimeout(() => set(false), 120))

defineExpose({ open: () => set(true), close: () => set(false), toggle: () => set(!open.value) })
</script>

<template>
  <span
    ref="host"
    class="v-popover-host"
    @click="onTriggerClick"
    @keydown="onKeydown"
    @mouseenter="hoverIn"
    @mouseleave="hoverOut"
    @focusin="hoverIn"
    @focusout="hoverOut"
  >
    <slot name="trigger" :open="open" />
  </span>
  <Teleport to="body">
    <Transition name="v-pop">
      <div
        v-if="open"
        :id="panelId"
        ref="panel"
        class="v-popup v-popover"
        role="dialog"
        :aria-labelledby="title ? titleId : undefined"
        tabindex="-1"
        :style="{ ...style, width }"
        @keydown="onKeydown"
        @mouseenter="hoverIn"
        @mouseleave="hoverOut"
      >
        <p v-if="title" :id="titleId" class="v-popover__title">{{ title }}</p>
        <slot :close="() => set(false)" />
      </div>
    </Transition>
  </Teleport>
</template>
