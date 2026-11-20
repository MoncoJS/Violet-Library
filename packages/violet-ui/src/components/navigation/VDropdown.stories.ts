import type { Meta, StoryObj } from '@storybook/vue3'
import VButton from '../VButton.vue'
import VDropdown from './VDropdown.vue'

const meta = {
  title: 'Navigation/Dropdown',
  component: VDropdown,
  tags: ['autodocs'],
  args: {
    placement: 'bottom-start',
  },
  render: (args) => ({
    components: { VDropdown, VButton },
    setup: () => ({ args }),
    template:
      '<VDropdown v-bind="args"><template #trigger="{ props }"><VButton v-bind="props" variant="outline" color="neutral">Open</VButton></template><div style="padding:1rem;width:14rem">Any content</div></VDropdown>',
  }),
} satisfies Meta<typeof VDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
