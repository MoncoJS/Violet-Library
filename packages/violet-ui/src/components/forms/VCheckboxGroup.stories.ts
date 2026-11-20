import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VCheckboxGroup from './VCheckboxGroup.vue'

const meta = {
  title: 'Forms/Checkbox Group',
  component: VCheckboxGroup,
  tags: ['autodocs'],
  args: {
    label: 'Notifications',
    selectAll: true,
    options: ['Email', 'SMS', 'Push'],
  },
  render: (args) => ({
    components: { VCheckboxGroup },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ?? ['Email'],
      ),
    }),
    template: '<VCheckboxGroup v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VCheckboxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const Inline: Story = { args: { inline: true, selectAll: false } }
export const WithDescriptions: Story = {
  args: {
    options: [
      { label: 'Comments', value: 'c', description: 'When someone comments on your post' },
      { label: 'Mentions', value: 'm', description: 'When someone @mentions you' },
      { label: 'Billing', value: 'b', description: 'Required for account owners', disabled: true },
    ],
  },
}
export const WithError: Story = { args: { error: 'Choose at least one channel' } }
export const Disabled: Story = { args: { disabled: true } }
