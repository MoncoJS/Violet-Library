import type { Meta, StoryObj } from '@storybook/vue3'
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
    setup: () => ({ args, value: ref(false) }),
    template:
      '<VButton @click="value = true">Open drawer</VButton><VDrawer v-bind="args" v-model="value">Drawer content</VDrawer>',
  }),
} satisfies Meta<typeof VDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
