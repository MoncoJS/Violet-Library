<script setup>
import { ref } from 'vue'
const snack = ref(false)
const busy = ref(false)
</script>

# Feedback

<div class="demo demo--stack">
  <VAlert color="info" title="Scheduled maintenance" description="Read-only on Sunday 02:00–03:00 UTC." closable />
  <VAlert color="success" variant="accent" title="Payment received" />
  <VAlert color="danger" variant="outline" title="Card declined" description="Update your billing details." />
  <VProgress :value="64" label="Storage" show-value />
  <div class="demo"><VProgress variant="circular" :value="40" show-value /><VProgress variant="circular" /></div>
  <VSkeleton :lines="3" />
  <VLoadingOverlay :loading="busy" text="Refreshing…"><VCard title="Revenue">$48,210</VCard></VLoadingOverlay>
  <div class="demo">
    <VButton variant="outline" color="neutral" @click="busy = !busy">Toggle overlay</VButton>
    <VButton variant="outline" color="neutral" @click="snack = true">Snackbar</VButton>
  </div>
  <VSnackbar v-model="snack" text="Message archived" action-label="Undo" />
</div>

| Component         | Key props                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `VAlert`          | `color`, `variant` (soft, outline, solid, accent), `title`, `closable`, `actions` slot           |
| `VSnackbar`       | `v-model`, `text`, `timeout` (0 = sticky), `action-label`, `position`                            |
| `VProgress`       | `value` (omit for indeterminate), `variant` (linear, circular), `striped`, `show-value`          |
| `VSkeleton`       | `variant` (text, rect, circle, avatar, button), `lines`, `loading` (renders the slot when false) |
| `VLoadingOverlay` | `loading`, `text`, `fullscreen`, `blur`                                                          |

For stacked notifications use [Toast](/components/toast).
