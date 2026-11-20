import type { Meta, StoryObj } from '@storybook/vue3'
import VAccordion from './VAccordion.vue'

const meta = {
  title: 'Data Display/Accordion',
  component: VAccordion,
  tags: ['autodocs'],
  args: {
    variant: 'outline',
    items: [
      {
        value: 1,
        title: 'What is Violet UI?',
        content: 'A Vue 3 component library.',
      },
      {
        value: 2,
        title: 'Is it accessible?',
        content: 'Yes — WAI-ARIA patterns throughout.',
      },
    ],
  },
  render: (args) => ({
    components: { VAccordion },
    setup: () => ({ args }),
    template: '<VAccordion v-bind="args" />',
  }),
} satisfies Meta<typeof VAccordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// ---- more examples
export const Multiple: Story = { args: { multiple: true } }
export const Separated: Story = { args: { variant: 'separated' } }
export const Flush: Story = { args: { variant: 'flush' } }
export const OpenByDefault: Story = { args: { modelValue: [1] } }
export const WithDisabled: Story = {
  args: {
    items: [
      { value: 1, title: 'Shipping', content: 'Free shipping over $50.' },
      { value: 2, title: 'Returns', content: '30-day returns.' },
      { value: 3, title: 'Warranty (coming soon)', disabled: true },
    ],
  },
}
