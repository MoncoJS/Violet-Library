import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import { VSelect } from './select'

const meta = {
  title: 'Forms/Select',
  component: VSelect,
  tags: ['autodocs'],
  args: {
    label: 'Country',
    placeholder: 'Choose a country',
    clearable: true,
    options: ['Thailand', 'Japan', 'Germany', 'Brazil'],
  },
  render: (args) => ({
    components: { VSelect },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          null,
      ),
    }),
    template: '<VSelect v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const WithValue: Story = { args: { modelValue: 'Japan' } }
export const WithHint: Story = { args: { hint: 'Used for tax calculation' } }
export const WithError: Story = { args: { error: 'Please choose a country' } }
export const Required: Story = { args: { required: true } }
export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = { args: { loading: true } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
export const ObjectOptions: Story = {
  args: {
    label: 'Plan',
    options: [
      { label: 'Starter', value: 'starter', description: '1 project, 1 seat' },
      { label: 'Pro', value: 'pro', description: '10 projects, 5 seats' },
      { label: 'Enterprise', value: 'ent', description: 'Contact sales', disabled: true },
    ],
  },
}
export const LongList: Story = {
  args: {
    label: 'Time zone',
    options: [
      'UTC-12:00 — Zone 1',
      'UTC-11:00 — Zone 2',
      'UTC-10:00 — Zone 3',
      'UTC-9:00 — Zone 4',
      'UTC-8:00 — Zone 5',
      'UTC-7:00 — Zone 6',
      'UTC-6:00 — Zone 7',
      'UTC-5:00 — Zone 8',
      'UTC-4:00 — Zone 9',
      'UTC-3:00 — Zone 10',
      'UTC-2:00 — Zone 11',
      'UTC-1:00 — Zone 12',
      'UTC+0:00 — Zone 13',
      'UTC+1:00 — Zone 14',
      'UTC+2:00 — Zone 15',
      'UTC+3:00 — Zone 16',
      'UTC+4:00 — Zone 17',
      'UTC+5:00 — Zone 18',
      'UTC+6:00 — Zone 19',
      'UTC+7:00 — Zone 20',
      'UTC+8:00 — Zone 21',
      'UTC+9:00 — Zone 22',
      'UTC+10:00 — Zone 23',
      'UTC+11:00 — Zone 24',
      'UTC+12:00 — Zone 25',
      'UTC+13:00 — Zone 26',
      'UTC+14:00 — Zone 27',
      'UTC+15:00 — Zone 28',
      'UTC+16:00 — Zone 29',
      'UTC+17:00 — Zone 30',
      'UTC+18:00 — Zone 31',
      'UTC+19:00 — Zone 32',
      'UTC+20:00 — Zone 33',
      'UTC+21:00 — Zone 34',
      'UTC+22:00 — Zone 35',
      'UTC+23:00 — Zone 36',
      'UTC+24:00 — Zone 37',
      'UTC+25:00 — Zone 38',
      'UTC+26:00 — Zone 39',
      'UTC+27:00 — Zone 40',
    ],
  },
}
export const Empty: Story = { args: { options: [], noDataText: 'No countries available' } }
export const Sizes: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<div style=\"display:grid;gap:1rem;max-width:20rem\"><VSelect v-for=\"s in ['sm','md','lg']\" :key=\"s\" :size=\"s\" :label=\"'Size ' + s\" :options=\"['One','Two','Three']\" /></div>",
  }),
}
export const CustomOption: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="max-width:20rem"><VSelect label="Assignee" :options="[{label:\'Ada Lovelace\',value:1},{label:\'Grace Hopper\',value:2},{label:\'Linus T\',value:3}]"><template #option="{ option }"><span style="display:flex;gap:.5rem;align-items:center"><VAvatar :name="option.label" size="xs" />{{ option.label }}</span></template></VSelect></div>',
  }),
}
