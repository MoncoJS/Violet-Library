<script setup lang="ts">
import { computed, inject } from 'vue'
import VSpinner from './VSpinner.vue'
import { BUTTON_GROUP_KEY, type ButtonProps } from './context'

defineOptions({ name: 'VButton' })
const props = withDefaults(defineProps<ButtonProps>(), {
  as: undefined,
  type: 'button',
  variant: undefined,
  color: undefined,
  size: undefined,
  disabled: undefined,
})
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const group = inject(BUTTON_GROUP_KEY, null)

const variant = computed(() => props.variant ?? group?.variant ?? 'solid')
const color = computed(() => props.color ?? group?.color ?? 'primary')
const size = computed(() => props.size ?? group?.size ?? 'md')
const isDisabled = computed(() => !!(props.disabled ?? group?.disabled))
const inert = computed(() => isDisabled.value || props.loading)
const tag = computed(() => props.as ?? (props.href ? 'a' : 'button'))
const isNative = computed(() => tag.value === 'button')
const isLink = computed(() => tag.value === 'a' && !!props.href)

const attrs = computed(() =>
  isNative.value
    ? { type: props.type, disabled: inert.value || undefined }
    : {
        href: inert.value ? undefined : props.href,
        role: isLink.value ? undefined : 'button',
        tabindex: inert.value ? -1 : isLink.value ? undefined : 0,
        'aria-disabled': inert.value ? 'true' : undefined,
      },
)

const classes = computed(() => [
  'v-button',
  `v-button--${variant.value}`,
  `v-button--${color.value}`,
  `v-button--${size.value}`,
  {
    'v-button--block': props.block,
    'v-button--pill': props.pill,
    'v-button--icon-only': props.iconOnly,
    'is-disabled': isDisabled.value,
    'is-loading': props.loading,
  },
])

function onClick(e: MouseEvent) {
  if (inert.value) {
    e.preventDefault()
    e.stopImmediatePropagation()
    return
  }
  emit('click', e)
}

function onKeydown(e: KeyboardEvent) {
  if (isNative.value || isLink.value) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).click()
  }
}
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    v-bind="attrs"
    :aria-busy="loading ? 'true' : undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span v-if="loading" class="v-button__icon v-button__loader">
      <slot name="loader"><VSpinner /></slot>
    </span>
    <span v-else-if="$slots.prepend || prependIcon" class="v-button__icon">
      <slot name="prepend"><component :is="prependIcon" /></slot>
    </span>
    <span v-if="loading && loadingText" class="v-button__label">{{ loadingText }}</span>
    <span
      v-else-if="$slots.default"
      :class="['v-button__label', { 'is-hidden': loading && iconOnly }]"
    >
      <slot />
    </span>
    <span v-if="!loading && ($slots.append || appendIcon)" class="v-button__icon">
      <slot name="append"><component :is="appendIcon" /></slot>
    </span>
  </component>
</template>
