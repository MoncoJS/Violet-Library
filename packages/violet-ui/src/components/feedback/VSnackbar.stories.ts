import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import VButton from '../VButton.vue'
import VSnackbar from './VSnackbar.vue'

const meta = {
  title: 'Feedback/Snackbar',
  component: VSnackbar,
  tags: ['autodocs'],
  args: {
    text: 'Message archived',
    actionLabel: 'Undo',
    closable: true,
    timeout: 0,
  },
  render: (args) => ({
    components: { VSnackbar, VButton },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          false,
      ),
    }),
    template:
      '<VButton @click="value = true">Show snackbar</VButton><VSnackbar v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VSnackbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const Success: Story = { args: { color: 'success', text: 'Changes saved' } }
export const Danger: Story = {
  args: { color: 'danger', text: 'Failed to save', actionLabel: 'Retry' },
}
export const TopPosition: Story = { args: { position: 'top' } }
export const AutoHide: Story = { args: { timeout: 3000, closable: false } }
