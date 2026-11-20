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
    setup: () => ({ args, value: ref(null) }),
    template: '<VCalendar v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VCalendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
