# Getting started

## Install

::: code-group

```sh [bun]
bun add violet-ui
```

```sh [npm]
npm install violet-ui
```

```sh [pnpm]
pnpm add violet-ui
```

:::

Vue `^3.5` is a peer dependency.

## Register the plugin

```ts
// main.ts
import { createApp } from 'vue'
import { createVioletUI } from 'violet-ui'
import 'violet-ui/style.css'
import App from './App.vue'

createApp(App)
  .use(createVioletUI({ theme: { defaultTheme: 'system' } }))
  .mount('#app')
```

`createVioletUI` provides the theme manager and toast store. It does **not** register components globally — import them where you use them (or use the [auto-import resolver](./auto-import)):

```vue
<script setup lang="ts">
import { VButton, VInput } from 'violet-ui'
</script>

<template>
  <VInput label="Project name" />
  <VButton>Create</VButton>
</template>
```

## Granular packages

`violet-ui` re-exports every package. Large apps can depend on the scoped packages directly:

| Package                  | Contents                                                       |
| ------------------------ | -------------------------------------------------------------- |
| `@violet-ui/theme`       | Tokens, themes, CSS variable engine, SCSS                      |
| `@violet-ui/composables` | `useForm`, `useField`, `useValidation`, `useToast`, `useTheme` |
| `@violet-ui/core`        | `VButton`, `VIconButton`, `VButtonGroup`, `VSpinner`           |
| `@violet-ui/forms`       | `VInput`                                                       |
| `@violet-ui/feedback`    | `VToast`, `VToaster`                                           |
| `@violet-ui/icons`       | SVG icon components                                            |
