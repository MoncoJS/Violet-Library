import type { Meta, StoryObj } from '@storybook/vue3'
import VButton from '../VButton.vue'
import VCard from './VCard.vue'

const meta = {
  title: 'Data Display/Card',
  component: VCard,
  tags: ['autodocs'],
  args: {
    title: 'Revenue',
    subtitle: 'Last 30 days',
    variant: 'outline',
  },
  render: (args) => ({
    components: { VCard, VButton },
    setup: () => ({ args }),
    template:
      '<div style="max-width:22rem"><VCard v-bind="args">$48,210<template #footer><VButton size="sm">View report</VButton></template></VCard></div>',
  }),
} satisfies Meta<typeof VCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
