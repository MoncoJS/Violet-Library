import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VButton from '../VButton.vue'
import VMenu from './VMenu.vue'

const meta = {
  title: 'Navigation/Menu',
  component: VMenu,
  tags: ['autodocs'],
  args: {
    label: 'Project actions',
    items: [
      {
        heading: 'Project',
      },
      {
        label: 'Edit',
        shortcut: '⌘E',
      },
      {
        label: 'Duplicate',
      },
      {
        divider: true,
      },
      {
        label: 'Delete',
        danger: true,
      },
    ],
  },
  render: (args) => ({
    components: { VMenu, VButton },
    setup: () => ({ args }),
    template:
      '<VMenu v-bind="args"><template #trigger="{ props }"><VButton v-bind="props" variant="outline" color="neutral">Actions</VButton></template></VMenu>',
  }),
} satisfies Meta<typeof VMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Simple: Story = {
  args: { items: [{ label: 'Profile' }, { label: 'Settings' }, { label: 'Sign out' }] },
}
export const WithDisabled: Story = {
  args: { items: [{ label: 'Copy' }, { label: 'Paste', disabled: true }, { label: 'Cut' }] },
}
export const AlignEnd: Story = { args: { placement: 'bottom-end' } }
export const WithIcons: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<VMenu :items="[{label:\'Settings\',icon:icons.IconSettings,shortcut:\'⌘,\'},{label:\'Download\',icon:icons.IconDownload,shortcut:\'⌘D\'},{divider:true},{label:\'Delete\',icon:icons.IconTrash,danger:true}]"><template #trigger="{ props }"><VIconButton v-bind="props" :icon="icons.IconMoreHorizontal" label="More actions" /></template></VMenu>',
  }),
}
export const UserMenu: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<VMenu :items="[{heading:\'ada@example.com\'},{label:\'Profile\',icon:icons.IconUser},{label:\'Settings\',icon:icons.IconSettings},{divider:true},{label:\'Sign out\'}]"><template #trigger="{ props }"><button v-bind="props" style="border:0;background:none;padding:0;cursor:pointer;border-radius:50%"><VAvatar name="Ada Lovelace" /></button></template></VMenu>',
  }),
}
