<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { IconUser } from '../../icons'

export interface AvatarProps {
  src?: string
  alt?: string
  /** Used for initials and a stable background color when no image. */
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

defineOptions({ name: 'VAvatar' })
const props = withDefaults(defineProps<AvatarProps>(), { size: 'md', shape: 'circle' })
const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)

const initials = computed(() =>
  (props.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join(''),
)
const hue = computed(() => {
  let h = 0
  for (const c of props.name ?? '') h = (h * 31 + c.charCodeAt(0)) % 360
  return h
})
</script>

<template>
  <span
    :class="['v-avatar', `v-avatar--${size}`, `v-avatar--${shape}`]"
    :style="!src || failed ? { '--_hue': hue } : undefined"
    :role="!src || failed ? 'img' : undefined"
    :aria-label="!src || failed ? (alt ?? name) : undefined"
  >
    <img
      v-if="src && !failed"
      :src="src"
      :alt="alt ?? name ?? ''"
      class="v-avatar__img"
      @error="failed = true"
    />
    <span v-else-if="initials" class="v-avatar__initials" aria-hidden="true">{{ initials }}</span>
    <IconUser v-else aria-hidden="true" />
    <span
      v-if="status"
      :class="['v-avatar__status', `is-${status}`]"
      :aria-label="status"
      role="img"
    />
  </span>
</template>
