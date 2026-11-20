# Data display

<div class="demo">
  <VAvatar name="Ada Lovelace" status="online" />
  <VAvatar name="Grace Hopper" size="lg" />
  <VBadge :content="128" label="128 notifications"><VAvatar name="Linus T" shape="square" /></VBadge>
  <VTag color="success" dot>Active</VTag>
  <VTag color="warning">Pending</VTag>
  <VChip label="Design" selectable :selected="true" />
  <VChip label="Remote" color="primary" closable />
</div>

<div class="demo demo--stack">
  <VCard title="Revenue" subtitle="Last 30 days">$48,210</VCard>
  <VList interactive chevron dividers :items="[{ title: 'Ada Lovelace', subtitle: 'ada@example.com', avatarName: 'Ada Lovelace', meta: 'Admin' }, { title: 'Grace Hopper', subtitle: 'grace@example.com', avatarName: 'Grace Hopper', meta: 'Editor' }]" />
  <VAccordion :items="[{ value: 1, title: 'What is Violet UI?', content: 'A Vue 3 component library.' }, { value: 2, title: 'Is it accessible?', content: 'Yes.' }]" />
  <VTimeline :items="[{ title: 'Deployed v1.2', time: '2h ago', color: 'success' }, { title: 'Project created', time: 'Mar 3' }]" />
  <VEmptyState title="No invoices yet" description="Invoices appear after your first billing cycle." />
</div>

| Component     | Key props                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| `VAvatar`     | `src`, `name` (initials and a stable color), `size`, `shape`, `status`                                                |
| `VBadge`      | `content`, `max` (shows 99+), `dot`, `hide-zero`; wrap a child to attach it to the corner                             |
| `VChip`       | `selectable` with `v-model:selected`, `closable` (`@close`), `icon`                                                   |
| `VTag`        | Static status label: `color`, `variant`, `dot`, `rounded`                                                             |
| `VCard`       | `title`, `subtitle`, `image`, `variant`, `padding`, `interactive`, `as`; slots `header`, `actions`, `footer`, `media` |
| `VList`       | `items`, `interactive` (`@select`), `dividers`, `dense`, `chevron`; slots `prepend`, `item`, `append`                 |
| `VAccordion`  | `items`, `multiple`, `v-model` (open values), `variant`, `heading-level`                                              |
| `VTimeline`   | `items: { title, description?, time?, icon?, color? }[]`                                                              |
| `VEmptyState` | `title`, `description`, `icon`; `actions` slot                                                                        |
