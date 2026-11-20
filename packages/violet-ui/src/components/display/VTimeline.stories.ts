import type { Meta, StoryObj } from '@storybook/vue3'
import VTimeline from './VTimeline.vue'

const meta = {
  title: 'Data Display/Timeline',
  component: VTimeline,
  tags: ['autodocs'],
  args: {
    items: [
      {
        title: 'Deployed v1.2',
        time: '2h ago',
        color: 'success',
      },
      {
        title: 'PR #42 opened',
        description: 'Add table export',
        time: 'Yesterday',
      },
      {
        title: 'Project created',
        time: 'Mar 3',
        color: 'neutral',
      },
    ],
  },
  render: (args) => ({
    components: { VTimeline },
    setup: () => ({ args }),
    template: '<VTimeline v-bind="args" />',
  }),
} satisfies Meta<typeof VTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
