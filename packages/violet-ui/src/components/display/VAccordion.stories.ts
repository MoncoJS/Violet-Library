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
