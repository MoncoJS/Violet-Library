import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VTag from './VTag.vue'

const meta = {
  title: 'Data Display/Tag',
  component: VTag,
  tags: ['autodocs'],
  args: {
    label: 'Active',
    color: 'success',
    dot: true,
  },
  render: (args) => ({
    components: { VTag },
    setup: () => ({ args }),
    template: '<VTag v-bind="args" />',
  }),
} satisfies Meta<typeof VTag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Warning: Story = { args: { color: 'warning', label: 'Pending' } }
export const Danger: Story = { args: { color: 'danger', label: 'Overdue' } }
export const Solid: Story = { args: { variant: 'solid' } }
export const Outline: Story = { args: { variant: 'outline', label: 'v2.1.0' } }
export const Rounded: Story = { args: { rounded: true } }
export const StatusSet: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:flex;gap:.5rem;flex-wrap:wrap"><VTag color="success" dot rounded>Active</VTag><VTag color="info" dot rounded>Invited</VTag><VTag color="warning" dot rounded>Pending</VTag><VTag color="danger" dot rounded>Suspended</VTag><VTag color="neutral" dot rounded>Archived</VTag></div>',
  }),
}
export const AllVariants: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<div style=\"display:grid;gap:.5rem\"><div v-for=\"v in ['soft','solid','outline']\" :key=\"v\" style=\"display:flex;gap:.5rem\"><VTag v-for=\"c in ['primary','success','warning','danger','info','neutral']\" :key=\"c\" :variant=\"v\" :color=\"c\">{{ c }}</VTag></div></div>",
  }),
}
