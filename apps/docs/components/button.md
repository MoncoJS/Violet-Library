# Button

`VButton`, `VIconButton` and `VButtonGroup`.

<div class="demo">
  <VButton>Primary</VButton>
  <VButton variant="soft">Soft</VButton>
  <VButton variant="outline" color="neutral">Outline</VButton>
  <VButton variant="ghost" color="neutral">Ghost</VButton>
  <VButton variant="link">Link</VButton>
  <VButton color="danger">Danger</VButton>
  <VButton loading>Saving</VButton>
</div>

```vue
<VButton>Primary</VButton>
<VButton variant="soft">Soft</VButton>
<VButton variant="outline" color="neutral">Outline</VButton>
<VButton color="danger">Danger</VButton>
<VButton loading>Saving</VButton>
```

## As a link / router link

```vue
<VButton href="/billing">Billing</VButton>
<VButton :as="RouterLink" to="/settings">Settings</VButton>
```

Disabled links drop `href`, get `aria-disabled="true"` and leave the tab order.

## Group

<div class="demo">
  <VButtonGroup variant="outline" color="neutral" label="Range">
    <VButton>Day</VButton><VButton>Week</VButton><VButton>Month</VButton>
  </VButtonGroup>
</div>

`VButtonGroup` passes `variant`, `color`, `size` and `disabled` to its buttons; a button's own props win.

## Props — VButton

| Prop                        | Type                                                                                    | Default        |
| --------------------------- | --------------------------------------------------------------------------------------- | -------------- |
| `variant`                   | `'solid' \| 'soft' \| 'outline' \| 'ghost' \| 'link'`                                   | `'solid'`      |
| `color`                     | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'neutral'` | `'primary'`    |
| `size`                      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                                                  | `'md'`         |
| `as`                        | `string \| Component`                                                                   | `button` / `a` |
| `type`                      | `'button' \| 'submit' \| 'reset'`                                                       | `'button'`     |
| `href`                      | `string`                                                                                | —              |
| `disabled`                  | `boolean`                                                                               | `false`        |
| `loading`                   | `boolean`                                                                               | `false`        |
| `loadingText`               | `string`                                                                                | —              |
| `block`, `pill`, `iconOnly` | `boolean`                                                                               | `false`        |
| `prependIcon`, `appendIcon` | `Component`                                                                             | —              |

**Slots:** `default`, `prepend`, `append`, `loader`. **Events:** `click`.

## Accessibility

- Native `<button type="button">` by default (no accidental form submits).
- `loading` sets `aria-busy` and blocks activation without removing focus.
- Non-button elements get `role="button"`, `tabindex` and Enter/Space activation.
- `VIconButton` requires `label`, used as `aria-label` and tooltip `title`.
