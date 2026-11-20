<script setup>
import { ref } from 'vue'
const roles = ['Admin', 'Editor', 'Viewer']
const rows = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: roles[i % 3],
  spend: (i * 937) % 4000,
}))
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'spend', label: 'Spend', sortable: true, align: 'right', format: (v) => `$${v}` },
]
const selected = ref([])
</script>

# Data table

<VDataTable v-model:selected="selected" :rows="rows" :columns="columns" multi-sort exportable="users.csv" :page-size="5" :page-sizes="[5, 10, 25]" />

```vue
<VDataTable
  v-model:selected="selected"
  :rows="users"
  :columns="columns"
  row-key="id"
  multi-sort
  exportable="users.csv"
>
  <template #cell-status="{ row }">
    <VTag :color="row.active ? 'success' : 'neutral'">{{ row.status }}</VTag>
  </template>
  <template #actions="{ selected }">
    <VButton color="danger" @click="remove(selected)">Delete</VButton>
  </template>
</VDataTable>
```

The component is generic: `Row` is inferred from `rows`, so slot props are typed.

## Features

| Feature           | How                                                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Sorting           | `sortable` per column; a click cycles asc → desc → off; <kbd>Shift</kbd>+click adds columns with `multi-sort`; custom `sort(a, b)`                                       |
| Search            | Built-in search box over `searchable` columns (matches the formatted text); `v-model:search`                                                                             |
| Pagination        | `page-size`, `page-sizes`, `v-model:page`; `:paginate="false"` shows every row                                                                                           |
| Row selection     | `selectable` or `v-model:selected` (keys from `row-key`); the header checkbox selects the page and a banner offers "Select all N"                                        |
| Column visibility | "Columns" menu; `hidden` / `always-visible` per column; `v-model:hidden-columns`                                                                                         |
| Export CSV        | `exportable` (or a file name). Exports selected rows if any, otherwise all filtered rows, visible columns only; `exportValue` per column; safe against formula injection |
| Responsive        | Below `responsive-breakpoint` (640px) rows become labelled cards                                                                                                         |
| Server mode       | `server` + `total` + `@query="({ page, pageSize, search, sort }) => load()"`                                                                                             |
| Other             | `loading` (skeleton rows), `sticky-header`, `sticky` columns, `striped`, `dense`, `empty` slot, `@row-click`                                                             |

## Column definition

```ts
interface DataTableColumn<Row> {
  key: string // dot paths work: 'company.name'
  label: string
  value?: (row: Row) => unknown
  format?: (value: unknown, row: Row) => string
  sortable?: boolean
  sort?: (a: Row, b: Row) => number
  searchable?: boolean // default true
  align?: 'left' | 'center' | 'right'
  width?: string
  hidden?: boolean
  alwaysVisible?: boolean
  sticky?: boolean
  exportValue?: ((row: Row) => unknown) | false
}
```
