import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import type { DataTableColumn } from './types'
import VDataTable from './VDataTable.vue'

interface Person extends Record<string, unknown> {
  id: number
  name: string
  role: string
  spend: number
}
const rows: Person[] = Array.from({ length: 34 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  role: ['Admin', 'Editor', 'Viewer'][i % 3]!,
  spend: (i * 937) % 4000,
}))
const columns: DataTableColumn<Person>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'spend', label: 'Spend', sortable: true, align: 'right', format: (v) => `$${v}` },
]

const meta = {
  title: 'Data/Data Table',
  component: VDataTable as unknown as Record<string, unknown>,
  tags: ['autodocs'],
  args: {
    rows,
    columns,
    multiSort: true,
    exportable: true,
    pageSize: 5,
    pageSizes: [5, 10, 25],
  },
  render: (args: Record<string, unknown>) => ({
    components: { VDataTable },
    setup: () => ({ args, selected: ref([]) }),
    template: '<VDataTable v-bind="args" v-model:selected="selected" />',
  }),
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Loading: Story = { args: { loading: true, rows: [] } }
export const Empty: Story = { args: { rows: [] } }
