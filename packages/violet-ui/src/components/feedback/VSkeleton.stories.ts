import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VSkeleton from './VSkeleton.vue'

const meta = {
  title: 'Feedback/Skeleton',
  component: VSkeleton,
  tags: ['autodocs'],
  args: {
    variant: 'text',
    lines: 3,
  },
  render: (args) => ({
    components: { VSkeleton },
    setup: () => ({ args }),
    template: '<div style="max-width:24rem"><VSkeleton v-bind="args" /></div>',
  }),
} satisfies Meta<typeof VSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const SingleLine: Story = { args: { lines: 1 } }
export const Rect: Story = { args: { variant: 'rect' } }
export const Circle: Story = { args: { variant: 'circle' } }
export const Button: Story = { args: { variant: 'button' } }
export const NotAnimated: Story = { args: { animated: false } }
export const CardPlaceholder: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:grid;gap:1rem;max-width:22rem;padding:1rem;border:1px solid var(--v-color-border);border-radius:12px"><VSkeleton variant="rect" height="9rem" /><div style="display:flex;gap:.75rem;align-items:center"><VSkeleton variant="avatar" /><div style="flex:1"><VSkeleton :lines="2" /></div></div><VSkeleton variant="button" /></div>',
  }),
}
export const ListPlaceholder: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="display:grid;gap:1rem;max-width:26rem"><div v-for="i in 4" :key="i" style="display:flex;gap:.75rem;align-items:center"><VSkeleton variant="circle" /><div style="flex:1"><VSkeleton :lines="2" /></div></div></div>',
  }),
}
