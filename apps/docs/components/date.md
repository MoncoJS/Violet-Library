<script setup>
import { ref } from 'vue'
const d = ref(null)
const r = ref(null)
const t = ref('09:30')
</script>

# Date & time

Values are ISO strings (`YYYY-MM-DD`, `HH:mm`): timezone-free and SSR-stable. Display text uses `Intl` with the `locale` prop.

<div class="demo demo--grid">
  <VDatePicker v-model="d" label="Start date" clearable />
  <VDateRangePicker v-model="r" label="Period" clearable />
  <VTimePicker v-model="t" label="Time" :minute-step="15" />
</div>

```vue
<VDatePicker
  v-model="date"
  :min="today"
  :is-date-disabled="isWeekend"
  locale="th-TH"
  :first-day-of-week="1"
/>
<VDateRangePicker
  v-model="range"
  :presets="[{ label: 'Q1', value: () => ['2026-01-01', '2026-03-31'] }]"
/>
<VTimePicker v-model="time" hour12 min="08:00" max="18:00" />
<VCalendar v-model="date" />
```

- Typing works too: ISO or the locale's numeric order (`22/11/2026` in `en-GB`).
- The calendar follows the WAI-ARIA date grid: arrows, <kbd>Home</kbd>/<kbd>End</kbd> (week), <kbd>PageUp</kbd>/<kbd>PageDown</kbd> (month; with <kbd>Shift</kbd>, year), <kbd>Enter</kbd> to pick, <kbd>Esc</kbd> to close.
- `VDateRangePicker` shows two months (one on narrow screens) and built-in presets (`:presets="false"` hides them).
