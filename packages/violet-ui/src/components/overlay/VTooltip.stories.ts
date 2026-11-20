import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VButton from '../VButton.vue'
import VTooltip from './VTooltip.vue'

const meta = {
  title: 'Overlay/Tooltip',
  component: VTooltip,
  tags: ['autodocs'],
  args: {
    text: 'Copies the invite link',
    placement: 'top',
  },
  render: (args) => ({
    components: { VTooltip, VButton },
    setup: () => ({ args }),
    template:
      '<div style="padding:3rem"><VTooltip v-bind="args"><VButton variant="outline" color="neutral">Hover or focus me</VButton></VTooltip></div>',
  }),
} satisfies Meta<typeof VTooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Bottom: Story = { args: { placement: 'bottom' } }
export const Left: Story = { args: { placement: 'left' } }
export const Right: Story = { args: { placement: 'right' } }
export const NoDelay: Story = { args: { openDelay: 0 } }
export const Disabled: Story = { args: { disabled: true } }
export const OnIconButtons: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<div style=\"display:flex;gap:.25rem;padding:3rem\"><VTooltip v-for=\"t in [['Bold','IconPlus'],['Download','IconDownload'],['Delete','IconTrash'],['Settings','IconSettings']]\" :key=\"t[0]\" :text=\"t[0]\"><VIconButton :icon=\"icons[t[1]]\" :label=\"t[0]\" /></VTooltip></div>",
  }),
}
export const LongText: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="padding:4rem"><VTooltip text="Tooltips wrap long text automatically so they never get wider than about eighteen rem."><VButton variant="outline" color="neutral">Long tooltip</VButton></VTooltip></div>',
  }),
}
