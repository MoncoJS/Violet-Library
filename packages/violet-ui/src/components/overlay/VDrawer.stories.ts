import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import VButton from '../VButton.vue'
import VDrawer from './VDrawer.vue'

const meta = {
  title: 'Overlay/Drawer',
  component: VDrawer,
  tags: ['autodocs'],
  args: {
    title: 'Filters',
    placement: 'right',
  },
  render: (args) => ({
    components: { VDrawer, VButton },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          false,
      ),
    }),
    template:
      '<VButton @click="value = true">Open drawer</VButton><VDrawer v-bind="args" v-model="value">Drawer content</VDrawer>',
  }),
} satisfies Meta<typeof VDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Left: Story = { args: { placement: 'left', title: 'Navigation' } }
export const Bottom: Story = { args: { placement: 'bottom', size: '50vh', title: 'Details' } }
export const Top: Story = { args: { placement: 'top', size: '12rem', title: 'Announcement' } }
export const Wide: Story = { args: { size: '40rem' } }
export const Modeless: Story = { args: { modeless: true, title: 'Help' } }
export const FilterPanel: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const open = ref(false)
      return { icons, open }
    },
    template:
      '<VButton variant="outline" color="neutral" @click="open = true">Filters</VButton><VDrawer v-model="open" title="Filters"><div style="display:grid;gap:1rem"><VSelect label="Status" :options="[\'Active\',\'Invited\',\'Suspended\']" clearable /><VMultiSelect label="Roles" :options="[\'Admin\',\'Editor\',\'Viewer\']" /><VDateRangePicker label="Joined" /><VCheckboxGroup label="Plan" :options="[\'Free\',\'Pro\',\'Enterprise\']" /></div><template #footer="{ close }"><VButton variant="ghost" color="neutral" @click="close">Reset</VButton><VButton @click="close">Apply filters</VButton></template></VDrawer>',
  }),
}
