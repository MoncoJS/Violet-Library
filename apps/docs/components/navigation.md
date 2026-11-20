<script setup>
import { ref } from 'vue'
const tab = ref('overview')
const page = ref(4)
</script>

# Navigation

<div class="demo demo--stack">
  <VBreadcrumb :items="[{ label: 'Home', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Violet', href: '#' }, { label: 'Settings' }]" :max-items="3" />
  <VTabs v-model="tab" :items="[{ value: 'overview', label: 'Overview' }, { value: 'activity', label: 'Activity', badge: 3 }, { value: 'archived', label: 'Archived', disabled: true }]">
    <template #default="{ item }">Content for {{ item.label }}</template>
  </VTabs>
  <VTabs variant="segmented" :items="[{ value: 'm', label: 'Monthly' }, { value: 'y', label: 'Yearly' }]" model-value="m" />
  <VPagination v-model="page" :total="240" show-edges />
</div>

## Tabs

`variant` (line, pills, segmented), `orientation`, `fill`, `manual` (arrow keys move focus, Enter selects), `keep-alive`. Provide panels with `#panel-{value}` or the default slot (`{ item }`).

## Pagination

`total`, `page-size`, `siblings`, `show-edges`, `simple` ("Page x of y"). On small screens it collapses to previous / current / next.

## Menu & Dropdown

```vue
<VMenu
  :items="[
    { label: 'Edit', icon: IconSettings, shortcut: '⌘E' },
    { divider: true },
    { label: 'Delete', danger: true, onSelect: remove },
  ]"
>
  <template #trigger="{ props }"><VButton v-bind="props">Actions</VButton></template>
</VMenu>

<VDropdown placement="bottom-end">
  <template #trigger="{ props }"><VButton v-bind="props">Filters</VButton></template>
  <template #default="{ close }">…any content…</template>
</VDropdown>
```

`VMenu` implements the ARIA menu pattern (roving focus, typeahead, <kbd>Esc</kbd> returns focus to the trigger). Spread the trigger's `props` to get `aria-haspopup` and `aria-expanded`.

## Breadcrumb

`items: { label, href?, to?, icon? }[]`, `separator`, `max-items` (collapses the middle into an expandable "…"), and `as` for `RouterLink`.
