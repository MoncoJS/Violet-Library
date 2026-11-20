<script setup>
import { ref } from 'vue'
const country = ref(null)
const skills = ref(['vue'])
const city = ref(null)
const seats = ref(2)
const pwd = ref('')
const notify = ref(['email'])
const plan = ref('pro')
const digest = ref(true)
</script>

# Form controls

Every control shares the same frame as `VInput`: `label`, `hint`, `error` (string or `true`), `required`, `disabled`, and works with `v-bind="form.register('field')"` from [useForm](/composables/use-form).

<div class="demo demo--grid">
  <VSelect v-model="country" label="Country" placeholder="Choose…" :options="['Thailand', 'Japan', 'Germany']" clearable />
  <VMultiSelect v-model="skills" label="Skills" searchable :options="[{ label: 'Vue', value: 'vue' }, { label: 'TypeScript', value: 'ts' }, { label: 'CSS', value: 'css' }]" />
  <VAutocomplete v-model="city" label="City" :options="['Bangkok', 'Berlin', 'Boston']" />
  <VNumberInput v-model="seats" label="Seats" :min="1" :max="50" />
  <VPasswordInput v-model="pwd" label="Password" strength />
  <VTextarea label="Bio" :maxlength="160" show-count auto-resize />
  <VCheckboxGroup v-model="notify" label="Notifications" select-all :options="['email', 'sms', 'push']" />
  <VRadioGroup v-model="plan" label="Plan" :options="[{ label: 'Starter', value: 'starter' }, { label: 'Pro', value: 'pro' }]" />
  <VSwitch v-model="digest" label="Weekly digest" description="Every Monday" />
</div>

## Select, MultiSelect, Autocomplete

All three share one engine (ARIA 1.2 combobox + listbox).

```vue
<VSelect v-model="country" label="Country" :options="['Thailand', 'Japan']" clearable />
<VMultiSelect v-model="tags" :options="options" searchable :max-tags="3" :max-selected="5" />
<VAutocomplete
  v-model="user"
  :options="results"
  :filter="false"
  :loading="busy"
  @search="fetchUsers"
/>
<VAutocomplete v-model="tag" :options="tags" allow-custom />
```

| Prop                          | Description                                                     |
| ----------------------------- | --------------------------------------------------------------- |
| `options`                     | Strings, numbers or `{ label, value, disabled?, description? }` |
| `option-label`/`option-value` | Keys to read from your own objects                              |
| `clearable`, `loading`        | Clear button / spinner                                          |
| `searchable`                  | Filter input (always on for `VAutocomplete`)                    |
| `filter`                      | `false` to filter on the server via `@search`                   |
| `allow-custom`                | Enter commits typed text that matches no option                 |
| `max-tags`, `max-selected`    | Chip overflow (`+N`) and selection limit (multiple)             |

Keyboard: <kbd>↓</kbd>/<kbd>↑</kbd> open and move, <kbd>Home</kbd>/<kbd>End</kbd>, <kbd>Enter</kbd>/<kbd>Space</kbd> select, type to jump, <kbd>Esc</kbd> closes, <kbd>Backspace</kbd> removes the last chip. Slots: `option`, `selection`, `empty`.

## NumberInput

`min`, `max`, `step`, `precision`, `prefix`, `suffix`, `hide-controls`. <kbd>↑</kbd>/<kbd>↓</kbd> step (<kbd>Shift</kbd> ×10), <kbd>Home</kbd>/<kbd>End</kbd> jump to bounds; out-of-range values are clamped on blur. Emits `number | null`.

## PasswordInput

Visibility toggle (`aria-pressed`) plus an optional `strength` meter (length, case, digits, symbols).

## Checkbox, Radio, Switch

```vue
<VCheckbox v-model="agree" label="I agree" />
<VCheckbox v-model="list" value="a" label="A" />
<VCheckboxGroup v-model="list" :options="opts" select-all inline />
<VRadioGroup v-model="plan" :options="plans" variant="cards" />
<VSwitch v-model="on" label="Enabled" :loading="saving" />
```

`VCheckbox` supports `indeterminate` and array `v-model`; `VSwitch` uses `role="switch"`. Groups render a `<fieldset>`/`<legend>`; radios keep native arrow-key behaviour.
