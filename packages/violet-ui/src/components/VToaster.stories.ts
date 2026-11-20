import type { Meta, StoryObj } from '@storybook/vue3'
import { useToast } from '../toast'
import VButton from './VButton.vue'
import VToaster from './VToaster.vue'

const meta = {
  title: 'Feedback/Toast',
  component: VToaster,
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ],
    },
  },
  args: { position: 'bottom-right' },
  render: (args) => ({
    components: { VButton, VToaster },
    setup() {
      const toast = useToast()
      const exportReport = () =>
        void toast.promise(new Promise((r) => setTimeout(r, 1500)), {
          loading: 'Exporting report…',
          success: 'Report exported',
          error: 'Export failed',
        })
      const withAction = () =>
        toast.show({
          title: 'File moved to trash',
          color: 'warning',
          action: { label: 'Undo', onClick: (t) => toast.dismiss(t.id) },
        })
      return { args, toast, exportReport, withAction }
    },
    template: `<div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <VButton color="success" variant="soft" @click="toast.success('Saved!', { title: 'Done' })">Success</VButton>
      <VButton color="danger" variant="soft" @click="toast.error('Something went wrong')">Error</VButton>
      <VButton color="info" variant="soft" @click="toast.info('Heads up: maintenance at 2am UTC')">Info</VButton>
      <VButton color="warning" variant="soft" @click="withAction">With action</VButton>
      <VButton variant="outline" color="neutral" @click="exportReport">Promise</VButton>
    </div>
    <VToaster v-bind="args" />`,
  }),
} satisfies Meta<typeof VToaster>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
