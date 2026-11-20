<script setup lang="ts" generic="Row extends Record<string, any>">
/**
 * Data table with sorting (multi-column with Shift), global search,
 * pagination, row selection, column visibility, CSV export and a stacked
 * "card" layout on narrow screens. Works client-side by default; set
 * `server` and listen to `@query` to drive it from an API.
 */
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import {
  IconArrowDown,
  IconArrowUp,
  IconArrowUpDown,
  IconColumns,
  IconDownload,
  IconSearch,
} from '../../icons'
import VButton from '../VButton.vue'
import VInput from '../VInput.vue'
import VCheckbox from '../forms/VCheckbox.vue'
import VSelectBase from '../forms/VSelectBase.vue'
import VDropdown from '../navigation/VDropdown.vue'
import VPagination from '../navigation/VPagination.vue'
import VEmptyState from '../display/VEmptyState.vue'
import VSkeleton from '../feedback/VSkeleton.vue'
import { downloadCSV, toCSV } from './csv'
import type { DataTableColumn, DataTableQuery, SortState } from './types'

const props = withDefaults(
  defineProps<{
    rows: Row[]
    columns: DataTableColumn<Row>[]
    /** Unique row id: property name or function. */
    rowKey?: string | ((row: Row) => string | number)
    /** Selected row keys (v-model:selected). Enables the checkbox column. */
    selected?: (string | number)[]
    selectable?: boolean
    /** v-model:sort */
    sort?: SortState[]
    multiSort?: boolean
    /** v-model:search */
    search?: string
    searchable?: boolean
    searchPlaceholder?: string
    /** v-model:page (1-based) */
    page?: number
    pageSize?: number
    pageSizes?: number[]
    /** Disable pagination (render all rows). */
    paginate?: boolean
    /** Rows are already filtered/sorted/paged by the server. */
    server?: boolean
    /** Total row count for server mode. */
    total?: number
    loading?: boolean
    /** CSV export button (true or file name). */
    exportable?: boolean | string
    /** Column visibility toggle. */
    columnToggle?: boolean
    /** v-model:hiddenColumns */
    hiddenColumns?: string[]
    /** Stack rows as cards below this viewport width (px). 0 disables. */
    responsiveBreakpoint?: number
    stickyHeader?: boolean
    striped?: boolean
    dense?: boolean
    hover?: boolean
    emptyTitle?: string
    emptyText?: string
    caption?: string
  }>(),
  {
    rowKey: 'id',
    selected: undefined,
    sort: undefined,
    search: undefined,
    page: undefined,
    pageSize: 10,
    pageSizes: () => [10, 25, 50, 100],
    paginate: true,
    searchable: true,
    searchPlaceholder: 'Search…',
    columnToggle: true,
    hiddenColumns: undefined,
    responsiveBreakpoint: 640,
    hover: true,
    emptyTitle: 'No results',
    emptyText: 'Try adjusting your search or filters.',
  },
)

const emit = defineEmits<{
  'update:selected': [keys: (string | number)[]]
  'update:sort': [sort: SortState[]]
  'update:search': [q: string]
  'update:page': [page: number]
  'update:pageSize': [size: number]
  'update:hiddenColumns': [keys: string[]]
  query: [q: DataTableQuery]
  rowClick: [row: Row, event: MouseEvent]
}>()

defineSlots<
  {
    [K in `cell-${string}`]?: (p: {
      row: Row
      value: unknown
      column: DataTableColumn<Row>
    }) => unknown
  } & {
    toolbar?: () => unknown
    actions?: (p: { selected: Row[] }) => unknown
    empty?: () => unknown
    [K: `header-${string}`]: ((p: { column: DataTableColumn<Row> }) => unknown) | undefined
  }
>()

const uid = useId()

// ---------------------------------------------------------- local state (controlled or not)
const localSort = ref<SortState[]>([])
const localSearch = ref('')
const localPage = ref(1)
const localPageSize = ref(props.pageSize)
const localHidden = ref<string[]>(props.columns.filter((c) => c.hidden).map((c) => c.key))
const localSelected = ref<(string | number)[]>([])

const sortState = computed(() => props.sort ?? localSort.value)
const searchQ = computed(() => props.search ?? localSearch.value)
const pageNum = computed(() => props.page ?? localPage.value)
const size = computed(() => localPageSize.value)
const hidden = computed(() => props.hiddenColumns ?? localHidden.value)
const selectedKeys = computed(() => props.selected ?? localSelected.value)
const showSelection = computed(() => props.selectable || props.selected !== undefined)

watch(
  () => props.pageSize,
  (v) => (localPageSize.value = v),
)

// ---------------------------------------------------------- helpers
const keyOf = (row: Row): string | number =>
  typeof props.rowKey === 'function' ? props.rowKey(row) : (row[props.rowKey] as string | number)
const readPath = (row: Row, path: string) =>
  path
    .split('.')
    .reduce<unknown>((o, k) => (o == null ? o : (o as Record<string, unknown>)[k]), row)
const valueOf = (row: Row, c: DataTableColumn<Row>) =>
  c.value ? c.value(row) : readPath(row, c.key)
const textOf = (row: Row, c: DataTableColumn<Row>) => {
  const v = valueOf(row, c)
  return c.format ? c.format(v, row) : v === null || v === undefined ? '' : String(v)
}

const visibleColumns = computed(() => props.columns.filter((c) => !hidden.value.includes(c.key)))

// ---------------------------------------------------------- pipeline
const filtered = computed(() => {
  if (props.server) return props.rows
  const q = searchQ.value.trim().toLowerCase()
  if (!q) return props.rows
  const cols = props.columns.filter((c) => c.searchable !== false)
  return props.rows.filter((r) => cols.some((c) => textOf(r, c).toLowerCase().includes(q)))
})

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
function compare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b)
  return collator.compare(String(a), String(b))
}
const sorted = computed(() => {
  if (props.server || !sortState.value.length) return filtered.value
  const specs = sortState.value
    .map((s) => ({ s, c: props.columns.find((c) => c.key === s.key) }))
    .filter((x): x is { s: SortState; c: DataTableColumn<Row> } => !!x.c)
  return filtered.value
    .map((row, i) => ({ row, i }))
    .sort((x, y) => {
      for (const { s, c } of specs) {
        const r = c.sort ? c.sort(x.row, y.row) : compare(valueOf(x.row, c), valueOf(y.row, c))
        if (r) return s.direction === 'asc' ? r : -r
      }
      return x.i - y.i // stable
    })
    .map((x) => x.row)
})

const totalRows = computed(() =>
  props.server ? (props.total ?? props.rows.length) : sorted.value.length,
)
const pageCount = computed(() => Math.max(1, Math.ceil(totalRows.value / size.value)))
const pageRows = computed(() => {
  if (props.server || !props.paginate) return sorted.value
  const start = (Math.min(pageNum.value, pageCount.value) - 1) * size.value
  return sorted.value.slice(start, start + size.value)
})
const rangeText = computed(() => {
  if (!totalRows.value) return '0 results'
  const start = props.paginate ? (pageNum.value - 1) * size.value + 1 : 1
  const end = props.paginate
    ? Math.min(totalRows.value, pageNum.value * size.value)
    : totalRows.value
  return `${start}–${end} of ${totalRows.value}`
})

// ---------------------------------------------------------- actions
function emitQuery() {
  emit('query', {
    page: pageNum.value,
    pageSize: size.value,
    search: searchQ.value,
    sort: sortState.value,
  })
}
function setPage(p: number) {
  localPage.value = p
  emit('update:page', p)
  emitQuery()
}
function setSearch(q: string) {
  localSearch.value = q
  emit('update:search', q)
  setPage(1)
}
function setPageSize(n: unknown) {
  localPageSize.value = Number(n)
  emit('update:pageSize', Number(n))
  setPage(1)
}
function toggleSort(c: DataTableColumn<Row>, e: MouseEvent | KeyboardEvent) {
  if (!c.sortable) return
  const cur = sortState.value.find((s) => s.key === c.key)
  const nextDir: SortState['direction'] | null = !cur
    ? 'asc'
    : cur.direction === 'asc'
      ? 'desc'
      : null
  const multi = props.multiSort && e.shiftKey
  let next = multi ? sortState.value.filter((s) => s.key !== c.key) : []
  if (nextDir)
    next = multi
      ? [...next, { key: c.key, direction: nextDir }]
      : [{ key: c.key, direction: nextDir }]
  localSort.value = next
  emit('update:sort', next)
  setPage(1)
}
const sortOf = (c: DataTableColumn<Row>) => sortState.value.find((s) => s.key === c.key)
const sortIndex = (c: DataTableColumn<Row>) => sortState.value.findIndex((s) => s.key === c.key)
const ariaSort = (c: DataTableColumn<Row>) => {
  const s = sortOf(c)
  return !c.sortable ? undefined : s ? (s.direction === 'asc' ? 'ascending' : 'descending') : 'none'
}

// selection
function setSelected(keys: (string | number)[]) {
  localSelected.value = keys
  emit('update:selected', keys)
}
const pageKeys = computed(() => pageRows.value.map(keyOf))
const allOnPage = computed(
  () => pageKeys.value.length > 0 && pageKeys.value.every((k) => selectedKeys.value.includes(k)),
)
const someOnPage = computed(
  () => !allOnPage.value && pageKeys.value.some((k) => selectedKeys.value.includes(k)),
)
function togglePage(on: unknown) {
  const rest = selectedKeys.value.filter((k) => !pageKeys.value.includes(k))
  setSelected(on ? [...rest, ...pageKeys.value] : rest)
}
function toggleRow(row: Row, on: unknown) {
  const k = keyOf(row)
  setSelected(on ? [...selectedKeys.value, k] : selectedKeys.value.filter((x) => x !== k))
}
const selectedRows = computed(() => props.rows.filter((r) => selectedKeys.value.includes(keyOf(r))))
const selectAllMatching = () => setSelected(sorted.value.map(keyOf))

// columns
function toggleColumn(key: string, show: unknown) {
  const next = show ? hidden.value.filter((k) => k !== key) : [...hidden.value, key]
  localHidden.value = next
  emit('update:hiddenColumns', next)
}

// export
function exportCSV() {
  const cols = visibleColumns.value.filter((c) => c.exportValue !== false)
  const source = selectedRows.value.length ? selectedRows.value : sorted.value
  const csv = toCSV(
    cols.map((c) => c.label),
    source.map((r) =>
      cols.map((c) => (typeof c.exportValue === 'function' ? c.exportValue(r) : textOf(r, c))),
    ),
  )
  downloadCSV(typeof props.exportable === 'string' ? props.exportable : 'export.csv', csv)
}

// keep page valid when data shrinks
watch(pageCount, (n) => {
  if (pageNum.value > n) setPage(n)
})

// responsive
const narrow = ref(false)
let mq: MediaQueryList | undefined
const onMq = (e: MediaQueryListEvent | MediaQueryList) => (narrow.value = e.matches)
onMounted(() => {
  if (!props.responsiveBreakpoint || typeof window === 'undefined' || !window.matchMedia) return
  mq = window.matchMedia(`(max-width: ${props.responsiveBreakpoint - 0.02}px)`)
  onMq(mq)
  mq.addEventListener('change', onMq)
})
onBeforeUnmount(() => mq?.removeEventListener('change', onMq))

const colCount = computed(() => visibleColumns.value.length + (showSelection.value ? 1 : 0))
const pageSizeOptions = computed(() =>
  props.pageSizes.map((n) => ({ label: `${n} / page`, value: n })),
)
const searchModel = computed({ get: () => searchQ.value, set: (v: string) => setSearch(v ?? '') })

defineExpose({ exportCSV, clearSelection: () => setSelected([]), rows: sorted })
</script>

<template>
  <div
    :class="[
      'v-table',
      {
        'is-narrow': narrow,
        'v-table--dense': dense,
        'v-table--striped': striped,
        'v-table--hover': hover,
        'is-loading': loading,
      },
    ]"
  >
    <!-- toolbar -->
    <div v-if="searchable || exportable || columnToggle || $slots.toolbar" class="v-table__toolbar">
      <VInput
        v-if="searchable"
        v-model="searchModel"
        class="v-table__search"
        type="search"
        size="sm"
        clearable
        :prepend-icon="IconSearch"
        :placeholder="searchPlaceholder"
        aria-label="Search table"
      />
      <slot name="toolbar" />
      <div class="v-table__tools">
        <VDropdown v-if="columnToggle" placement="bottom-end">
          <template #trigger="{ props: tp }">
            <VButton
              v-bind="tp"
              size="sm"
              variant="outline"
              color="neutral"
              :prepend-icon="IconColumns"
              >Columns</VButton
            >
          </template>
          <fieldset class="v-table__columns">
            <legend class="v-menu__heading">Visible columns</legend>
            <VCheckbox
              v-for="c in columns"
              :key="c.key"
              size="sm"
              :label="c.label"
              :model-value="!hidden.includes(c.key)"
              :disabled="
                c.alwaysVisible || (!hidden.includes(c.key) && visibleColumns.length === 1)
              "
              @update:model-value="toggleColumn(c.key, $event)"
            />
          </fieldset>
        </VDropdown>
        <VButton
          v-if="exportable"
          size="sm"
          variant="outline"
          color="neutral"
          :prepend-icon="IconDownload"
          @click="exportCSV"
        >
          Export<span v-if="selectedRows.length" class="v-table__export-count"
            >&nbsp;({{ selectedRows.length }})</span
          >
        </VButton>
      </div>
    </div>

    <!-- bulk actions -->
    <div v-if="showSelection && selectedKeys.length" class="v-table__bulk" role="status">
      <span>{{ selectedKeys.length }} selected</span>
      <button
        v-if="!server && allOnPage && selectedKeys.length < sorted.length"
        type="button"
        class="v-date__link"
        @click="selectAllMatching"
      >
        Select all {{ sorted.length }}
      </button>
      <button type="button" class="v-date__link" @click="setSelected([])">Clear</button>
      <div class="v-table__bulk-actions"><slot name="actions" :selected="selectedRows" /></div>
    </div>

    <!-- table -->
    <div
      :class="['v-table__scroll', { 'is-sticky': stickyHeader }]"
      :aria-busy="loading ? 'true' : undefined"
    >
      <table class="v-table__table" :aria-describedby="`${uid}-range`">
        <caption v-if="caption" class="v-table__caption">
          {{
            caption
          }}
        </caption>
        <thead class="v-table__head">
          <tr>
            <th v-if="showSelection" class="v-table__th v-table__select" scope="col">
              <VCheckbox
                size="sm"
                :model-value="allOnPage"
                :indeterminate="someOnPage"
                :disabled="!pageRows.length"
                aria-label="Select all rows on this page"
                @update:model-value="togglePage"
              />
            </th>
            <th
              v-for="c in visibleColumns"
              :key="c.key"
              scope="col"
              :aria-sort="ariaSort(c)"
              :class="[
                'v-table__th',
                `is-${c.align ?? 'left'}`,
                { 'is-sortable': c.sortable, 'is-sorted': !!sortOf(c), 'is-sticky-col': c.sticky },
              ]"
              :style="{ width: c.width }"
            >
              <button
                v-if="c.sortable"
                type="button"
                class="v-table__sort"
                @click="toggleSort(c, $event)"
              >
                <slot :name="`header-${c.key}`" :column="c">{{ c.label }}</slot>
                <span class="v-table__sort-icon" aria-hidden="true">
                  <IconArrowUp v-if="sortOf(c)?.direction === 'asc'" />
                  <IconArrowDown v-else-if="sortOf(c)?.direction === 'desc'" />
                  <IconArrowUpDown v-else />
                </span>
                <sup
                  v-if="multiSort && sortState.length > 1 && sortIndex(c) >= 0"
                  class="v-table__sort-order"
                  >{{ sortIndex(c) + 1 }}</sup
                >
              </button>
              <slot v-else :name="`header-${c.key}`" :column="c">{{ c.label }}</slot>
            </th>
          </tr>
        </thead>
        <tbody class="v-table__body">
          <template v-if="loading && !pageRows.length">
            <tr v-for="i in Math.min(size, 5)" :key="`sk-${i}`" class="v-table__row">
              <td v-for="n in colCount" :key="n" class="v-table__td"><VSkeleton /></td>
            </tr>
          </template>
          <tr v-else-if="!pageRows.length">
            <td :colspan="colCount" class="v-table__empty">
              <slot name="empty"
                ><VEmptyState size="sm" :title="emptyTitle" :description="emptyText"
              /></slot>
            </td>
          </tr>
          <tr
            v-for="row in pageRows"
            v-else
            :key="keyOf(row)"
            :class="['v-table__row', { 'is-selected': selectedKeys.includes(keyOf(row)) }]"
            :aria-selected="showSelection ? selectedKeys.includes(keyOf(row)) : undefined"
            @click="emit('rowClick', row, $event)"
          >
            <td v-if="showSelection" class="v-table__td v-table__select" @click.stop>
              <VCheckbox
                size="sm"
                :model-value="selectedKeys.includes(keyOf(row))"
                :aria-label="`Select row ${keyOf(row)}`"
                @update:model-value="toggleRow(row, $event)"
              />
            </td>
            <td
              v-for="c in visibleColumns"
              :key="c.key"
              :class="['v-table__td', `is-${c.align ?? 'left'}`, { 'is-sticky-col': c.sticky }]"
              :data-label="c.label"
            >
              <slot :name="`cell-${c.key}`" :row="row" :value="valueOf(row, c)" :column="c">{{
                textOf(row, c)
              }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- footer -->
    <div v-if="paginate || totalRows" class="v-table__footer">
      <span :id="`${uid}-range`" class="v-table__range" aria-live="polite">{{ rangeText }}</span>
      <template v-if="paginate">
        <VSelectBase
          class="v-table__page-size"
          size="sm"
          aria-label="Rows per page"
          :options="pageSizeOptions"
          :model-value="size"
          @update:model-value="setPageSize"
        />
        <VPagination
          :model-value="pageNum"
          :total="totalRows"
          :page-size="size"
          size="sm"
          :simple="narrow"
          @update:model-value="setPage"
        />
      </template>
    </div>
  </div>
</template>
