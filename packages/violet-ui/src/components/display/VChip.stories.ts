import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import VChip from './VChip.vue'

const meta = {
  title: 'Data Display/Chip',
  component: VChip,
  tags: ['autodocs'],
  args: {
    label: 'Design',
    color: 'primary',
    selectable: true,
    closable: false,
  },
  render: (args) => ({
    components: { VChip },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          false,
      ),
    }),
    template: '<VChip v-bind="args" v-model:selected="value" />',
  }),
} satisfies Meta<typeof VChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Selected: Story = { args: { selected: true } }
export const Closable: Story = { args: { closable: true, selectable: false } }
export const Solid: Story = { args: { variant: 'solid', selectable: false } }
export const Outline: Story = { args: { variant: 'outline', selectable: false, color: 'neutral' } }
export const Small: Story = { args: { size: 'sm' } }
export const Disabled: Story = { args: { disabled: true } }
export const FilterGroup: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const opts = ['All', 'Design', 'Engineering', 'Marketing', 'Sales']
      const sel = ref(['Design'])
      const toggle = (o: string, v: boolean) => {
        sel.value = v ? [...sel.value, o] : sel.value.filter((x) => x !== o)
      }
      return { icons, opts, sel, toggle }
    },
    template:
      '<div style="display:flex;gap:.5rem;flex-wrap:wrap"><VChip v-for="o in opts" :key="o" :label="o" selectable :selected="sel.includes(o)" @update:selected="toggle(o, $event)" /></div>',
  }),
}
export const Removable: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const tags = ref(['vue', 'typescript', 'vite', 'pinia'])
      return { icons, tags }
    },
    template:
      '<div style="display:flex;gap:.5rem;flex-wrap:wrap"><VChip v-for="t in tags" :key="t" :label="t" color="primary" closable @close="tags = tags.filter(x => x !== t)" /></div>',
  }),
}
