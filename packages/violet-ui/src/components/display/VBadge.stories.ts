import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VBadge from './VBadge.vue'

const meta = {
  title: 'Data Display/Badge',
  component: VBadge,
  tags: ['autodocs'],
  args: {
    content: 5,
    color: 'danger',
    variant: 'solid',
  },
  render: (args) => ({
    components: { VBadge },
    setup: () => ({ args }),
    template: '<VBadge v-bind="args" />',
  }),
} satisfies Meta<typeof VBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Overflow: Story = { args: { content: 250 } }
export const Dot: Story = { args: { dot: true } }
export const Soft: Story = { args: { variant: 'soft', color: 'primary' } }
export const Outline: Story = { args: { variant: 'outline', color: 'neutral' } }
export const Text: Story = { args: { content: 'New', color: 'success' } }
export const OnAvatar: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:flex;gap:1.5rem"><VBadge :content="3" label="3 unread"><VAvatar name="Ada Lovelace" /></VBadge><VBadge dot color="success"><VAvatar name="Grace Hopper" /></VBadge><VBadge :content="120" color="primary"><VIconButton :icon="icons.IconInbox" label="Inbox" /></VBadge></div>',
  }),
}
export const AllColors: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<div style=\"display:flex;gap:.5rem\"><VBadge v-for=\"c in ['primary','secondary','success','warning','danger','info','neutral']\" :key=\"c\" :color=\"c\" :content=\"c\" /></div>",
  }),
}
