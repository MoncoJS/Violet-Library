import type { Meta, StoryObj } from '@storybook/vue3'
import VList from './VList.vue'

const meta = {
  title: 'Data Display/List',
  component: VList,
  tags: ['autodocs'],
  args: {
    interactive: true,
    chevron: true,
    dividers: true,
    items: [
      {
        title: 'Ada Lovelace',
        subtitle: 'ada@example.com',
        avatarName: 'Ada Lovelace',
        meta: 'Admin',
      },
      {
        title: 'Grace Hopper',
        subtitle: 'grace@example.com',
        avatarName: 'Grace Hopper',
        meta: 'Editor',
      },
    ],
  },
  render: (args) => ({
    components: { VList },
    setup: () => ({ args }),
    template: '<div style="max-width:28rem"><VList v-bind="args" /></div>',
  }),
} satisfies Meta<typeof VList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const Dense: Story = { args: { dense: true } }
export const NoDividers: Story = { args: { dividers: false } }
export const Static: Story = { args: { interactive: false, chevron: false } }
export const WithIcons: Story = {
  args: {
    items: [
      { title: 'Account', subtitle: 'Name, email, password' },
      { title: 'Notifications', subtitle: 'Email and push' },
      { title: 'Billing', subtitle: 'Plan and invoices', active: true },
      { title: 'Danger zone', subtitle: 'Delete account', disabled: true },
    ],
  },
}
