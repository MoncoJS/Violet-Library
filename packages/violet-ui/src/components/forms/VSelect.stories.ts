import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VSelect } from './select'

const meta = {
  title: 'Forms/Select',
  component: VSelect,
  tags: ['autodocs'],
  args: {
    label: 'Country',
    placeholder: 'Choose a country',
    clearable: true,
    options: ['Thailand', 'Japan', 'Germany', 'Brazil'],
  },
  render: (args) => ({
    components: { VSelect },
    setup: () => ({ args, value: ref(null) }),
    template: '<VSelect v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
