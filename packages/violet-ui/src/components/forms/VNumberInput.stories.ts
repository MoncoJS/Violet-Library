import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VNumberInput from './VNumberInput.vue'

const meta = {
  title: 'Forms/Number Input',
  component: VNumberInput,
  tags: ['autodocs'],
  args: {
    label: 'Seats',
    min: 1,
    max: 50,
    step: 1,
    hint: 'Between 1 and 50',
  },
  render: (args) => ({
    components: { VNumberInput },
    setup: () => ({ args, value: ref(2) }),
    template: '<VNumberInput v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VNumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
