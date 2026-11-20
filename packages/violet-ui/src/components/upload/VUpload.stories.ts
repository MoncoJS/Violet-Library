import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VUpload from './VUpload.vue'

const meta = {
  title: 'Upload/Upload',
  component: VUpload,
  tags: ['autodocs'],
  args: {
    label: 'Attachments',
    accept: 'image/*,.pdf',
    maxSize: 5000000,
  },
  render: (args) => ({
    components: { VUpload },
    setup: () => ({ args, value: ref([]) }),
    template: '<VUpload v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
