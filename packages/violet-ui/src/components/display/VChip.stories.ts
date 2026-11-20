import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VChip from './VChip.vue'

const meta = {
  title: 'Data Display/Chip',
  component: VChip,
  tags: ['autodocs'],
  args: {
    label: 'Design',
    color: 'primary',
    selectable: true,
    closable: false,
  },
  render: (args) => ({
    components: { VChip },
    setup: () => ({ args, value: ref(false) }),
    template: '<VChip v-bind="args" v-model:selected="value" />',
  }),
} satisfies Meta<typeof VChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
