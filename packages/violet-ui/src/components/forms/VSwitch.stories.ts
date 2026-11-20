import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VSwitch from './VSwitch.vue'

const meta = {
  title: 'Forms/Switch',
  component: VSwitch,
  tags: ['autodocs'],
  args: {
    label: 'Weekly digest',
    description: 'Every Monday',
  },
  render: (args) => ({
    components: { VSwitch },
    setup: () => ({ args, value: ref(true) }),
    template: '<VSwitch v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
