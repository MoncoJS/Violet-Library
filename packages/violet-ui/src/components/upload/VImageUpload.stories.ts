import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VImageUpload from './VImageUpload.vue'

const meta = {
  title: 'Upload/Image Upload',
  component: VImageUpload,
  tags: ['autodocs'],
  args: {
    label: 'Avatar',
    shape: 'circle',
  },
  render: (args) => ({
    components: { VImageUpload },
    setup: () => ({ args, value: ref(null) }),
    template: '<VImageUpload v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VImageUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
