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
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          '',
      ),
    }),
    template: '<VTextarea v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VTextarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const FixedRows: Story = { args: { autoResize: false, rows: 5 } }
export const MaxRows: Story = { args: { maxRows: 4, hint: 'Grows up to 4 lines' } }
export const WithError: Story = { args: { error: 'Bio is required' } }
export const Disabled: Story = { args: { disabled: true } }
export const Readonly: Story = {
  args: { readonly: true, modelValue: 'This text cannot be edited.' },
}
