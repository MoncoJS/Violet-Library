import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import VCheckbox from './VCheckbox.vue'

const meta = {
  title: 'Forms/Checkbox',
  component: VCheckbox,
  tags: ['autodocs'],
  args: {
    label: 'I agree to the terms',
    description: 'You can unsubscribe at any time.',
  },
  render: (args) => ({
    components: { VCheckbox },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          false,
      ),
    }),
    template: '<VCheckbox v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VCheckbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Checked: Story = { args: { modelValue: true } }
export const Indeterminate: Story = { args: { indeterminate: true } }
export const WithError: Story = { args: { error: true, label: 'You must accept the terms' } }
export const Disabled: Story = { args: { disabled: true } }
export const DisabledChecked: Story = { args: { disabled: true, modelValue: true } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const Colors: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:flex;gap:1rem;flex-wrap:wrap"><VCheckbox v-for="c in [\'primary\',\'secondary\',\'success\',\'warning\',\'danger\',\'info\']" :key="c" :color="c" :label="c" :model-value="true" /></div>',
  }),
}
