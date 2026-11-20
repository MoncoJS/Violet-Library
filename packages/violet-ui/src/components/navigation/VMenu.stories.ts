import type { Meta, StoryObj } from '@storybook/vue3'
import VButton from '../VButton.vue'
import VMenu from './VMenu.vue'

const meta = {
  title: 'Navigation/Menu',
  component: VMenu,
  tags: ['autodocs'],
  args: {
    label: 'Project actions',
    items: [
      {
        heading: 'Project',
      },
      {
        label: 'Edit',
        shortcut: '⌘E',
      },
      {
        label: 'Duplicate',
      },
      {
        divider: true,
      },
      {
        label: 'Delete',
        danger: true,
      },
    ],
  },
  render: (args) => ({
    components: { VMenu, VButton },
    setup: () => ({ args }),
    template:
      '<VMenu v-bind="args"><template #trigger="{ props }"><VButton v-bind="props" variant="outline" color="neutral">Actions</VButton></template></VMenu>',
  }),
} satisfies Meta<typeof VMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
