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
    setup: () => ({ args, value: ref(null) }),
    template: '<VDateRangePicker v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VDateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
