<script setup lang="ts">
import {
  IconDownload,
  IconHome,
  IconSettings,
  IconTrash,
  IconUser,
  VAccordion,
  VAlert,
  VAutocomplete,
  VAvatar,
  VBadge,
  VBreadcrumb,
  VButton,
  VCard,
  VCheckbox,
  VCheckboxGroup,
  VChip,
  VDataTable,
  VDatePicker,
  VDateRangePicker,
  VDialog,
  VDrawer,
  VEmptyState,
  VImageUpload,
  VList,
  VLoadingOverlay,
  VMenu,
  VModal,
  VMultiSelect,
  VNumberInput,
  VPagination,
  VPasswordInput,
  VPopover,
  VProgress,
  VRadioGroup,
  VSelect,
  VSkeleton,
  VSnackbar,
  VSwitch,
  VTabs,
  VTag,
  VTextarea,
  VTimePicker,
  VTimeline,
  VTooltip,
  VUpload,
  useToast,
  type DataTableColumn,
  type UploadItem,
} from 'violet-ui'
import { ref } from 'vue'

const toast = useToast()

// forms
const country = ref<string | null>(null)
const skills = ref<string[]>(['vue'])
const city = ref<string | null>(null)
const qty = ref<number | null>(2)
const pwd = ref('')
const bio = ref('')
const notify = ref(['email'])
const plan = ref('pro')
const agree = ref(false)
const darkMode = ref(true)
const countries = ['Thailand', 'Japan', 'Germany', 'Brazil', 'Canada', 'Kenya', 'Australia']
const skillOpts = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'CSS', value: 'css' },
  { label: 'Node.js', value: 'node' },
  { label: 'Go', value: 'go', disabled: true },
]

// date & upload
const date = ref<string | null>(null)
const range = ref<[string | null, string | null] | null>(null)
const time = ref<string | null>('09:30')
const files = ref<UploadItem[]>([])
const avatar = ref<File | string | null>(null)
const fakeUpload = (_f: File, progress: (p: number) => void) =>
  new Promise<void>((resolve, reject) => {
    let p = 0
    const t = setInterval(() => {
      p += 20
      progress(p)
      if (p >= 100) {
        clearInterval(t)
        if (_f.name.includes('fail')) reject(new Error('Server rejected the file'))
        else resolve()
      }
    }, 200)
  })

// feedback / overlay
const snackbar = ref(false)
const modal = ref(false)
const dialog = ref(false)
const drawer = ref(false)
const loading = ref(false)
const progress = ref(64)
const deleteNow = () =>
  new Promise((r) => setTimeout(r, 800)).then(() => toast.success('Project deleted'))

// navigation
const tab = ref('overview')
const page = ref(3)
const menuItems = [
  { heading: 'Project' },
  { label: 'Edit', shortcut: '⌘E', icon: IconSettings },
  { label: 'Export', icon: IconDownload },
  { divider: true as const },
  { label: 'Delete', icon: IconTrash, danger: true },
]

// data table
interface User extends Record<string, unknown> {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'invited' | 'suspended'
  spend: number
  joined: string
}
const roles = ['Admin', 'Editor', 'Viewer']
const first = [
  'Ada',
  'Grace',
  'Linus',
  'Barbara',
  'Ken',
  'Margaret',
  'Alan',
  'Edsger',
  'Donald',
  'Frances',
  'Tim',
  'Radia',
]
const users: User[] = Array.from({ length: 57 }, (_, i) => ({
  id: i + 1,
  name: `${first[i % first.length]} ${String.fromCharCode(65 + (i % 26))}.`,
  email: `${first[i % first.length]!.toLowerCase()}${i}@example.com`,
  role: roles[i % 3]!,
  status: (['active', 'invited', 'suspended'] as const)[i % 5 === 0 ? 2 : i % 3 === 0 ? 1 : 0],
  spend: Math.round(((i * 7919) % 5000) + 120),
  joined: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 27) + 1).padStart(2, '0')}`,
}))
const columns: DataTableColumn<User>[] = [
  { key: 'name', label: 'Name', sortable: true, sticky: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  {
    key: 'spend',
    label: 'Spend',
    sortable: true,
    align: 'right',
    format: (v) => `$${Number(v).toLocaleString()}`,
  },
  { key: 'joined', label: 'Joined', sortable: true, hidden: true },
]
const selected = ref<(string | number)[]>([])
const statusColor = { active: 'success', invited: 'info', suspended: 'danger' } as const
</script>

<template>
  <main class="pg-main pg-showcase">
    <!-- forms -->
    <section class="pg-card" aria-labelledby="sc-forms">
      <h2 id="sc-forms">Form controls</h2>
      <div class="pg-grid">
        <VSelect
          v-model="country"
          label="Country"
          placeholder="Choose a country"
          :options="countries"
          clearable
        />
        <VMultiSelect
          v-model="skills"
          label="Skills"
          placeholder="Pick skills"
          :options="skillOpts"
          searchable
        />
        <VAutocomplete
          v-model="city"
          label="City"
          placeholder="Type to search"
          :options="['Bangkok', 'Berlin', 'Boston', 'Brisbane', 'Tokyo']"
          clearable
        />
        <VNumberInput v-model="qty" label="Seats" :min="1" :max="50" hint="Between 1 and 50" />
        <VPasswordInput v-model="pwd" label="Password" strength autocomplete="new-password" />
        <VTextarea
          v-model="bio"
          label="Bio"
          placeholder="Tell us about yourself"
          :maxlength="160"
          show-count
          auto-resize
        />
      </div>
      <div class="pg-grid">
        <VCheckboxGroup
          v-model="notify"
          label="Notifications"
          select-all
          :options="[
            { label: 'Email', value: 'email' },
            { label: 'SMS', value: 'sms' },
            { label: 'Push', value: 'push', description: 'On your phone' },
          ]"
        />
        <VRadioGroup
          v-model="plan"
          label="Plan"
          variant="cards"
          :options="[
            { label: 'Starter', value: 'starter', description: 'For individuals' },
            { label: 'Pro', value: 'pro', description: 'For small teams' },
          ]"
        />
        <div class="pg-stack">
          <VSwitch v-model="darkMode" label="Weekly digest" description="Summary every Monday" />
          <VCheckbox v-model="agree" label="I agree to the terms" />
        </div>
      </div>
    </section>

    <!-- date / upload -->
    <section class="pg-card" aria-labelledby="sc-date">
      <h2 id="sc-date">Date, time &amp; upload</h2>
      <div class="pg-grid">
        <VDatePicker v-model="date" label="Start date" placeholder="Pick a date" clearable />
        <VDateRangePicker v-model="range" label="Reporting period" clearable />
        <VTimePicker v-model="time" label="Meeting time" :minute-step="15" clearable />
      </div>
      <div class="pg-grid">
        <VUpload
          v-model="files"
          label="Attachments"
          accept=".pdf,image/*"
          :max-size="5_000_000"
          :upload="fakeUpload"
          description="PDF or images, up to 5 MB (name a file “fail” to see an error)"
        />
        <VImageUpload v-model="avatar" label="Avatar" shape="circle" />
      </div>
    </section>

    <!-- feedback -->
    <section class="pg-card" aria-labelledby="sc-feedback">
      <h2 id="sc-feedback">Feedback</h2>
      <div class="pg-stack">
        <VAlert
          color="info"
          title="Scheduled maintenance"
          description="The API will be read-only on Sunday 02:00–03:00 UTC."
          closable
        />
        <VAlert color="success" variant="accent" title="Payment received" />
        <VAlert
          color="danger"
          variant="outline"
          title="Card declined"
          description="Update your billing details to keep your subscription."
        >
          <template #actions><VButton size="sm" color="danger">Update card</VButton></template>
        </VAlert>
        <VProgress :value="progress" label="Storage" show-value />
        <div class="pg-row">
          <VProgress variant="circular" :value="progress" show-value />
          <VProgress variant="circular" color="success" />
          <div style="flex: 1"><VProgress color="warning" striped :value="40" size="sm" /></div>
        </div>
        <div class="pg-row" style="align-items: flex-start">
          <VSkeleton variant="avatar" />
          <div style="flex: 1"><VSkeleton :lines="3" /></div>
        </div>
        <VLoadingOverlay :loading="loading" text="Refreshing…">
          <VCard title="Revenue" subtitle="Last 30 days"
            >$48,210 <VTag color="success" dot rounded>+12%</VTag></VCard
          >
        </VLoadingOverlay>
        <div class="pg-row">
          <VButton variant="outline" color="neutral" size="sm" @click="loading = !loading"
            >Toggle overlay</VButton
          >
          <VButton variant="outline" color="neutral" size="sm" @click="snackbar = true"
            >Show snackbar</VButton
          >
        </div>
      </div>
      <VSnackbar
        v-model="snackbar"
        text="Message archived"
        action-label="Undo"
        closable
        @action="toast.info('Restored')"
      />
    </section>

    <!-- overlays -->
    <section class="pg-card" aria-labelledby="sc-overlay">
      <h2 id="sc-overlay">Overlays</h2>
      <div class="pg-row">
        <VButton @click="modal = true">Open modal</VButton>
        <VButton color="danger" variant="soft" @click="dialog = true">Delete project</VButton>
        <VButton variant="outline" color="neutral" @click="drawer = true">Open drawer</VButton>
        <VTooltip text="Copies the invite link">
          <VButton variant="ghost" color="neutral">Hover me</VButton>
        </VTooltip>
        <VPopover title="Share">
          <template #trigger><VButton variant="ghost" color="neutral">Popover</VButton></template>
          <template #default="{ close }">
            <p style="margin: 0 0 0.75rem">Anyone with the link can view.</p>
            <VButton size="sm" @click="close">Done</VButton>
          </template>
        </VPopover>
        <VMenu
          :items="menuItems"
          label="Project actions"
          @select="toast.info(`Selected ${$event.label}`)"
        >
          <template #trigger="{ props }"
            ><VButton v-bind="props" variant="outline" color="neutral">Actions</VButton></template
          >
        </VMenu>
      </div>
      <VModal
        v-model="modal"
        title="Invite teammates"
        description="They'll get an email with a link to join."
      >
        <VSelect label="Role" :options="['Admin', 'Editor', 'Viewer']" />
        <template #footer="{ close }">
          <VButton variant="outline" color="neutral" @click="close">Cancel</VButton>
          <VButton @click="close">Send invites</VButton>
        </template>
      </VModal>
      <VDialog
        v-model="dialog"
        color="danger"
        title="Delete project?"
        message="This permanently removes the project and its data. This can't be undone."
        confirm-text="Delete"
        :on-confirm="deleteNow"
      />
      <VDrawer v-model="drawer" title="Filters">
        <div class="pg-stack">
          <VSelect label="Status" :options="['Active', 'Invited', 'Suspended']" />
          <VDateRangePicker label="Joined" />
        </div>
        <template #footer="{ close }"><VButton @click="close">Apply</VButton></template>
      </VDrawer>
    </section>

    <!-- navigation -->
    <section class="pg-card" aria-labelledby="sc-nav">
      <h2 id="sc-nav">Navigation</h2>
      <VBreadcrumb
        :items="[
          { label: 'Home', href: '#', icon: IconHome },
          { label: 'Projects', href: '#' },
          { label: 'Violet', href: '#' },
          { label: 'Settings', href: '#' },
          { label: 'Billing' },
        ]"
        :max-items="4"
      />
      <VTabs
        v-model="tab"
        :items="[
          { value: 'overview', label: 'Overview' },
          { value: 'activity', label: 'Activity', badge: 3 },
          { value: 'settings', label: 'Settings' },
          { value: 'archived', label: 'Archived', disabled: true },
        ]"
      >
        <template #panel-overview>
          <VAccordion
            :items="[
              {
                value: 1,
                title: 'What is Violet UI?',
                content: 'A Vue 3 component library for SaaS dashboards.',
              },
              {
                value: 2,
                title: 'Is it accessible?',
                content: 'Yes — WAI-ARIA patterns and full keyboard support.',
              },
            ]"
          />
        </template>
        <template #panel-activity>
          <VTimeline
            :items="[
              { title: 'Deployed v1.2', time: '2h ago', color: 'success' },
              {
                title: 'Grace opened PR #42',
                description: 'Add data table export',
                time: 'Yesterday',
              },
              { title: 'Project created', time: 'Mar 3', color: 'neutral' },
            ]"
          />
        </template>
        <template #panel-settings>
          <VTabs
            variant="segmented"
            :items="[
              { value: 'm', label: 'Monthly' },
              { value: 'y', label: 'Yearly' },
            ]"
            model-value="m"
          />
        </template>
      </VTabs>
      <VPagination v-model="page" :total="240" :page-size="10" show-edges />
    </section>

    <!-- data display -->
    <section class="pg-card" aria-labelledby="sc-display">
      <h2 id="sc-display">Data display</h2>
      <div class="pg-row">
        <VAvatar name="Ada Lovelace" status="online" />
        <VAvatar name="Grace Hopper" size="lg" />
        <VAvatar src="https://i.pravatar.cc/80?img=5" alt="Profile photo" status="busy" />
        <VBadge :content="128" label="128 notifications"
          ><VAvatar name="Linus T" shape="square"
        /></VBadge>
        <VBadge :content="5" color="primary" variant="soft" />
        <VTag color="success" dot>Active</VTag>
        <VTag color="warning">Pending</VTag>
        <VTag variant="outline">v2.1</VTag>
        <VChip label="Design" selectable :selected="true" />
        <VChip label="Remote" color="primary" closable />
        <VChip label="Vue" :icon="IconUser" variant="outline" />
      </div>
      <div class="pg-grid">
        <VList
          interactive
          chevron
          dividers
          :items="[
            {
              title: 'Ada Lovelace',
              subtitle: 'ada@example.com',
              avatarName: 'Ada Lovelace',
              meta: 'Admin',
            },
            {
              title: 'Grace Hopper',
              subtitle: 'grace@example.com',
              avatarName: 'Grace Hopper',
              meta: 'Editor',
            },
            { title: 'Settings', icon: IconSettings },
          ]"
        />
        <VEmptyState
          title="No invoices yet"
          description="Invoices appear here after your first billing cycle."
        >
          <template #actions><VButton size="sm">Create invoice</VButton></template>
        </VEmptyState>
      </div>
    </section>

    <!-- table -->
    <section class="pg-card pg-wide" aria-labelledby="sc-table">
      <h2 id="sc-table">Data table</h2>
      <VDataTable
        v-model:selected="selected"
        :rows="users"
        :columns="columns"
        multi-sort
        exportable="users.csv"
        :page-size="10"
      >
        <template #cell-name="{ row }">
          <span class="pg-row" style="gap: 0.5rem; flex-wrap: nowrap"
            ><VAvatar :name="row.name" size="xs" />{{ row.name }}</span
          >
        </template>
        <template #cell-status="{ row }">
          <VTag :color="statusColor[row.status]" dot rounded>{{ row.status }}</VTag>
        </template>
        <template #actions="{ selected: rows }">
          <VButton
            size="sm"
            color="danger"
            variant="soft"
            @click="toast.warning(`Would delete ${rows.length} users`)"
            >Delete</VButton
          >
        </template>
      </VDataTable>
    </section>
  </main>
</template>
