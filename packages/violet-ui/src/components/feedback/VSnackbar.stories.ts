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
    setup: () => ({ args, value: ref(false) }),
    template:
      '<VButton @click="value = true">Show snackbar</VButton><VSnackbar v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VSnackbar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
