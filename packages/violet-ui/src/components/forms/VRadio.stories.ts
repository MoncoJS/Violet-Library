import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VRadio from './VRadio.vue'

const meta = {
  title: 'Forms/Radio',
  component: VRadio,
  tags: ['autodocs'],
  args: {
    label: 'Option A',
    value: 'a',
  },
  render: (args) => ({
    components: { VRadio },
    setup: () => ({ args, value: ref('a') }),
    template: '<VRadio v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VRadio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
