import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
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

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Elevated: Story = { args: { variant: 'elevated' } }
export const Filled: Story = { args: { variant: 'filled' } }
export const Interactive: Story = { args: { interactive: true } }
export const WithImage: Story = {
  args: {
    image: 'https://picsum.photos/seed/card/640/360',
    imageAlt: 'Mountain landscape',
    title: 'Weekend in the Alps',
  },
}
export const Compact: Story = { args: { padding: 'sm' } }
export const StatCards: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      "<div style=\"display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))\"><VCard v-for=\"s in [['Revenue','$48,210','+12%','success'],['Users','2,431','+4%','success'],['Churn','1.8%','+0.3%','danger'],['NPS','62','-2','warning']]\" :key=\"s[0]\" :subtitle=\"s[0]\"><div style=\"font-size:1.6rem;font-weight:600\">{{ s[1] }}</div><VTag :color=\"s[3]\" rounded>{{ s[2] }}</VTag></VCard></div>",
  }),
}
export const WithActions: Story = {
  render: () => ({
    components: all,
    setup: () => ({ icons }),
    template:
      '<div style="max-width:24rem"><VCard title="Team plan" subtitle="Billed yearly"><template #actions><VMenu :items="[{label:\'Edit\'},{label:\'Cancel plan\',danger:true}]"><template #trigger="{ props }"><VIconButton v-bind="props" :icon="icons.IconMoreHorizontal" label="Plan actions" size="sm" /></template></VMenu></template>5 seats · renews Jan 1<template #footer><VButton size="sm">Manage</VButton><VButton size="sm" variant="ghost" color="neutral">Invoices</VButton></template></VCard></div>',
  }),
}
