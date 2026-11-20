<script setup lang="ts">
import VSpinner from '../VSpinner.vue'

export interface LoadingOverlayProps {
  /** Show the overlay. */
  loading?: boolean
  text?: string
  /** Cover the whole viewport instead of the parent element. */
  fullscreen?: boolean
  /** Blur the content underneath. */
  blur?: boolean
}

defineOptions({ name: 'VLoadingOverlay' })
withDefaults(defineProps<LoadingOverlayProps>(), { loading: true })
</script>

<template>
  <div class="v-loading-host" :aria-busy="loading ? 'true' : undefined">
    <slot />
    <Teleport to="body" :disabled="!fullscreen">
      <Transition name="v-fade">
        <div
          v-if="loading"
          :class="['v-loading-overlay', { 'is-fullscreen': fullscreen, 'is-blur': blur }]"
          role="status"
          aria-live="polite"
        >
          <slot name="indicator"><VSpinner size="2rem" /></slot>
          <span :class="text ? 'v-loading-overlay__text' : 'v-spinner__label'">{{
            text ?? 'Loading'
          }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
