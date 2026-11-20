import { fileURLToPath } from 'node:url'

const pkg = (p: string) => fileURLToPath(new URL(`../packages/violet-ui/src/${p}`, import.meta.url))

/** Resolve `violet-ui` to source so apps get instant HMR without a build. */
export const sourceAliases = [
  { find: /^violet-ui\/resolver$/, replacement: pkg('resolver.ts') },
  { find: /^violet-ui\/style\.css$/, replacement: pkg('style.css') },
  { find: /^violet-ui$/, replacement: pkg('index.ts') },
  // Former split packages (`@violet-ui/theme`, `@violet-ui/core`, …) now live in `violet-ui`.
  { find: /^@violet-ui\/[a-z-]+$/, replacement: pkg('index.ts') },
]
