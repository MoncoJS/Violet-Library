import type { Meta, StoryObj } from '@storybook/vue3'
import { IconDownload, IconPlus, IconSun, IconTrash } from '../icons'
import VButton from './VButton.vue'
import VButtonGroup from './VButtonGroup.vue'
import VIconButton from './VIconButton.vue'

const meta = {
  title: 'Actions/Button',
  component: VButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['solid', 'soft', 'outline', 'ghost', 'link'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
    },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    onClick: { action: 'click' },
  },
  args: { variant: 'solid', color: 'primary', size: 'md', loading: false, disabled: false },
  render: (args) => ({
    components: { VButton },
    setup: () => ({ args }),
    template: '<VButton v-bind="args">Button</VButton>',
  }),
} satisfies Meta<typeof VButton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Variants: Story = {
  render: () => ({
    components: { VButton },
    template: `<div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <VButton>Solid</VButton><VButton variant="soft">Soft</VButton>
      <VButton variant="outline">Outline</VButton><VButton variant="ghost">Ghost</VButton>
      <VButton variant="link">Link</VButton></div>`,
  }),
}

export const Colors: Story = {
  render: () => ({
    components: { VButton },
    setup: () => ({
      colors: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'neutral'],
    }),
    template: `<div style="display:grid;gap:.5rem">
      <div v-for="v in ['solid','soft','outline']" :key="v" style="display:flex;gap:.5rem;flex-wrap:wrap">
        <VButton v-for="c in colors" :key="c" :variant="v" :color="c">{{ c }}</VButton>
      </div></div>`,
  }),
}

export const Sizes: Story = {
  render: () => ({
    components: { VButton },
    template: `<div style="display:flex;gap:.5rem;align-items:center">
      <VButton v-for="s in ['xs','sm','md','lg','xl']" :key="s" :size="s">{{ s }}</VButton></div>`,
  }),
}

export const WithIcons: Story = {
  render: () => ({
    components: { VButton, VIconButton },
    setup: () => ({ IconPlus, IconDownload, IconTrash, IconSun }),
    template: `<div style="display:flex;gap:.5rem;align-items:center">
      <VButton :prepend-icon="IconPlus">New</VButton>
      <VButton variant="outline" color="neutral" :append-icon="IconDownload">Export</VButton>
      <VButton color="danger" variant="soft" :prepend-icon="IconTrash">Delete</VButton>
      <VIconButton :icon="IconSun" label="Toggle theme" /></div>`,
  }),
}

export const States: Story = {
  render: () => ({
    components: { VButton },
    template: `<div style="display:flex;gap:.5rem">
      <VButton loading>Saving</VButton><VButton loading loading-text="Uploading…">Upload</VButton>
      <VButton disabled>Disabled</VButton></div>`,
  }),
}

export const Group: Story = {
  render: () => ({
    components: { VButton, VButtonGroup },
    template: `<VButtonGroup variant="outline" color="neutral" label="Range">
      <VButton>Day</VButton><VButton>Week</VButton><VButton>Month</VButton></VButtonGroup>`,
  }),
}
