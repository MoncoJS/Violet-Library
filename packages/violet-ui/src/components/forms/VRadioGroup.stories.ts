import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VRadioGroup from './VRadioGroup.vue'

const meta = {
  title: 'Forms/Radio Group',
  component: VRadioGroup,
  tags: ['autodocs'],
  args: {
    label: 'Plan',
    options: [
      {
        label: 'Starter',
        value: 'starter',
        description: 'For individuals',
      },
      {
        label: 'Pro',
        value: 'pro',
        description: 'For teams',
      },
    ],
  },
  render: (args) => ({
    components: { VRadioGroup },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          'pro',
      ),
    }),
    template: '<VRadioGroup v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VRadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const Cards: Story = { args: { variant: 'cards' } }
export const Inline: Story = {
  args: { inline: true, options: ['Daily', 'Weekly', 'Monthly'], label: 'Frequency' },
}
export const WithError: Story = { args: { error: 'Please select a plan' } }
export const Disabled: Story = { args: { disabled: true } }
export const Success: Story = { args: { color: 'success' } }
