import type { Meta, StoryObj } from '@storybook/vue3'
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
