import type { Meta, StoryObj } from '@storybook/vue3'
import VBadge from './VBadge.vue'

const meta = {
  title: 'Data Display/Badge',
  component: VBadge,
  tags: ['autodocs'],
  args: {
    content: 5,
    color: 'danger',
    variant: 'solid',
  },
  render: (args) => ({
    components: { VBadge },
    setup: () => ({ args }),
    template: '<VBadge v-bind="args" />',
  }),
} satisfies Meta<typeof VBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
