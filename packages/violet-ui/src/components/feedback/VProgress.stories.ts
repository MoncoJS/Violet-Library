import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VProgress from './VProgress.vue'

const meta = {
  title: 'Feedback/Progress',
  component: VProgress,
  tags: ['autodocs'],
  args: {
    value: 64,
    label: 'Storage',
    showValue: true,
    variant: 'linear',
    color: 'primary',
  },
  render: (args) => ({
    components: { VProgress },
    setup: () => ({ args }),
    template: '<VProgress v-bind="args" />',
  }),
} satisfies Meta<typeof VProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Indeterminate: Story = { args: { showValue: false } }
export const Striped: Story = { args: { striped: true } }
export const Success: Story = { args: { color: 'success', value: 100 } }
export const Danger: Story = { args: { color: 'danger', value: 95, label: 'Quota' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const Circular: Story = { args: { variant: 'circular' } }
export const CircularIndeterminate: Story = { args: { variant: 'circular' } }
export const AllColors: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:grid;gap:1rem;max-width:30rem"><VProgress v-for="(c,i) in [\'primary\',\'success\',\'warning\',\'danger\',\'info\']" :key="c" :color="c" :value="20 + i * 18" :label="c" show-value /></div>',
  }),
}
export const CircularSet: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:flex;gap:1.5rem"><VProgress v-for="(c,i) in [\'primary\',\'success\',\'warning\',\'danger\']" :key="c" variant="circular" :color="c" :value="25 * (i + 1)" show-value /></div>',
  }),
}
