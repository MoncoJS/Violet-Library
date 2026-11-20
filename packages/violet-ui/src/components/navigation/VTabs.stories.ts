import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import VTabs from './VTabs.vue'

const meta = {
  title: 'Navigation/Tabs',
  component: VTabs,
  tags: ['autodocs'],
  args: {
    variant: 'line',
    items: [
      {
        value: 'a',
        label: 'Overview',
      },
      {
        value: 'b',
        label: 'Activity',
        badge: 3,
      },
      {
        value: 'c',
        label: 'Archived',
        disabled: true,
      },
    ],
  },
  render: (args) => ({
    components: { VTabs },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          'a',
      ),
    }),
    template:
      '<VTabs v-bind="args" v-model="value"><template #default="{ item }">Panel: {{ item.label }}</template></VTabs>',
  }),
} satisfies Meta<typeof VTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Pills: Story = { args: { variant: 'pills' } }
export const Segmented: Story = { args: { variant: 'segmented' } }
export const Fill: Story = { args: { fill: true } }
export const Vertical: Story = { args: { orientation: 'vertical' } }
export const Manual: Story = { args: { manual: true } }
export const WithIcons: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<VTabs :items=\"[{value:'home',label:'Home',icon:icons.IconHome},{value:'users',label:'Users',icon:icons.IconUser,badge:12},{value:'settings',label:'Settings',icon:icons.IconSettings}]\" model-value=\"home\"><template #default=\"{ item }\">{{ item.label }} panel</template></VTabs>",
  }),
}
export const ManyTabs: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="max-width:28rem"><VTabs :items="Array.from({length:12},(_, i)=>({value:i,label:\'Tab \' + (i+1)}))" :model-value="0"><template #default="{ item }">{{ item.label }} — the tab bar scrolls horizontally.</template></VTabs></div>',
  }),
}
