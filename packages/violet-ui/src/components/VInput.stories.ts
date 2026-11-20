import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { email, min, required, useForm } from '../form'
import { IconLock, IconMail, IconSearch } from '../icons'
import VButton from './VButton.vue'
import VInput from './VInput.vue'

const meta = {
  title: 'Forms/Input',
  component: VInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['outline', 'filled'] },
  },
  args: { label: 'Email', placeholder: 'you@example.com', hint: 'We never share it.' },
  render: (args) => ({
    components: { VInput },
    setup: () => ({ args, value: ref('') }),
    template: '<div style="max-width:20rem"><VInput v-bind="args" v-model="value" /></div>',
  }),
} satisfies Meta<typeof VInput>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => ({
    components: { VInput },
    setup: () => ({ IconSearch, q: ref('violet') }),
    template: `<div style="display:grid;gap:1rem;max-width:20rem">
      <VInput v-model="q" label="Search" :prepend-icon="IconSearch" clearable />
      <VInput label="Invalid" model-value="nope" error="Something is wrong" />
      <VInput label="Disabled" model-value="Read only value" disabled />
      <VInput label="Loading" loading placeholder="Checking…" />
      <VInput label="Bio" :maxlength="80" show-count placeholder="Tell us more" /></div>`,
  }),
}

export const WithUseForm: Story = {
  render: () => ({
    components: { VInput, VButton },
    setup() {
      const form = useForm({
        initialValues: { email: '', password: '' },
        labels: { email: 'Email', password: 'Password' },
        rules: { email: [required(), email()], password: [required(), min(8)] },
        onSubmit: () => undefined,
      })
      return { form, IconMail, IconLock }
    },
    template: `<form novalidate style="display:grid;gap:1rem;max-width:20rem" @submit="form.handleSubmit()($event)">
      <VInput label="Email" type="email" required :prepend-icon="IconMail" v-bind="form.register('email')" />
      <VInput label="Password" type="password" required :prepend-icon="IconLock" v-bind="form.register('password')" />
      <VButton type="submit">Sign in</VButton></form>`,
  }),
}
