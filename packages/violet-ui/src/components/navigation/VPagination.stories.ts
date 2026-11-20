import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VPagination from './VPagination.vue'

const meta = {
  title: 'Navigation/Pagination',
  component: VPagination,
  tags: ['autodocs'],
  args: {
    total: 240,
    pageSize: 10,
    showEdges: true,
  },
  render: (args) => ({
    components: { VPagination },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          4,
      ),
    }),
    template: '<VPagination v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VPagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const FewPages: Story = { args: { total: 40 } }
export const ManyPages: Story = { args: { total: 5000 } }
export const NoEdges: Story = { args: { showEdges: false } }
export const Simple: Story = { args: { simple: true } }
export const Small: Story = { args: { size: 'sm' } }
export const MoreSiblings: Story = { args: { siblings: 2, total: 500 } }
export const Disabled: Story = { args: { disabled: true } }
