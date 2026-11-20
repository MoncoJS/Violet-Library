import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VAvatar from './VAvatar.vue'

const meta = {
  title: 'Data Display/Avatar',
  component: VAvatar,
  tags: ['autodocs'],
  args: {
    name: 'Ada Lovelace',
    size: 'md',
    shape: 'circle',
    status: 'online',
  },
  render: (args) => ({
    components: { VAvatar },
    setup: () => ({ args }),
    template: '<VAvatar v-bind="args" />',
  }),
} satisfies Meta<typeof VAvatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Image: Story = {
  args: { src: 'https://i.pravatar.cc/120?img=5', alt: 'Profile photo' },
}
export const Square: Story = { args: { shape: 'square' } }
export const NoName: Story = { args: {} }
export const Busy: Story = { args: { status: 'busy' } }
export const Away: Story = { args: { status: 'away' } }
export const BrokenImage: Story = { args: { src: 'https://example.invalid/missing.png' } }
export const Sizes: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:flex;gap:.75rem;align-items:center"><VAvatar v-for="s in [\'xs\',\'sm\',\'md\',\'lg\',\'xl\']" :key="s" :size="s" name="Grace Hopper" /></div>',
  }),
}
export const Group: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<div style=\"display:flex\"><VAvatar v-for=\"(n, i) in ['Ada L','Grace H','Linus T','Barbara L','Ken T']\" :key=\"n\" :name=\"n\" :style=\"{ marginLeft: i ? '-.6rem' : 0, boxShadow: '0 0 0 2px var(--v-color-surface)' }\" /></div>",
  }),
}
export const ColorsFromNames: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<div style=\"display:flex;gap:.5rem;flex-wrap:wrap\"><VAvatar v-for=\"n in ['Ada Lovelace','Grace Hopper','Linus Torvalds','Barbara Liskov','Ken Thompson','Margaret Hamilton','Alan Turing','Donald Knuth']\" :key=\"n\" :name=\"n\" /></div>",
  }),
}
