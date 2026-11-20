<script setup lang="ts">
import { computed } from 'vue'
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '../../icons'
import type { ComponentSize } from '../../theme'

export interface PaginationProps {
  /** 1-based current page. */
  modelValue?: number
  total: number
  pageSize?: number
  /** Pages shown on each side of the current one. */
  siblings?: number
  showEdges?: boolean
  /** Compact "Page x of y" layout (good for mobile). */
  simple?: boolean
  size?: Extract<ComponentSize, 'sm' | 'md'>
  disabled?: boolean
  label?: string
}

defineOptions({ name: 'VPagination' })
const props = withDefaults(defineProps<PaginationProps>(), {
  modelValue: 1,
  pageSize: 10,
  siblings: 1,
  size: 'md',
  label: 'Pagination',
})
const emit = defineEmits<{ 'update:modelValue': [page: number]; change: [page: number] }>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const page = computed(() => Math.min(Math.max(1, props.modelValue), pageCount.value))

type Item = number | 'gap-start' | 'gap-end'
const items = computed<Item[]>(() => {
  const n = pageCount.value
  const s = props.siblings
  const totalSlots = s * 2 + 5
  if (n <= totalSlots) return Array.from({ length: n }, (_, i) => i + 1)
  const left = Math.max(page.value - s, 1)
  const right = Math.min(page.value + s, n)
  const showLeftGap = left > 3
  const showRightGap = right < n - 2
  if (!showLeftGap) return [...Array.from({ length: 3 + 2 * s }, (_, i) => i + 1), 'gap-end', n]
  if (!showRightGap)
    return [1, 'gap-start', ...Array.from({ length: 3 + 2 * s }, (_, i) => n - (2 + 2 * s) + i)]
  return [
    1,
    'gap-start',
    ...Array.from({ length: right - left + 1 }, (_, i) => left + i),
    'gap-end',
    n,
  ]
})

function go(p: number) {
  const next = Math.min(Math.max(1, p), pageCount.value)
  if (next === page.value || props.disabled) return
  emit('update:modelValue', next)
  emit('change', next)
}
</script>

<template>
  <nav :class="['v-pagination', `v-pagination--${size}`]" :aria-label="label">
    <ul class="v-pagination__list">
      <li v-if="showEdges">
        <button
          type="button"
          class="v-pagination__btn"
          aria-label="First page"
          :disabled="disabled || page === 1"
          @click="go(1)"
        >
          <IconChevronsLeft />
        </button>
      </li>
      <li>
        <button
          type="button"
          class="v-pagination__btn"
          aria-label="Previous page"
          :disabled="disabled || page === 1"
          @click="go(page - 1)"
        >
          <IconChevronLeft />
        </button>
      </li>
      <li v-if="simple" class="v-pagination__simple" aria-live="polite">
        Page {{ page }} of {{ pageCount }}
      </li>
      <template v-else>
        <li v-for="it in items" :key="it">
          <span v-if="typeof it !== 'number'" class="v-pagination__gap" aria-hidden="true">…</span>
          <button
            v-else
            type="button"
            :class="['v-pagination__btn', 'v-pagination__page', { 'is-active': it === page }]"
            :aria-label="`Page ${it}`"
            :aria-current="it === page ? 'page' : undefined"
            :disabled="disabled"
            @click="go(it)"
          >
            {{ it }}
          </button>
        </li>
      </template>
      <li>
        <button
          type="button"
          class="v-pagination__btn"
          aria-label="Next page"
          :disabled="disabled || page === pageCount"
          @click="go(page + 1)"
        >
          <IconChevronRight />
        </button>
      </li>
      <li v-if="showEdges">
        <button
          type="button"
          class="v-pagination__btn"
          aria-label="Last page"
          :disabled="disabled || page === pageCount"
          @click="go(pageCount)"
        >
          <IconChevronsRight />
        </button>
      </li>
    </ul>
  </nav>
</template>
