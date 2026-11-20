import type { Meta, StoryObj } from '@storybook/vue3'
import VProgress from './VProgress.vue'

const meta = {
  title: 'Feedback/Progress',
  component: VProgress,
  tags: ['autodocs'],
  args: {
    value: 64,
    label: 'Storage',
    showValue: true,
    variant: 'linear',
    color: 'primary',
  },
  render: (args) => ({
    components: { VProgress },
    setup: () => ({ args }),
    template: '<VProgress v-bind="args" />',
  }),
} satisfies Meta<typeof VProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
