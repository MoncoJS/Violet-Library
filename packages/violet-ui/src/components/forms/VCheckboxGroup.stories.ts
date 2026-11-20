import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VCheckboxGroup from './VCheckboxGroup.vue'

const meta = {
  title: 'Forms/Checkbox Group',
  component: VCheckboxGroup,
  tags: ['autodocs'],
  args: {
    label: 'Notifications',
    selectAll: true,
    options: ['Email', 'SMS', 'Push'],
  },
  render: (args) => ({
    components: { VCheckboxGroup },
    setup: () => ({ args, value: ref(['Email']) }),
    template: '<VCheckboxGroup v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VCheckboxGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
