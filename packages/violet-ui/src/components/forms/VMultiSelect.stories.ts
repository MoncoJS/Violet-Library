import type { Meta, StoryObj } from '@storybook/vue3'
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
    setup: () => ({ args, value: ref(['vue']) }),
    template: '<VMultiSelect v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VMultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
