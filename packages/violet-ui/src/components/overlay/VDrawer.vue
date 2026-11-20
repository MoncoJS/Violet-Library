<script setup lang="ts">
import { ref, useId } from 'vue'
import { IconClose } from '../../icons'
import { useModalBehavior } from './useModal'

export interface DrawerProps {
  modelValue?: boolean
  title?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  /** CSS width (left/right) or height (top/bottom). */
  size?: string
  persistent?: boolean
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  hideClose?: boolean
  /** No backdrop, no focus trap, page stays interactive. */
  modeless?: boolean
}

defineOptions({ name: 'VDrawer', inheritAttrs: false })
const props = withDefaults(defineProps<DrawerProps>(), {
  placement: 'right',
  size: '24rem',
  closeOnBackdrop: true,
  closeOnEsc: true,
})
const emit = defineEmits<{ 'update:modelValue': [open: boolean]; close: [reason: string] }>()
const uid = useId()
const titleId = `v-drawer-title-${uid}`
const panel = ref<HTMLElement | null>(null)

const slotClose = () => close()
function close(reason: 'escape' | 'backdrop' | 'close' = 'close') {
  emit('close', reason)
  emit('update:modelValue', false)
}
const { onBackdropDown, onBackdropClick } = useModalBehavior(panel, {
  open: () => !!props.modelValue && !props.modeless,
  close,
  closeOnEsc: () => props.closeOnEsc && !props.persistent,
  closeOnBackdrop: () => props.closeOnBackdrop && !props.persistent,
})
</script>

<template>
  <Teleport to="body">
    <Transition :name="`v-drawer-${placement}`">
      <div
        v-if="modelValue"
        :class="['v-drawer', `v-drawer--${placement}`, { 'is-modeless': modeless }]"
        @pointerdown="onBackdropDown"
        @click="onBackdropClick"
      >
        <aside
          ref="panel"
          v-bind="$attrs"
          class="v-drawer__panel"
          :style="{ '--_size': size }"
          :role="modeless ? 'complementary' : 'dialog'"
          :aria-modal="modeless ? undefined : 'true'"
          :aria-labelledby="title ? titleId : undefined"
          tabindex="-1"
          @keydown.esc="modeless && closeOnEsc && close('escape')"
        >
          <header v-if="title || $slots.header || !hideClose" class="v-modal__header">
            <slot name="header" :close="slotClose">
              <h2 :id="titleId" class="v-modal__title">{{ title }}</h2>
            </slot>
            <button
              v-if="!hideClose"
              type="button"
              class="v-modal__close"
              aria-label="Close"
              @click="close()"
            >
              <IconClose />
            </button>
          </header>
          <div class="v-drawer__body"><slot :close="slotClose" /></div>
          <footer v-if="$slots.footer" class="v-modal__footer">
            <slot name="footer" :close="slotClose" />
          </footer>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>
