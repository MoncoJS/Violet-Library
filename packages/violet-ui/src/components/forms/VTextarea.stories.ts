import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VTextarea from './VTextarea.vue'

const meta = {
  title: 'Forms/Textarea',
  component: VTextarea,
  tags: ['autodocs'],
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    maxlength: 160,
    showCount: true,
    autoResize: true,
  },
  render: (args) => ({
    components: { VTextarea },
    setup: () => ({ args, value: ref('') }),
    template: '<VTextarea v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
