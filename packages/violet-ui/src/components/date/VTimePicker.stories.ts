import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VTimePicker from './VTimePicker.vue'

const meta = {
  title: 'Date/Time Picker',
  component: VTimePicker,
  tags: ['autodocs'],
  args: {
    label: 'Meeting time',
    minuteStep: 15,
    clearable: true,
  },
  render: (args) => ({
    components: { VTimePicker },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          '09:30',
      ),
    }),
    template: '<VTimePicker v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VTimePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const Hour12: Story = { args: { hour12: true } }
export const BusinessHours: Story = {
  args: { min: '09:00', max: '17:00', minuteStep: 30, hint: '09:00–17:00' },
}
export const FiveMinutes: Story = { args: { minuteStep: 5 } }
export const WithError: Story = { args: { error: 'Pick a time' } }
export const Disabled: Story = { args: { disabled: true } }
