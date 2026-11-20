import type { Meta, StoryObj } from '@storybook/vue3'
import VAlert from './VAlert.vue'

const meta = {
  title: 'Feedback/Alert',
  component: VAlert,
  tags: ['autodocs'],
  args: {
    color: 'info',
    variant: 'soft',
    title: 'Scheduled maintenance',
    description: 'Read-only on Sunday 02:00–03:00 UTC.',
    closable: true,
  },
  render: (args) => ({
    components: { VAlert },
    setup: () => ({ args }),
    template: '<VAlert v-bind="args" />',
  }),
} satisfies Meta<typeof VAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
