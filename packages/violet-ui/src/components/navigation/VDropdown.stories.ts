import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VButton from '../VButton.vue'
import VDropdown from './VDropdown.vue'

const meta = {
  title: 'Navigation/Dropdown',
  component: VDropdown,
  tags: ['autodocs'],
  args: {
    placement: 'bottom-start',
  },
  render: (args) => ({
    components: { VDropdown, VButton },
    setup: () => ({ args }),
    template:
      '<VDropdown v-bind="args"><template #trigger="{ props }"><VButton v-bind="props" variant="outline" color="neutral">Open</VButton></template><div style="padding:1rem;width:14rem">Any content</div></VDropdown>',
  }),
} satisfies Meta<typeof VDropdown>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const AlignEnd: Story = { args: { placement: 'bottom-end' } }
export const Top: Story = { args: { placement: 'top-start' } }
export const FilterDropdown: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<VDropdown><template #trigger="{ props }"><VButton v-bind="props" variant="outline" color="neutral" :append-icon="icons.IconChevronDown">Status</VButton></template><div style="display:grid;gap:.6rem;padding:.75rem 1rem;min-width:12rem"><VCheckbox label="Active" :model-value="true" /><VCheckbox label="Invited" /><VCheckbox label="Suspended" /></div></VDropdown>',
  }),
}
