import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import VDatePicker from './VDatePicker.vue'

const meta = {
  title: 'Date/Date Picker',
  component: VDatePicker,
  tags: ['autodocs'],
  args: {
    label: 'Start date',
    placeholder: 'Pick a date',
    clearable: true,
  },
  render: (args) => ({
    components: { VDatePicker },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          null,
      ),
    }),
    template: '<VDatePicker v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VDatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const WithValue: Story = { args: { modelValue: '2026-11-22' } }
export const MinMax: Story = {
  args: { min: '2026-11-01', max: '2026-12-31', hint: 'Nov–Dec 2026 only' },
}
export const MondayFirst: Story = { args: { firstDayOfWeek: 1 } }
export const ThaiLocale: Story = { args: { locale: 'th-TH', label: 'วันที่' } }
export const LongFormat: Story = {
  args: { displayFormat: { dateStyle: 'full' }, modelValue: '2026-11-22' },
}
export const WithError: Story = { args: { error: 'Date is required' } }
export const Disabled: Story = { args: { disabled: true } }
export const Inline: Story = { args: { inline: true } }
export const NoWeekends: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="max-width:20rem"><VDatePicker label="Delivery date" hint="Weekdays only" :is-date-disabled="(iso) => [0,6].includes(new Date(iso + \'T00:00\').getDay())" /></div>',
  }),
}
