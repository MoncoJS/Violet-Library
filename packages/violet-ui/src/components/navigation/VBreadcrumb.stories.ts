import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VBreadcrumb from './VBreadcrumb.vue'

const meta = {
  title: 'Navigation/Breadcrumb',
  component: VBreadcrumb,
  tags: ['autodocs'],
  args: {
    maxItems: 4,
    items: [
      {
        label: 'Home',
        href: '#',
      },
      {
        label: 'Projects',
        href: '#',
      },
      {
        label: 'Violet',
        href: '#',
      },
      {
        label: 'Settings',
        href: '#',
      },
      {
        label: 'Billing',
      },
    ],
  },
  render: (args) => ({
    components: { VBreadcrumb },
    setup: () => ({ args }),
    template: '<VBreadcrumb v-bind="args" />',
  }),
} satisfies Meta<typeof VBreadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Short: Story = {
  args: { items: [{ label: 'Home', href: '#' }, { label: 'Settings' }] },
}
export const Collapsed: Story = { args: { maxItems: 3 } }
export const ChevronSeparator: Story = { args: { separator: '›' } }
export const WithIcons: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<VBreadcrumb :items=\"[{label:'Home',href:'#',icon:icons.IconHome},{label:'Users',href:'#',icon:icons.IconUser},{label:'Ada Lovelace'}]\" />",
  }),
}
