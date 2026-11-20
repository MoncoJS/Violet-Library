<script setup lang="ts">
/**
 * Generic click-to-open floating panel anchored to a trigger. VMenu builds on it.
 * The trigger slot receives `{ open, toggle, props }` — spread `props` on your
 * button to get the right ARIA wiring.
 */
import { computed, ref, useId } from 'vue'
import { useClickOutside, useFloating, type Placement } from '../../utils/dom'

export interface DropdownProps {
  modelValue?: boolean
  placement?: Placement
  disabled?: boolean
  /** Match the trigger's width. */
  matchWidth?: boolean
  closeOnContentClick?: boolean
  /** ARIA popup type announced on the trigger. */
  popupRole?: 'menu' | 'listbox' | 'dialog' | 'true'
}

defineOptions({ name: 'VDropdown' })
const props = withDefaults(defineProps<DropdownProps>(), {
  modelValue: undefined,
  placement: 'bottom-start',
  popupRole: 'true',
})
const emit = defineEmits<{ 'update:modelValue': [open: boolean]; open: []; close: [] }>()
const uid = useId()
const panelId = `v-dropdown-${uid}`
const host = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const inner = ref(false)
const open = computed(() => props.modelValue ?? inner.value)

function set(v: boolean) {
  if (v && props.disabled) return
  if (v === open.value) return
  inner.value = v
  emit('update:modelValue', v)
  if (v) emit('open')
  else emit('close')
}
const toggle = () => set(!open.value)
const { style } = useFloating(host, panel, {
  placement: () => props.placement,
  open: () => open.value,
  matchWidth: props.matchWidth,
})
useClickOutside(
  [host, panel],
  () => set(false),
  () => open.value,
)

const triggerProps = computed(() => ({
  'aria-haspopup': props.popupRole,
  'aria-expanded': open.value,
  'aria-controls': open.value ? panelId : undefined,
  disabled: props.disabled || undefined,
  onClick: toggle,
}))
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    e.stopPropagation()
    set(false)
    ;(host.value?.querySelector('[aria-haspopup]') as HTMLElement | null)?.focus()
  }
}
defineExpose({ open: () => set(true), close: () => set(false), toggle, panel, panelId })
</script>

<template>
  <span ref="host" class="v-dropdown" @keydown="onKeydown">
    <slot name="trigger" :open="open" :toggle="toggle" :props="triggerProps" />
  </span>
  <Teleport to="body">
    <Transition name="v-pop">
      <div
        v-if="open"
        :id="panelId"
        ref="panel"
        class="v-popup v-dropdown__panel"
        :style="style"
        @keydown="onKeydown"
        @click="closeOnContentClick && set(false)"
      >
        <slot :close="() => set(false)" />
      </div>
    </Transition>
  </Teleport>
</template>
