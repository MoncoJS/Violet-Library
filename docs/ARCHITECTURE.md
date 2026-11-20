# Architecture

## 1. Folder structure

```
violet-ui/
├── .changeset/                 # Changesets config + pending release notes
├── .github/workflows/          # ci.yml, release.yml
├── .storybook/                 # Storybook (stories live next to components)
├── apps/
│   ├── docs/                   # VitePress documentation site
│   └── playground/             # Vite app for manual testing (consumes src via aliases)
├── docs/                       # Architecture, publishing, roadmap (this folder)
├── examples/                   # Copy-paste recipes
├── packages/
│   ├── theme/                  # Tokens, themes, CSS var engine, SCSS mixins   (no Vue)
│   ├── composables/            # useForm/useField/useValidation/useToast/useTheme
│   ├── icons/                  # createIcon() + SVG icon components
│   ├── core/                   # VButton, VIconButton, VButtonGroup, VSpinner, withInstall
│   ├── forms/                  # VInput (+ planned form controls)
│   ├── feedback/               # VToast, VToaster (+ planned feedback components)
│   ├── overlay/                # planned (private until first release)
│   ├── navigation/             # planned (private until first release)
│   ├── data-display/           # planned (private until first release)
│   ├── data-table/             # planned (private until first release)
│   └── violet-ui/              # Umbrella: re-exports, createVioletUI, resolver, volar.d.ts, style.css
├── scripts/publish.ts          # Publishes changed packages (workspace:* → real versions)
├── tooling/                    # Shared Vite library/Vitest configs and source aliases
├── turbo.json
└── package.json                # Bun workspaces
```

Each component package follows the same layout:

```
packages/<pkg>/
├── src/
│   ├── components/VThing/
│   │   ├── VThing.vue           # <script setup lang="ts"> + <style lang="scss">
│   │   ├── types.ts             # Props / Emits / Slots / Exposed interfaces
│   │   ├── VThing.spec.ts       # Vitest + @vue/test-utils
│   │   └── VThing.stories.ts    # Storybook CSF3
│   └── index.ts                 # withInstall() wrappers + type exports
├── package.json  tsconfig.json  tsconfig.build.json  vite.config.ts  vitest.config.ts
```

### Dependency graph

```
theme ──► composables ──┐
  │                     ├──► forms ─┐
  ├──► core ────────────┤           ├──► violet-ui
  │                     └──► feedback┘
icons ──────────────────────────────┘
```

Packages depend on siblings by name (`workspace:*`); Turbo builds them in topological order.

## 2. Component architecture

- **SFC + `<script setup>`**, typed with `defineProps<Interface>()`. Public interfaces live in `types.ts` and are re-exported, so consumers can type wrappers (`ButtonProps`, `InputExposed`, …).
- **Styling contract:** BEM-ish classes (`v-button`, `v-button__icon`, `v-button--soft`, state classes `is-disabled`). Styles are unscoped single-class selectors, so apps can override without `!important`.
- **Component tokens:** each component maps theme tokens to private `--_*` custom properties (`--_height`, `--_radius`, `--_base`). Variants only reference private tokens, which makes colors × variants combinatorial with no duplication and allows per-instance overrides via `style`.
- **Context, not prop drilling:** `VButtonGroup` provides defaults through an `InjectionKey`; explicit props on a child always win.
- **Attribute routing:** inputs use `inheritAttrs: false` — `class`/`style` go to the wrapper, all other attributes to the native element.
- **Accessibility:** native elements first; ARIA only where needed (`aria-busy`, `aria-invalid`, `aria-describedby`, `role="status"/"alert"`). Ids use Vue's SSR-stable `useId()`.
- **Global registration:** `withInstall()` adds `install()` while keeping components as plain named exports (marked `/* @__PURE__ */`).

## 3. Type definitions

- `ColorRole`, `ComponentSize` come from `@violet-ui/theme` and are shared by every component.
- Every component exports `XxxProps`, and where relevant `XxxEmits`, `XxxSlots`, `XxxExposed`, plus `VXxxInstance` for template refs.
- Forms are generic: `useForm<T>()` infers `T` from `initialValues`; `FormRules<T>` types each rule's value as `T[K]`; `register<K>()` returns `FieldBinding<T[K]>`.
- `volar.d.ts` augments `GlobalComponents` for globally registered/auto-imported usage.

## 4. Theme system

| Layer            | Example                                                           | Where                  |
| ---------------- | ----------------------------------------------------------------- | ---------------------- |
| Palette          | `palette.violet[600]`                                             | `theme/src/palette.ts` |
| Global tokens    | `--v-space-4`, `--v-radius-md`, `--v-z-modal`                     | `theme/src/tokens.ts`  |
| Theme tokens     | `--v-color-primary-soft`, `--v-color-text-muted`, `--v-shadow-lg` | `theme/src/themes.ts`  |
| Component tokens | `--_height`, `--_base`                                            | each SFC               |

- `renderThemeCss()` turns definitions into CSS. At build time it produces `theme.css` with `:root` (light), `[data-v-theme="dark"]`, and a `prefers-color-scheme` fallback → **no-JS system mode, no SSR flash**.
- `createTheme(overrides, base)` layers overrides; a role can be a single hex and `deriveRole()` computes hover/active/soft and picks a WCAG-readable foreground.
- `createThemeManager()` (used by `useTheme`) holds preference (`'system'` or a name), resolves it, persists to localStorage, sets `data-v-theme` on `<html>`, and injects CSS only for custom themes. It's pure until `mount()` — SSR-safe — and exposes `renderStyles()` / `htmlAttrs()` / `getThemeInitScript()` for server rendering.
- A unit test asserts every built-in role meets WCAG AA (4.5:1) in both themes.

## 5. Build configuration

`tooling/vite.lib.ts` is shared by every package:

- Vite library mode, **ESM only**, `target: es2022`.
- `preserveModules` (root `src`) → one output module per source module, so any bundler tree-shakes unused components.
- `dependencies` + `peerDependencies` are externalised (no duplicated Vue or sibling packages).
- SFC styles are extracted into a single `dist/style.css` per package (`cssFileName: 'style'`).
- `vite-plugin-dts` emits `.d.ts` per module via `vue-tsc`, from `tsconfig.build.json` (which excludes specs and stories).
- `@violet-ui/theme` additionally runs `scripts/generate-css.ts` to emit `dist/theme.css`.

Development tools (Vitest, Storybook, playground, docs) resolve `@violet-ui/*` to `src/index.ts` via `tooling/aliases.ts`, so they never need a prior build. Library builds deliberately do **not** use these aliases so emitted code and types reference package names.

## 6. Package export strategy

```jsonc
{
  "type": "module",
  "sideEffects": ["**/*.css"], // JS is side-effect free
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./style.css": "./dist/style.css",
    "./package.json": "./package.json",
  },
  "files": ["dist"],
  "peerDependencies": { "vue": "^3.5.0" },
}
```

Consumers choose a granularity:

| Need               | Import                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Everything         | `import { VButton, useForm } from 'violet-ui'` + `import 'violet-ui/style.css'`            |
| Only some packages | `@violet-ui/core`, `@violet-ui/forms`, … + `@violet-ui/theme/theme.css` + each `style.css` |
| Auto import        | `violet-ui/resolver` (`VioletUIResolver`, `VioletUIAutoImports`)                           |
| Template types     | `"types": ["violet-ui/volar"]`                                                             |
| SCSS helpers       | `@use '@violet-ui/theme/scss/mixins.scss'`                                                 |

All packages version together through Changesets so cross-package ranges never drift.
