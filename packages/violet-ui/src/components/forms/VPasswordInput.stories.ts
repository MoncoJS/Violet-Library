import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VPasswordInput from './VPasswordInput.vue'

const meta = {
  title: 'Forms/Password Input',
  component: VPasswordInput,
  tags: ['autodocs'],
  args: {
    label: 'Password',
    strength: true,
  },
  render: (args) => ({
    components: { VPasswordInput },
    setup: () => ({ args, value: ref('') }),
    template: '<VPasswordInput v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VPasswordInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
