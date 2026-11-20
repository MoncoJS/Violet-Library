# SSR & Nuxt

Violet UI is SSR-safe:

- No module-level state: `createVioletUI()` creates the theme manager and toast store **per app**, so requests never share state.
- No DOM access during render. The theme manager only touches `document` in `mount()`, which runs on the client.
- Element ids use Vue's `useId()`, so server and client markup match.
- `theme.css` follows `prefers-color-scheme` with pure CSS.

## Avoiding a theme flash for saved preferences

```ts
import { getThemeInitScript } from 'violet-ui'

// e.g. Nuxt: app.head.script
useHead({ script: [{ innerHTML: getThemeInitScript(), tagPosition: 'head' }] })
```

## Custom themes on the server

```ts
const violet = createVioletUI({ theme: { themes: { ocean: { colors: { primary: '#0369a1' } } } } })
app.use(violet)
// inject into <head>
const css = violet.theme.renderStyles()
const htmlAttrs = violet.theme.htmlAttrs()
```

## Nuxt plugin

```ts
// plugins/violet-ui.ts
import { createVioletUI } from 'violet-ui'
import 'violet-ui/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createVioletUI())
})
```
