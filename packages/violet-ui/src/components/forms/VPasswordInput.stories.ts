import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
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
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          '',
      ),
    }),
    template: '<VPasswordInput v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VPasswordInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const WithoutStrength: Story = { args: { strength: false } }
export const WithError: Story = { args: { error: 'Password is too weak' } }
export const NoLockIcon: Story = { args: { lockIcon: false } }
export const Disabled: Story = { args: { disabled: true } }
export const StrengthLevels: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:grid;gap:1rem;max-width:20rem"><VPasswordInput v-for="p in [\'abc\',\'password\',\'Password1\',\'Pa55w0rd!xyz\']" :key="p" :model-value="p" :label="p" strength /></div>',
  }),
}
