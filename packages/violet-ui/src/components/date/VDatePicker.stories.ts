import type { Meta, StoryObj } from '@storybook/vue3'
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
    setup: () => ({ args, value: ref(null) }),
    template: '<VDatePicker v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VDatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
