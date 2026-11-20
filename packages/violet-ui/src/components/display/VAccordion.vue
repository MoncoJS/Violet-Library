<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import { IconChevronDown } from '../../icons'

export interface AccordionItem {
  value: string | number
  title: string
  content?: string
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  /** Open values (v-model). */
  modelValue?: (string | number)[]
  /** Allow several panels open. */
  multiple?: boolean
  variant?: 'outline' | 'separated' | 'flush'
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

defineOptions({ name: 'VAccordion' })
const props = withDefaults(defineProps<AccordionProps>(), {
  modelValue: undefined,
  variant: 'outline',
  headingLevel: 3,
})
const emit = defineEmits<{ 'update:modelValue': [value: (string | number)[]] }>()
const uid = useId()
const inner = ref<(string | number)[]>([])
const openValues = computed(() => props.modelValue ?? inner.value)
const root = ref<HTMLElement | null>(null)

function toggle(v: string | number) {
  const isOpen = openValues.value.includes(v)
  const next = isOpen
    ? openValues.value.filter((x) => x !== v)
    : props.multiple
      ? [...openValues.value, v]
      : [v]
  inner.value = next
  emit('update:modelValue', next)
}
function onKeydown(e: KeyboardEvent) {
  const btns = Array.from(
    root.value?.querySelectorAll<HTMLButtonElement>('.v-accordion__trigger:not(:disabled)') ?? [],
  )
  const i = btns.indexOf(document.activeElement as HTMLButtonElement)
  if (i < 0) return
  const target =
    e.key === 'ArrowDown'
      ? btns[(i + 1) % btns.length]
      : e.key === 'ArrowUp'
        ? btns[(i - 1 + btns.length) % btns.length]
        : e.key === 'Home'
          ? btns[0]
          : e.key === 'End'
            ? btns[btns.length - 1]
            : undefined
  if (target) {
    e.preventDefault()
    target.focus()
  }
}
// height animation
const onEnter = (el: Element) => {
  const h = el as HTMLElement
  h.style.height = '0'
  requestAnimationFrame(() => (h.style.height = `${h.scrollHeight}px`))
}
const onAfterEnter = (el: Element) => ((el as HTMLElement).style.height = '')
const onLeave = (el: Element) => {
  const h = el as HTMLElement
  h.style.height = `${h.scrollHeight}px`
  requestAnimationFrame(() => (h.style.height = '0'))
}
</script>

<template>
  <div ref="root" :class="['v-accordion', `v-accordion--${variant}`]" @keydown="onKeydown">
    <div
      v-for="it in items"
      :key="it.value"
      :class="['v-accordion__item', { 'is-open': openValues.includes(it.value) }]"
    >
      <component :is="`h${headingLevel}`" class="v-accordion__heading">
        <button
          :id="`v-acc-${uid}-${it.value}-btn`"
          type="button"
          class="v-accordion__trigger"
          :aria-expanded="openValues.includes(it.value)"
          :aria-controls="`v-acc-${uid}-${it.value}`"
          :disabled="it.disabled"
          @click="toggle(it.value)"
        >
          <span class="v-accordion__title"
            ><slot name="title" :item="it">{{ it.title }}</slot></span
          >
          <IconChevronDown class="v-accordion__chevron" aria-hidden="true" />
        </button>
      </component>
      <Transition name="v-collapse" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
        <div
          v-show="openValues.includes(it.value)"
          :id="`v-acc-${uid}-${it.value}`"
          class="v-accordion__panel"
          role="region"
          :aria-labelledby="`v-acc-${uid}-${it.value}-btn`"
        >
          <div class="v-accordion__content">
            <slot :name="`item-${it.value}`" :item="it"
              ><slot :item="it">{{ it.content }}</slot></slot
            >
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
