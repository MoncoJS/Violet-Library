# Theming

Violet UI styles are driven entirely by CSS custom properties prefixed `--v-`.

## Token layers

1. **Palette** — raw color scales (`palette.violet[600]`). Never used by components directly.
2. **Global tokens** — mode-independent: `--v-space-*`, `--v-radius-*`, `--v-font-*`, `--v-duration-*`, `--v-z-*`, `--v-control-height-*`.
3. **Theme tokens** — per theme: surfaces (`--v-color-surface`, `--v-color-text-muted`, …), shadows, and seven semantic roles (`primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`) each with `base / hover / active / contrast / soft / soft-hover / soft-text`.
4. **Component tokens** — private `--_*` variables inside each component, overridable per instance.

## Switching themes

```ts
const { isDark, toggle, setTheme, preference } = useTheme()
setTheme('dark') // explicit
setTheme('system') // follow prefers-color-scheme
```

The active theme is applied as `data-v-theme` on `<html>`. Without JavaScript, `theme.css` already follows `prefers-color-scheme`, so SSR pages never flash.

## Custom themes

Pass a single brand color — hover, active, soft and a WCAG-readable foreground are derived:

```ts
createVioletUI({
  theme: {
    themes: {
      ocean: { colors: { primary: '#0369a1' } },
      'ocean-dark': { dark: true, colors: { primary: '#38bdf8' } },
      // override a built-in theme
      light: { colors: { primary: '#db2777' } },
    },
  },
})
```

Or build one ahead of time with `createTheme(overrides, baseTheme)`, and render CSS with `renderThemeCss({ themes })`.

## Per-instance overrides

```vue
<VButton style="--_radius: 0">Square corners</VButton>
```
