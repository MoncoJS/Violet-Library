import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VDateRangePicker from './VDateRangePicker.vue'

const meta = {
  title: 'Date/Date Range Picker',
  component: VDateRangePicker,
  tags: ['autodocs'],
  args: {
    label: 'Reporting period',
    clearable: true,
  },
  render: (args) => ({
    components: { VDateRangePicker },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          null,
      ),
    }),
    template: '<VDateRangePicker v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VDateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const WithValue: Story = { args: { modelValue: ['2026-11-03', '2026-11-16'] } }
export const OneMonth: Story = { args: { months: 1 } }
export const NoPresets: Story = { args: { presets: false } }
export const WithError: Story = { args: { error: 'Choose a range' } }
export const Disabled: Story = { args: { disabled: true } }
