import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import { VMultiSelect } from './select'

const meta = {
  title: 'Forms/Multi Select',
  component: VMultiSelect,
  tags: ['autodocs'],
  args: {
    label: 'Skills',
    searchable: true,
    maxTags: 3,
    options: [
      {
        label: 'Vue',
        value: 'vue',
      },
      {
        label: 'TypeScript',
        value: 'ts',
      },
      {
        label: 'CSS',
        value: 'css',
      },
      {
        label: 'Go',
        value: 'go',
        disabled: true,
      },
    ],
  },
  render: (args) => ({
    components: { VMultiSelect },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ?? ['vue'],
      ),
    }),
    template: '<VMultiSelect v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VMultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Empty: Story = { args: { modelValue: [] } }
export const ManySelected: Story = { args: { maxTags: 2 } }
export const MaxSelected: Story = { args: { maxSelected: 2, hint: 'Pick up to 2' } }
export const NotSearchable: Story = { args: { searchable: false } }
export const WithError: Story = { args: { error: 'Select at least one skill' } }
export const Disabled: Story = { args: { disabled: true } }
export const TagInput: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="max-width:24rem"><VMultiSelect label="Tags" allow-custom searchable :options="[\'bug\',\'feature\',\'docs\']" placeholder="Type and press Enter" /></div>',
  }),
}
