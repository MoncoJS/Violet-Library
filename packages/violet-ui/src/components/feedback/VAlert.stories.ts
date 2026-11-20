import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VAlert from './VAlert.vue'

const meta = {
  title: 'Feedback/Alert',
  component: VAlert,
  tags: ['autodocs'],
  args: {
    color: 'info',
    variant: 'soft',
    title: 'Scheduled maintenance',
    description: 'Read-only on Sunday 02:00–03:00 UTC.',
    closable: true,
  },
  render: (args) => ({
    components: { VAlert },
    setup: () => ({ args }),
    template: '<VAlert v-bind="args" />',
  }),
} satisfies Meta<typeof VAlert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Success: Story = {
  args: { color: 'success', title: 'Payment received', description: 'Your invoice has been paid.' },
}
export const Warning: Story = {
  args: {
    color: 'warning',
    title: 'Storage almost full',
    description: 'You have used 92% of your quota.',
  },
}
export const Danger: Story = {
  args: { color: 'danger', title: 'Card declined', description: 'Update your billing details.' },
}
export const Outline: Story = { args: { variant: 'outline' } }
export const Solid: Story = { args: { variant: 'solid' } }
export const Accent: Story = { args: { variant: 'accent' } }
export const TitleOnly: Story = { args: { closable: false } }
export const NoIcon: Story = { args: { icon: false } }
export const AllColors: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:grid;gap:.75rem;max-width:40rem"><VAlert v-for="c in [\'info\',\'success\',\'warning\',\'danger\',\'primary\',\'neutral\']" :key="c" :color="c" :title="c" description="Something you should know about." /></div>',
  }),
}
export const AllVariants: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:grid;gap:.75rem;max-width:40rem"><VAlert v-for="v in [\'soft\',\'outline\',\'solid\',\'accent\']" :key="v" :variant="v" color="primary" :title="\'Variant: \' + v" description="Supporting text" /></div>',
  }),
}
export const WithActions: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="max-width:40rem"><VAlert color="warning" title="Your trial ends in 3 days" description="Upgrade to keep your projects."><template #actions><VButton size="sm" color="warning">Upgrade</VButton><VButton size="sm" variant="ghost" color="neutral">Remind me later</VButton></template></VAlert></div>',
  }),
}
