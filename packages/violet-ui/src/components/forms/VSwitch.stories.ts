import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import VSwitch from './VSwitch.vue'

const meta = {
  title: 'Forms/Switch',
  component: VSwitch,
  tags: ['autodocs'],
  args: {
    label: 'Weekly digest',
    description: 'Every Monday',
  },
  render: (args) => ({
    components: { VSwitch },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          true,
      ),
    }),
    template: '<VSwitch v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Off: Story = { args: { modelValue: false } }
export const Loading: Story = { args: { loading: true } }
export const LabelStart: Story = { args: { labelPosition: 'start' } }
export const Disabled: Story = { args: { disabled: true } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const SettingsList: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:grid;gap:1rem;max-width:26rem"><VSwitch :model-value="true" label="Email notifications" description="Product updates and news" /><VSwitch :model-value="false" label="Two-factor authentication" description="Extra security for your account" /><VSwitch :model-value="true" color="success" label="Auto-save" /><VSwitch disabled label="Beta features" description="Not available on your plan" /></div>',
  }),
}
