<script setup lang="ts">
import { IconMoon, IconSun, VButton, VButtonGroup, useTheme } from 'violet-ui'

const theme = useTheme()
const options = [
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
  { value: 'system', label: 'System', icon: undefined },
] as const
</script>

<template>
  <VButtonGroup size="sm" color="neutral" label="Color theme">
    <VButton
      v-for="option in options"
      :key="option.value"
      :variant="theme.preference.value === option.value ? 'soft' : 'ghost'"
      :aria-pressed="theme.preference.value === option.value"
      :prepend-icon="option.icon"
      @click="theme.setTheme(option.value)"
    >
      {{ option.label }}
    </VButton>
  </VButtonGroup>
</template>
