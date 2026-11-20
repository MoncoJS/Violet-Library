import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { VAutocomplete } from './select'

const meta = {
  title: 'Forms/Autocomplete',
  component: VAutocomplete,
  tags: ['autodocs'],
  args: {
    label: 'City',
    placeholder: 'Type to search',
    clearable: true,
    options: ['Bangkok', 'Berlin', 'Boston', 'Brisbane', 'Tokyo'],
  },
  render: (args) => ({
    components: { VAutocomplete },
    setup: () => ({ args, value: ref(null) }),
    template: '<VAutocomplete v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VAutocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
