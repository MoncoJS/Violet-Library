# Input

<div class="demo demo--stack">
  <VInput label="Email" type="email" placeholder="jane@company.com" hint="We'll send a confirmation link" />
  <VInput label="Username" model-value="admin" error="This username is taken" />
  <VInput label="Search" type="search" placeholder="Search…" clearable />
</div>

```vue
<VInput v-model="email" label="Email" type="email" hint="We'll send a confirmation link" />
<VInput v-model.trim="username" label="Username" :error="errors.username" />
<VInput v-model="q" type="search" clearable :prepend-icon="IconSearch" />
```

## With useForm

```vue
<VInput label="Email" v-bind="form.register('email')" />
```

`register()` returns `name`, `modelValue`, `onUpdate:modelValue`, `onBlur` and `error`.

## Props

| Prop                                | Type                                                                        | Default     |
| ----------------------------------- | --------------------------------------------------------------------------- | ----------- |
| `modelValue`                        | `string \| number \| null`                                                  | —           |
| `type`                              | `'text' \| 'email' \| 'password' \| 'search' \| 'tel' \| 'url' \| 'number'` | `'text'`    |
| `label`, `hint`, `placeholder`      | `string`                                                                    | —           |
| `error`                             | `string \| boolean`                                                         | —           |
| `size`                              | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                      | `'md'`      |
| `variant`                           | `'outline' \| 'filled'`                                                     | `'outline'` |
| `clearable`, `loading`, `showCount` | `boolean`                                                                   | `false`     |
| `disabled`, `readonly`, `required`  | `boolean`                                                                   | `false`     |
| `maxlength`                         | `number`                                                                    | —           |
| `prependIcon`, `appendIcon`         | `Component`                                                                 | —           |

`v-model` modifiers `.trim`, `.number` and `.lazy` are supported. `class` and `style` apply to the wrapper; every other attribute goes to the native `<input>`.

**Slots:** `label`, `prefix`, `suffix`, `hint`. **Events:** `update:modelValue`, `change`, `focus`, `blur`, `clear`. **Exposed:** `focus()`, `blur()`, `select()`, `input`.

## Accessibility

- `<label for>` is wired to an SSR-stable id.
- Hint and error are linked via `aria-describedby`; errors set `aria-invalid` and are announced politely.
- `Escape` clears a clearable input (and only then stops propagation, so dialogs still close).
