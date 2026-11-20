import type { Meta, StoryObj } from '@storybook/vue3'
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
