import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import { VAutocomplete } from './select'

const meta = {
  title: 'Forms/Autocomplete',
  component: VAutocomplete,
  tags: ['autodocs'],
  args: {
    label: 'City',
    placeholder: 'Type to search',
    clearable: true,
    options: ['Bangkok', 'Berlin', 'Boston', 'Brisbane', 'Tokyo'],
  },
  render: (args) => ({
    components: { VAutocomplete },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          null,
      ),
    }),
    template: '<VAutocomplete v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VAutocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const AllowCustom: Story = {
  args: { allowCustom: true, label: 'Tag', hint: 'Press Enter to add a new tag' },
}
export const Multiple: Story = { args: { multiple: true, label: 'Cities' } }
export const Loading: Story = { args: { loading: true } }
export const WithError: Story = { args: { error: 'City not found' } }
export const Disabled: Story = { args: { disabled: true } }
export const ServerSearch: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const all = [
        'Amsterdam',
        'Athens',
        'Bangkok',
        'Barcelona',
        'Berlin',
        'Boston',
        'Brisbane',
        'Cairo',
        'Chicago',
        'Delhi',
        'Dubai',
        'Lisbon',
        'London',
        'Madrid',
        'Oslo',
        'Paris',
        'Prague',
        'Rome',
        'Seoul',
        'Tokyo',
      ]
      const opts = ref<string[]>([])
      const busy = ref(false)
      const city = ref(null)
      let t: ReturnType<typeof setTimeout> | undefined
      const search = (q: string) => {
        busy.value = true
        clearTimeout(t)
        t = setTimeout(() => {
          opts.value = all.filter((c) => c.toLowerCase().includes(q.toLowerCase()))
          busy.value = false
        }, 500)
      }
      return { icons, opts, busy, city, search }
    },
    template:
      '<div style="max-width:20rem"><VAutocomplete v-model="city" label="City (server search)" :options="opts" :filter="false" :loading="busy" placeholder="Type a city" hint="Results load after 500ms" @search="search" /></div>',
  }),
}
