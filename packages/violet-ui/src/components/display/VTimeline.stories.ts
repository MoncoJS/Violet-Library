import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import VTimeline from './VTimeline.vue'

const meta = {
  title: 'Data Display/Timeline',
  component: VTimeline,
  tags: ['autodocs'],
  args: {
    items: [
      {
        title: 'Deployed v1.2',
        time: '2h ago',
        color: 'success',
      },
      {
        title: 'PR #42 opened',
        description: 'Add table export',
        time: 'Yesterday',
      },
      {
        title: 'Project created',
        time: 'Mar 3',
        color: 'neutral',
      },
    ],
  },
  render: (args) => ({
    components: { VTimeline },
    setup: () => ({ args }),
    template: '<VTimeline v-bind="args" />',
  }),
} satisfies Meta<typeof VTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const WithIcons: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<VTimeline :items=\"[{title:'Account created',time:'Jan 3',icon:icons.IconUser,color:'primary'},{title:'Settings updated',time:'Jan 5',icon:icons.IconSettings,color:'info'},{title:'Report exported',time:'Jan 9',icon:icons.IconDownload,color:'success'},{title:'File deleted',time:'Jan 12',icon:icons.IconTrash,color:'danger'}]\" />",
  }),
}
export const OrderTracking: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<div style=\"max-width:28rem\"><VTimeline :items=\"[{title:'Order placed',description:'Order #10423',time:'Mon 09:12',color:'success'},{title:'Payment confirmed',time:'Mon 09:13',color:'success'},{title:'Shipped',description:'DHL · 1Z999AA10123456784',time:'Tue 14:40',color:'primary'},{title:'Out for delivery',time:'Expected Thu',color:'neutral'}]\" /></div>",
  }),
}
