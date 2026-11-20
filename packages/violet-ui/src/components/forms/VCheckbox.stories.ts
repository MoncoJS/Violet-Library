import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VCheckbox from './VCheckbox.vue'

const meta = {
  title: 'Forms/Checkbox',
  component: VCheckbox,
  tags: ['autodocs'],
  args: {
    label: 'I agree to the terms',
    description: 'You can unsubscribe at any time.',
  },
  render: (args) => ({
    components: { VCheckbox },
    setup: () => ({ args, value: ref(false) }),
    template: '<VCheckbox v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
