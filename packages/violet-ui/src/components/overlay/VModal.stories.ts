import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import VButton from '../VButton.vue'
import VModal from './VModal.vue'

const meta = {
  title: 'Overlay/Modal',
  component: VModal,
  tags: ['autodocs'],
  args: {
    title: 'Invite teammates',
    description: 'They will get an email.',
    size: 'md',
  },
  render: (args) => ({
    components: { VModal, VButton },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          false,
      ),
    }),
    template:
      '<VButton @click="value = true">Open modal</VButton><VModal v-bind="args" v-model="value">Modal body<template #footer="{ close }"><VButton @click="close">Done</VButton></template></VModal>',
  }),
} satisfies Meta<typeof VModal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const ExtraLarge: Story = { args: { size: 'xl' } }
export const Persistent: Story = {
  args: { persistent: true, description: 'Esc and backdrop clicks are ignored.' },
}
export const NoCloseButton: Story = { args: { hideClose: true } }
export const FormInModal: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const open = ref(false)
      const email = ref('')
      const role = ref('Editor')
      return { icons, open, email, role }
    },
    template:
      '<VButton @click="open = true">Invite member</VButton><VModal v-model="open" title="Invite member" description="They will get an email with a link to join." initial-focus="input"><div style="display:grid;gap:1rem"><VInput v-model="email" label="Email" type="email" placeholder="name@company.com" /><VSelect v-model="role" label="Role" :options="[\'Admin\',\'Editor\',\'Viewer\']" /><VCheckbox label="Send a welcome message" :model-value="true" /></div><template #footer="{ close }"><VButton variant="outline" color="neutral" @click="close">Cancel</VButton><VButton @click="close">Send invite</VButton></template></VModal>',
  }),
}
export const LongContent: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const open = ref(false)
      return { icons, open }
    },
    template:
      '<VButton @click="open = true">Terms of service</VButton><VModal v-model="open" title="Terms of service" size="lg"><p v-for="i in 20" :key="i">Section {{ i }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</p><template #footer="{ close }"><VButton @click="close">I agree</VButton></template></VModal>',
  }),
}
export const Nested: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const a = ref(false)
      const b = ref(false)
      return { icons, a, b }
    },
    template:
      '<VButton @click="a = true">Open first</VButton><VModal v-model="a" title="First modal">Escape closes only the top-most modal.<template #footer><VButton @click="b = true">Open second</VButton></template></VModal><VModal v-model="b" title="Second modal" size="sm">I am on top.</VModal>',
  }),
}
