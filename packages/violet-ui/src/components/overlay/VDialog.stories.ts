import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VButton from '../VButton.vue'
import VDialog from './VDialog.vue'

const meta = {
  title: 'Overlay/Dialog',
  component: VDialog,
  tags: ['autodocs'],
  args: {
    title: 'Delete project?',
    message: 'This cannot be undone.',
    color: 'danger',
    confirmText: 'Delete',
  },
  render: (args) => ({
    components: { VDialog, VButton },
    setup: () => ({ args, value: ref(false) }),
    template:
      '<VButton color="danger" variant="soft" @click="value = true">Delete</VButton><VDialog v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
