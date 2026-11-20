export type SortDirection = 'asc' | 'desc'
export interface SortState {
  key: string
  direction: SortDirection
}

export interface DataTableColumn<Row = Record<string, unknown>> {
  key: string
  label: string
  /** Read the cell value; defaults to `row[key]` (dot paths supported). */
  value?: (row: Row) => unknown
  /** Display formatter (also used for search and CSV unless `exportValue`). */
  format?: (value: unknown, row: Row) => string
  sortable?: boolean
  /** Custom comparator for sorting. */
  sort?: (a: Row, b: Row) => number
  /** Include in global search. Default true. */
  searchable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
  /** Hidden by default (user can show it via column toggle). */
  hidden?: boolean
  /** Cannot be hidden by the user. */
  alwaysVisible?: boolean
  /** Stick to the left edge while scrolling horizontally. */
  sticky?: boolean
  /** Value written to CSV; `false` excludes the column. */
  exportValue?: ((row: Row) => unknown) | false
}

export interface DataTableQuery {
  page: number
  pageSize: number
  search: string
  sort: SortState[]
}
