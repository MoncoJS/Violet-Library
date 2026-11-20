<script setup lang="ts">
import type { Component } from 'vue'
import { IconCheck, IconClose } from '../../icons'
import type { ColorRole } from '../../theme'

export interface ChipProps {
  label?: string
  color?: ColorRole
  variant?: 'soft' | 'solid' | 'outline'
  size?: 'sm' | 'md'
  icon?: Component
  /** Toggleable filter chip (v-model:selected). */
  selectable?: boolean
  selected?: boolean
  closable?: boolean
  disabled?: boolean
}

defineOptions({ name: 'VChip' })
const props = withDefaults(defineProps<ChipProps>(), {
  color: 'neutral',
  variant: 'soft',
  size: 'md',
})
const emit = defineEmits<{
  'update:selected': [value: boolean]
  close: []
  click: [e: MouseEvent]
}>()

function onClick(e: MouseEvent) {
  if (props.disabled) return
  if (props.selectable) emit('update:selected', !props.selected)
  emit('click', e)
}
</script>

<template>
  <span
    :class="[
      'v-chip',
      `v-chip--${variant}`,
      `v-chip--${size}`,
      `v-role--${color}`,
      { 'is-selected': selected, 'is-disabled': disabled, 'is-interactive': selectable },
    ]"
  >
    <component
      :is="selectable ? 'button' : 'span'"
      :type="selectable ? 'button' : undefined"
      class="v-chip__main"
      :aria-pressed="selectable ? !!selected : undefined"
      :disabled="selectable ? disabled : undefined"
      @click="onClick"
    >
      <IconCheck v-if="selectable && selected" class="v-chip__icon" aria-hidden="true" />
      <component :is="icon" v-else-if="icon" class="v-chip__icon" aria-hidden="true" />
      <span class="v-chip__label"
        ><slot>{{ label }}</slot></span
      >
    </component>
    <button
      v-if="closable"
      type="button"
      class="v-chip__close"
      :aria-label="`Remove ${label ?? ''}`.trim()"
      :disabled="disabled"
      @click.stop="emit('close')"
    >
      <IconClose />
    </button>
  </span>
</template>
