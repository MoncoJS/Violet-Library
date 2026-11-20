import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VEmptyState from './VEmptyState.vue'

const meta = {
  title: 'Data Display/Empty State',
  component: VEmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No invoices yet',
    description: 'Invoices appear after your first billing cycle.',
  },
  render: (args) => ({
    components: { VEmptyState },
    setup: () => ({ args }),
    template: '<VEmptyState v-bind="args" />',
  }),
} satisfies Meta<typeof VEmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Small: Story = { args: { size: 'sm' } }
export const TitleOnly: Story = { args: {} }
export const WithActions: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<VEmptyState title="No projects yet" description="Create your first project to get started."><template #actions><VButton :prepend-icon="icons.IconPlus">New project</VButton><VButton variant="outline" color="neutral">Import</VButton></template></VEmptyState>',
  }),
}
export const NoSearchResults: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<VEmptyState :icon="icons.IconSearch" title="No results for “quarterly”" description="Try a different keyword or clear the filters." size="sm"><template #actions><VButton size="sm" variant="ghost">Clear filters</VButton></template></VEmptyState>',
  }),
}
