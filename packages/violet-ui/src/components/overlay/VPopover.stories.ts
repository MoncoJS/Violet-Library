import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VButton from '../VButton.vue'
import VPopover from './VPopover.vue'

const meta = {
  title: 'Overlay/Popover',
  component: VPopover,
  tags: ['autodocs'],
  args: {
    title: 'Share',
    placement: 'bottom',
  },
  render: (args) => ({
    components: { VPopover, VButton },
    setup: () => ({ args }),
    template:
      '<VPopover v-bind="args"><template #trigger><VButton variant="outline" color="neutral">Open popover</VButton></template>Anyone with the link can view.</VPopover>',
  }),
} satisfies Meta<typeof VPopover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Top: Story = { args: { placement: 'top' } }
export const Hover: Story = { args: { trigger: 'hover', title: 'Hover card' } }
export const Wide: Story = { args: { width: '22rem' } }
export const ProfileCard: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<VPopover width="18rem" trigger="hover"><template #trigger><VButton variant="link">@ada</VButton></template><div style="display:flex;gap:.75rem;align-items:center"><VAvatar name="Ada Lovelace" size="lg" status="online" /><div><strong>Ada Lovelace</strong><div style="color:var(--v-color-text-muted);font-size:.8rem">Engineer · London</div></div></div></VPopover>',
  }),
}
export const FormInPopover: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<VPopover title="Rename file"><template #trigger><VButton variant="outline" color="neutral">Rename</VButton></template><template #default="{ close }"><div style="display:grid;gap:.75rem"><VInput model-value="report-final.pdf" size="sm" /><div style="display:flex;gap:.5rem;justify-content:flex-end"><VButton size="sm" variant="ghost" color="neutral" @click="close">Cancel</VButton><VButton size="sm" @click="close">Save</VButton></div></div></template></VPopover>',
  }),
}
