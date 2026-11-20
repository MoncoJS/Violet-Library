import type { Meta, StoryObj } from '@storybook/vue3'
import VLoadingOverlay from './VLoadingOverlay.vue'

const meta = {
  title: 'Feedback/Loading Overlay',
  component: VLoadingOverlay,
  tags: ['autodocs'],
  args: {
    loading: true,
    text: 'Refreshing…',
  },
  render: (args) => ({
    components: { VLoadingOverlay },
    setup: () => ({ args }),
    template:
      '<VLoadingOverlay v-bind="args"><div style="height:8rem;padding:1rem;border:1px solid var(--v-color-border);border-radius:12px">Content</div></VLoadingOverlay>',
  }),
} satisfies Meta<typeof VLoadingOverlay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const NoText: Story = { args: {} }
export const Blur: Story = { args: { blur: true } }
export const NotLoading: Story = { args: { loading: false } }
