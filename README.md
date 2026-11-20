# Violet UI

A premium, accessible **Vue 3** component library for SaaS dashboards and enterprise applications — typed end to end, themeable through design tokens, tree-shakable, and SSR-friendly.

```ts
import { createApp } from 'vue'
import { createVioletUI } from 'violet-ui'
import 'violet-ui/style.css'

createApp(App)
  .use(createVioletUI({ theme: { defaultTheme: 'system' } }))
  .mount('#app')
```

```vue
<script setup lang="ts">
import { VButton, VInput, email, required, useForm } from 'violet-ui'

const form = useForm({
  initialValues: { email: '' },
  rules: { email: [required(), email()] },
  onSubmit: (values) => api.invite(values),
})
</script>

<template>
  <form novalidate @submit="form.handleSubmit()($event)">
    <VInput label="Email" v-bind="form.register('email')" />
    <VButton type="submit" :loading="form.isSubmitting.value">Invite</VButton>
  </form>
</template>
```

## Highlights

- **Design tokens → CSS variables.** Light, dark, `system` and custom themes; derive a whole brand palette from one hex.
- **Accessible by default.** Native semantics, ARIA wiring, keyboard support, WCAG AA color contrast enforced by tests.
- **Forms built in.** `useForm` / `useField` / `useValidation` with typed values, async rules, dirty/touched tracking and server errors.
- **Tree-shaking.** ESM-only, one module per component, side-effect-free JS, auto-import resolver.
- **SSR-safe.** No module-level state, `useId()`-based ids, flash-free theming.

## Status

`0.x` — the foundation (theme, composables, build, release pipeline) and the first components (`VButton`, `VIconButton`, `VButtonGroup`, `VInput`, `VToast`/`VToaster`) are in place. See the [roadmap](docs/ROADMAP.md) for the rest of the component set.

## Repository

| Path              |                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/*`      | Library packages (`theme`, `composables`, `icons`, `core`, `forms`, `feedback`, …, umbrella `violet-ui`)                                       |
| `apps/docs`       | VitePress documentation                                                                                                                        |
| `apps/playground` | Vite playground                                                                                                                                |
| `examples/`       | Recipes                                                                                                                                        |
| `docs/`           | [Architecture](docs/ARCHITECTURE.md) · [Publishing](docs/PUBLISHING.md) · [Roadmap](docs/ROADMAP.md) · [Original brief](docs/PROJECT_BRIEF.md) |

## Development

Requires [Bun](https://bun.sh) ≥ 1.2 and Node ≥ 20.11.

```sh
bun install
bun run dev              # playground at http://localhost:5173
bun run storybook        # http://localhost:6006
bun run docs:dev         # documentation site
bun run test             # all unit tests (Turbo)
bun run typecheck
bun run lint
bun run build            # build all library packages
bun changeset            # describe your change for the next release
```

## License

MIT
