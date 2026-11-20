import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
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
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          false,
      ),
    }),
    template:
      '<VButton color="danger" variant="soft" @click="value = true">Delete</VButton><VDialog v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Info: Story = {
  args: {
    color: 'info',
    title: 'New version available',
    message: 'Reload to get the latest features.',
    confirmText: 'Reload',
  },
}
export const Success: Story = {
  args: {
    color: 'success',
    title: 'Publish article?',
    message: 'It will be visible to everyone.',
    confirmText: 'Publish',
  },
}
export const Warning: Story = {
  args: {
    color: 'warning',
    title: 'Discard changes?',
    message: 'Unsaved edits will be lost.',
    confirmText: 'Discard',
  },
}
export const AlertOnly: Story = {
  args: {
    hideCancel: true,
    color: 'info',
    title: 'Session expired',
    message: 'Please sign in again.',
    confirmText: 'OK',
  },
}
export const AsyncConfirm: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const open = ref(false)
      const toast = useToast()
      const remove = () =>
        new Promise((r) => setTimeout(r, 1500)).then(() => toast.success('Project deleted'))
      return { icons, open, remove }
    },
    template:
      '<VButton color="danger" variant="soft" @click="open = true">Delete project</VButton><VDialog v-model="open" color="danger" title="Delete project?" message="Waits 1.5s to simulate an API call." confirm-text="Delete" :on-confirm="remove" /><VToaster />',
  }),
}
