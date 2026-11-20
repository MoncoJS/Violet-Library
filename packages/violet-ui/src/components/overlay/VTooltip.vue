<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { useFloating, type Placement } from '../../utils/dom'

export interface TooltipProps {
  text?: string
  placement?: Placement
  /** ms before showing on hover. */
  openDelay?: number
  closeDelay?: number
  disabled?: boolean
}

defineOptions({ name: 'VTooltip' })
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'top',
  openDelay: 300,
  closeDelay: 80,
})
const uid = useId()
const tipId = `v-tooltip-${uid}`
const host = ref<HTMLElement | null>(null)
const anchor = ref<HTMLElement | null>(null)
const tip = ref<HTMLElement | null>(null)
const open = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

const { style, placement: actual } = useFloating(anchor, tip, {
  placement: () => props.placement,
  open: () => open.value,
  offset: 8,
})

function show(delay = props.openDelay) {
  if (props.disabled) return
  clearTimeout(timer)
  timer = setTimeout(() => (open.value = true), delay)
}
function hide() {
  clearTimeout(timer)
  timer = setTimeout(() => (open.value = false), props.closeDelay)
}
const keep = () => clearTimeout(timer)
const onKey = (e: KeyboardEvent) =>
  e.key === 'Escape' && open.value && ((open.value = false), e.stopPropagation())

// Wire aria-describedby onto the actual trigger element (first element child).
function link() {
  const el = host.value?.firstElementChild as HTMLElement | null
  anchor.value = el ?? host.value
  if (!el) return
  const ids = new Set((el.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean))
  ids.add(tipId)
  el.setAttribute('aria-describedby', [...ids].join(' '))
}
onMounted(link)
watch(
  () => props.disabled,
  (d) => d && (open.value = false),
)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <span
    ref="host"
    class="v-tooltip-host"
    @mouseenter="show()"
    @mouseleave="hide"
    @focusin="show(0)"
    @focusout="hide"
    @keydown="onKey"
  >
    <slot />
  </span>
  <Teleport to="body">
    <Transition name="v-fade">
      <div
        v-show="open"
        :id="tipId"
        ref="tip"
        role="tooltip"
        :class="['v-tooltip', `v-tooltip--${actual.split('-')[0]}`]"
        :style="style"
        @mouseenter="keep"
        @mouseleave="hide"
      >
        <slot name="content">{{ text }}</slot>
      </div>
    </Transition>
  </Teleport>
</template>
