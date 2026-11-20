# useTheme

```ts
const { name, preference, isDark, current, themes, setTheme, toggle, register } = useTheme()
```

| Member                       | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `preference`                 | What the user chose — a theme name or `'system'` |
| `name`                       | The concrete theme in effect                     |
| `current`                    | Resolved `ThemeDefinition` (tokens)              |
| `isDark`                     | Whether the current theme is dark                |
| `setTheme(name \| 'system')` | Change and persist the preference                |
| `toggle()`                   | Switch between light and dark                    |
| `register(name, theme)`      | Add a theme at runtime                           |

Preferences persist to `localStorage` under `violet-ui-theme` (configure with `storageKey`, or `false` to disable). See [Theming](../guide/theming) for tokens and custom themes.
