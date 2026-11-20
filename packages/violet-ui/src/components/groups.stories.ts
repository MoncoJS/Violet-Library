import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { IconDownload, IconSettings, IconTrash } from '../icons'
import * as V from './index'
import type { DataTableColumn } from './table/types'

/** Overview stories, one per component group. Each component also has full autodocs via Controls. */
const meta = { title: 'Overview' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

const components = V as unknown as Record<string, object>

export const FormControls: Story = {
  render: () => ({
    components,
    setup: () => ({
      country: ref<string | null>(null),
      tags: ref<string[]>(['vue']),
      city: ref<string | null>(null),
      qty: ref(2),
      pwd: ref(''),
      notify: ref(['email']),
      plan: ref('pro'),
      on: ref(true),
    }),
    template: `<div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))">
      <VSelect v-model="country" label="Country" :options="['Thailand','Japan','Germany']" clearable />
      <VMultiSelect v-model="tags" label="Skills" searchable :options="[{label:'Vue',value:'vue'},{label:'TypeScript',value:'ts'},{label:'CSS',value:'css'}]" />
      <VAutocomplete v-model="city" label="City" :options="['Bangkok','Berlin','Boston']" />
      <VNumberInput v-model="qty" label="Seats" :min="1" :max="10" />
      <VPasswordInput v-model="pwd" label="Password" strength />
      <VTextarea label="Bio" show-count :maxlength="120" />
      <VCheckboxGroup v-model="notify" label="Notify" select-all :options="['email','sms','push']" />
      <VRadioGroup v-model="plan" label="Plan" :options="[{label:'Starter',value:'starter'},{label:'Pro',value:'pro'}]" />
      <VSwitch v-model="on" label="Weekly digest" />
    </div>`,
  }),
}

export const DateAndUpload: Story = {
  render: () => ({
    components,
    setup: () => ({ d: ref(null), r: ref(null), t: ref('09:00'), files: ref([]), img: ref(null) }),
    template: `<div style="display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))">
      <VDatePicker v-model="d" label="Date" clearable />
      <VDateRangePicker v-model="r" label="Range" />
      <VTimePicker v-model="t" label="Time" :minute-step="15" />
      <VCalendar />
      <VUpload v-model="files" label="Files" accept="image/*,.pdf" />
      <VImageUpload v-model="img" label="Avatar" shape="circle" />
    </div>`,
  }),
}

export const Feedback: Story = {
  render: () => ({
    components,
    setup: () => ({ snack: ref(false) }),
    template: `<div style="display:grid;gap:1rem;max-width:40rem">
      <VAlert color="info" title="Heads up" description="Maintenance on Sunday." closable />
      <VAlert color="danger" variant="accent" title="Payment failed" />
      <VProgress :value="64" label="Upload" show-value />
      <div style="display:flex;gap:1rem"><VProgress variant="circular" :value="40" show-value /><VProgress variant="circular" /></div>
      <VSkeleton :lines="3" />
      <VLoadingOverlay text="Loading…"><div style="height:6rem;border:1px dashed #ccc" /></VLoadingOverlay>
      <VButton @click="snack = true">Show snackbar</VButton>
      <VSnackbar v-model="snack" text="Saved" action-label="Undo" />
    </div>`,
  }),
}

export const Overlays: Story = {
  render: () => ({
    components,
    setup: () => ({
      modal: ref(false),
      dialog: ref(false),
      drawer: ref(false),
      items: [
        { label: 'Settings', icon: IconSettings },
        { label: 'Export', icon: IconDownload },
        { divider: true },
        { label: 'Delete', icon: IconTrash, danger: true },
      ],
    }),
    template: `<div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <VButton @click="modal = true">Modal</VButton>
      <VButton color="danger" variant="soft" @click="dialog = true">Dialog</VButton>
      <VButton variant="outline" color="neutral" @click="drawer = true">Drawer</VButton>
      <VTooltip text="Tooltip text"><VButton variant="ghost" color="neutral">Tooltip</VButton></VTooltip>
      <VPopover title="Popover"><template #trigger><VButton variant="ghost" color="neutral">Popover</VButton></template>Content</VPopover>
      <VMenu :items="items"><template #trigger="{ props }"><VButton v-bind="props" variant="outline" color="neutral">Menu</VButton></template></VMenu>
      <VModal v-model="modal" title="Modal title" description="Supporting text">Body<template #footer="{ close }"><VButton @click="close">OK</VButton></template></VModal>
      <VDialog v-model="dialog" color="danger" title="Delete?" message="This cannot be undone." confirm-text="Delete" />
      <VDrawer v-model="drawer" title="Drawer">Drawer content</VDrawer>
    </div>`,
  }),
}

export const Navigation: Story = {
  render: () => ({
    components,
    setup: () => ({ tab: ref('a'), page: ref(4) }),
    template: `<div style="display:grid;gap:1.5rem">
      <VBreadcrumb :items="[{label:'Home',href:'#'},{label:'Projects',href:'#'},{label:'Violet'}]" />
      <VTabs v-model="tab" :items="[{value:'a',label:'Overview'},{value:'b',label:'Activity',badge:2},{value:'c',label:'Disabled',disabled:true}]">
        <template #default="{ item }">Panel: {{ item.label }}</template>
      </VTabs>
      <VTabs variant="segmented" :items="[{value:'m',label:'Monthly'},{value:'y',label:'Yearly'}]" />
      <VPagination v-model="page" :total="200" show-edges />
    </div>`,
  }),
}

export const DataDisplay: Story = {
  render: () => ({
    components,
    template: `<div style="display:grid;gap:1.5rem;max-width:44rem">
      <div style="display:flex;gap:.75rem;align-items:center;flex-wrap:wrap">
        <VAvatar name="Ada Lovelace" status="online" /><VBadge :content="3"><VAvatar name="Grace Hopper" /></VBadge>
        <VTag color="success" dot>Active</VTag><VTag color="warning">Pending</VTag>
        <VChip label="Filter" selectable /><VChip label="Removable" color="primary" closable />
      </div>
      <VCard title="Card title" subtitle="Subtitle">Card body<template #footer><VButton size="sm">Action</VButton></template></VCard>
      <VList interactive chevron dividers :items="[{title:'Ada',subtitle:'Admin',avatarName:'Ada L'},{title:'Grace',subtitle:'Editor',avatarName:'Grace H'}]" />
      <VAccordion :items="[{value:1,title:'Question one',content:'Answer one'},{value:2,title:'Question two',content:'Answer two'}]" />
      <VTimeline :items="[{title:'Deployed',time:'2h ago',color:'success'},{title:'Created',time:'Mar 3'}]" />
      <VEmptyState title="No data" description="Nothing to show yet." />
    </div>`,
  }),
}

interface Person extends Record<string, unknown> {
  id: number
  name: string
  role: string
  spend: number
}
const people: Person[] = Array.from({ length: 34 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  role: ['Admin', 'Editor', 'Viewer'][i % 3]!,
  spend: (i * 937) % 4000,
}))
const columns: DataTableColumn<Person>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'spend', label: 'Spend', sortable: true, align: 'right', format: (v) => `$${v}` },
]

export const DataTable: Story = {
  render: () => ({
    components,
    setup: () => ({ people, columns, selected: ref([]) }),
    template: `<VDataTable v-model:selected="selected" :rows="people" :columns="columns" multi-sort exportable :page-size="5" :page-sizes="[5,10,25]" />`,
  }),
}
