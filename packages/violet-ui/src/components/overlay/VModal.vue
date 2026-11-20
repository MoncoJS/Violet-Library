<script setup lang="ts">
import { ref, useId } from 'vue'
import { IconClose } from '../../icons'
import { useModalBehavior } from './useModal'

export interface ModalProps {
  /** Visibility (v-model). */
  modelValue?: boolean
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Ignore backdrop clicks and Escape. */
  persistent?: boolean
  closeOnBackdrop?: boolean
  closeOnEsc?: boolean
  hideClose?: boolean
  /** Scroll the body area instead of the whole page. */
  scrollable?: boolean
  /** CSS selector inside the modal to focus on open. */
  initialFocus?: string
  /** Render even when closed (keeps state); hidden via v-show. */
  keepAlive?: boolean
  role?: 'dialog' | 'alertdialog'
}

defineOptions({ name: 'VModal', inheritAttrs: false })
const props = withDefaults(defineProps<ModalProps>(), {
  size: 'md',
  closeOnBackdrop: true,
  closeOnEsc: true,
  scrollable: true,
  role: 'dialog',
})
const emit = defineEmits<{
  'update:modelValue': [open: boolean]
  close: [reason: 'escape' | 'backdrop' | 'close']
  open: []
  afterLeave: []
}>()
const uid = useId()
const titleId = `v-modal-title-${uid}`
const descId = `v-modal-desc-${uid}`
const panel = ref<HTMLElement | null>(null)

const slotClose = () => close()
function close(reason: 'escape' | 'backdrop' | 'close' = 'close') {
  emit('close', reason)
  emit('update:modelValue', false)
}
const { onBackdropDown, onBackdropClick } = useModalBehavior(panel, {
  open: () => !!props.modelValue,
  close,
  closeOnEsc: () => props.closeOnEsc && !props.persistent,
  closeOnBackdrop: () => props.closeOnBackdrop && !props.persistent,
  initialFocus: () => props.initialFocus,
})
defineExpose({ close: () => close() })
</script>

<template>
  <Teleport to="body">
    <Transition name="v-modal" @after-enter="emit('open')" @after-leave="emit('afterLeave')">
      <div
        v-if="modelValue || keepAlive"
        v-show="modelValue"
        class="v-modal"
        @pointerdown="onBackdropDown"
        @click="onBackdropClick"
      >
        <div
          ref="panel"
          v-bind="$attrs"
          :class="['v-modal__panel', `v-modal__panel--${size}`, { 'is-scrollable': scrollable }]"
          :role="role"
          aria-modal="true"
          :aria-labelledby="title || $slots.title ? titleId : undefined"
          :aria-describedby="description ? descId : undefined"
          tabindex="-1"
        >
          <header
            v-if="title || $slots.title || $slots.header || !hideClose"
            class="v-modal__header"
          >
            <slot name="header" :close="slotClose">
              <div class="v-modal__heading">
                <h2 v-if="title || $slots.title" :id="titleId" class="v-modal__title">
                  <slot name="title">{{ title }}</slot>
                </h2>
                <p v-if="description" :id="descId" class="v-modal__description">
                  {{ description }}
                </p>
              </div>
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
          <div class="v-modal__body"><slot :close="slotClose" /></div>
          <footer v-if="$slots.footer" class="v-modal__footer">
            <slot name="footer" :close="slotClose" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
