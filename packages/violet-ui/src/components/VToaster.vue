<script setup lang="ts">
import { computed } from 'vue'
import { useToast, type ToastPosition } from '../toast'
import VToast from './VToast.vue'

defineOptions({ name: 'VToaster' })
const props = withDefaults(defineProps<{ position?: ToastPosition; label?: string }>(), {
  label: 'Notifications',
})
const store = useToast()
const position = computed(() => props.position ?? store.position)
const fromTop = computed(() => position.value.startsWith('top'))
</script>

<template>
  <Teleport to="body">
    <section :class="['v-toaster', `v-toaster--${position}`]" :aria-label="label" tabindex="-1">
      <TransitionGroup
        :name="fromTop ? 'v-toast-top' : 'v-toast-bottom'"
        tag="ol"
        class="v-toaster__list"
      >
        <li v-for="t in store.toasts.value" :key="t.id" class="v-toaster__item">
          <VToast :toast="t" @dismiss="store.dismiss" @pause="store.pause" @resume="store.resume" />
        </li>
      </TransitionGroup>
    </section>
  </Teleport>
</template>
