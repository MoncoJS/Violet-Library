import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VCalendar from './VCalendar.vue'

const meta = {
  title: 'Date/Calendar',
  component: VCalendar,
  tags: ['autodocs'],
  args: {
    range: false,
  },
  render: (args) => ({
    components: { VCalendar },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          null,
      ),
    }),
    template: '<VCalendar v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const Range: Story = { args: { range: true } }
export const TwoMonths: Story = { args: { range: true, months: 2 } }
export const MondayFirst: Story = { args: { firstDayOfWeek: 1 } }
export const Japanese: Story = { args: { locale: 'ja-JP' } }
