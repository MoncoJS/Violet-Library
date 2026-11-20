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
    setup: () => ({ args, value: ref(4) }),
    template: '<VPagination v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VPagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
