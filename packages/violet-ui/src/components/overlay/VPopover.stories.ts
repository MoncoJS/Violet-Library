import type { Meta, StoryObj } from '@storybook/vue3'
import VButton from '../VButton.vue'
import VPopover from './VPopover.vue'

const meta = {
  title: 'Overlay/Popover',
  component: VPopover,
  tags: ['autodocs'],
  args: {
    title: 'Share',
    placement: 'bottom',
  },
  render: (args) => ({
    components: { VPopover, VButton },
    setup: () => ({ args }),
    template:
      '<VPopover v-bind="args"><template #trigger><VButton variant="outline" color="neutral">Open popover</VButton></template>Anyone with the link can view.</VPopover>',
  }),
} satisfies Meta<typeof VPopover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
