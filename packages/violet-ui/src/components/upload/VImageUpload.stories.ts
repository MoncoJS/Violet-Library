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
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          null,
      ),
    }),
    template: '<VImageUpload v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VImageUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const Square: Story = { args: { shape: 'square' } }
export const Wide: Story = { args: { shape: 'wide', label: 'Cover image', size: '9rem' } }
export const WithImage: Story = {
  args: { modelValue: 'https://picsum.photos/seed/violet/300/300' },
}
export const Large: Story = { args: { size: '12rem' } }
export const WithError: Story = { args: { error: 'Image is required' } }
export const Disabled: Story = { args: { disabled: true } }
