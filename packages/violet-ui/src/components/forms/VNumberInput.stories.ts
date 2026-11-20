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
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          2,
      ),
    }),
    template: '<VNumberInput v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VNumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const Decimal: Story = {
  args: { label: 'Price', step: 0.01, min: 0, prefix: '$', modelValue: 9.99 },
}
export const WithSuffix: Story = { args: { label: 'Weight', suffix: 'kg', step: 0.5 } }
export const NoControls: Story = { args: { hideControls: true } }
export const WithError: Story = { args: { error: 'Too many seats' } }
export const Disabled: Story = { args: { disabled: true } }
export const Small: Story = { args: { size: 'sm' } }
