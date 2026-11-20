import type { Meta, StoryObj } from '@storybook/vue3'
import VSkeleton from './VSkeleton.vue'

const meta = {
  title: 'Feedback/Skeleton',
  component: VSkeleton,
  tags: ['autodocs'],
  args: {
    variant: 'text',
    lines: 3,
  },
  render: (args) => ({
    components: { VSkeleton },
    setup: () => ({ args }),
    template: '<div style="max-width:24rem"><VSkeleton v-bind="args" /></div>',
  }),
} satisfies Meta<typeof VSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
