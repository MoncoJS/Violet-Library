import type { Meta, StoryObj } from '@storybook/vue3'
import VButton from '../VButton.vue'
import VTooltip from './VTooltip.vue'

const meta = {
  title: 'Overlay/Tooltip',
  component: VTooltip,
  tags: ['autodocs'],
  args: {
    text: 'Copies the invite link',
    placement: 'top',
  },
  render: (args) => ({
    components: { VTooltip, VButton },
    setup: () => ({ args }),
    template:
      '<div style="padding:3rem"><VTooltip v-bind="args"><VButton variant="outline" color="neutral">Hover or focus me</VButton></VTooltip></div>',
  }),
} satisfies Meta<typeof VTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
