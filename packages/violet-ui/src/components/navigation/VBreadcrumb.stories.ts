import type { Meta, StoryObj } from '@storybook/vue3'
import VBreadcrumb from './VBreadcrumb.vue'

const meta = {
  title: 'Navigation/Breadcrumb',
  component: VBreadcrumb,
  tags: ['autodocs'],
  args: {
    maxItems: 4,
    items: [
      {
        label: 'Home',
        href: '#',
      },
      {
        label: 'Projects',
        href: '#',
      },
      {
        label: 'Violet',
        href: '#',
      },
      {
        label: 'Settings',
        href: '#',
      },
      {
        label: 'Billing',
      },
    ],
  },
  render: (args) => ({
    components: { VBreadcrumb },
    setup: () => ({ args }),
    template: '<VBreadcrumb v-bind="args" />',
  }),
} satisfies Meta<typeof VBreadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
