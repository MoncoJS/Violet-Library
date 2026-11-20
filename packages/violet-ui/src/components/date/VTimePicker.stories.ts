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
    setup: () => ({ args, value: ref('09:30') }),
    template: '<VTimePicker v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VTimePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
