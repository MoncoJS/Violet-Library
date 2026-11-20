import type { Meta, StoryObj } from '@storybook/vue3'
import VTag from './VTag.vue'

const meta = {
  title: 'Data Display/Tag',
  component: VTag,
  tags: ['autodocs'],
  args: {
    label: 'Active',
    color: 'success',
    dot: true,
  },
  render: (args) => ({
    components: { VTag },
    setup: () => ({ args }),
    template: '<VTag v-bind="args" />',
  }),
} satisfies Meta<typeof VTag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
