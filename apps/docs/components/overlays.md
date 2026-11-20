<script setup>
import { ref } from 'vue'
const modal = ref(false)
const dialog = ref(false)
const drawer = ref(false)
const items = [
  { label: 'Edit', shortcut: '⌘E' },
  { label: 'Duplicate' },
  { divider: true },
  { label: 'Delete', danger: true },
]
const remove = () => new Promise((r) => setTimeout(r, 800))
</script>

# Overlays

<div class="demo">
  <VButton @click="modal = true">Modal</VButton>
  <VButton color="danger" variant="soft" @click="dialog = true">Confirm dialog</VButton>
  <VButton variant="outline" color="neutral" @click="drawer = true">Drawer</VButton>
  <VTooltip text="Copies the link"><VButton variant="ghost" color="neutral">Tooltip</VButton></VTooltip>
  <VPopover title="Share"><template #trigger><VButton variant="ghost" color="neutral">Popover</VButton></template>Anyone with the link can view.</VPopover>
  <VMenu :items="items"><template #trigger="{ props }"><VButton v-bind="props" variant="outline" color="neutral">Menu</VButton></template></VMenu>
</div>

<VModal v-model="modal" title="Invite teammates" description="They will receive an email.">
  <VInput label="Email" />
  <template #footer="{ close }"><VButton variant="outline" color="neutral" @click="close">Cancel</VButton><VButton @click="close">Send</VButton></template>
</VModal>
<VDialog v-model="dialog" color="danger" title="Delete project?" message="This cannot be undone." confirm-text="Delete" :on-confirm="remove" />
<VDrawer v-model="drawer" title="Filters">Drawer content</VDrawer>

## Modal & Drawer

```vue
<VModal v-model="open" title="Title" size="lg" persistent initial-focus="#email">
  …
  <template #footer="{ close }"><VButton @click="close">Done</VButton></template>
</VModal>

<VDrawer v-model="open" placement="left" size="20rem" title="Menu" />
```

Both trap focus, restore it to the trigger, lock body scroll (aware of stacked overlays), close the top-most overlay on <kbd>Esc</kbd> and on backdrop click (`persistent` disables both). On phones the modal becomes a bottom sheet. `VDrawer modeless` keeps the page interactive.

## Dialog

`VDialog` is a confirm/alert built on `VModal` (`role="alertdialog"`, focus starts on Cancel). `:on-confirm` may return a promise: the button shows a spinner and the dialog stays open while it is pending. Resolve `false` to keep it open.

## Tooltip & Popover

`VTooltip` wires `aria-describedby` onto its first child, shows on hover (after a delay) and on focus, and hides on <kbd>Esc</kbd>. `VPopover` is a non-modal dialog (`trigger="click | hover"`) whose default slot receives `close`. Both flip to stay on screen.
