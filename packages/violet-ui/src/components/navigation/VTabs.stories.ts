import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VTabs from './VTabs.vue'

const meta = {
  title: 'Navigation/Tabs',
  component: VTabs,
  tags: ['autodocs'],
  args: {
    variant: 'line',
    items: [
      {
        value: 'a',
        label: 'Overview',
      },
      {
        value: 'b',
        label: 'Activity',
        badge: 3,
      },
      {
        value: 'c',
        label: 'Archived',
        disabled: true,
      },
    ],
  },
  render: (args) => ({
    components: { VTabs },
    setup: () => ({ args, value: ref('a') }),
    template:
      '<VTabs v-bind="args" v-model="value"><template #default="{ item }">Panel: {{ item.label }}</template></VTabs>',
  }),
} satisfies Meta<typeof VTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
