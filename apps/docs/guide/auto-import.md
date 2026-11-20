# Auto import

Use [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) and [`unplugin-auto-import`](https://github.com/unplugin/unplugin-auto-import) with the bundled resolver. Only components you actually use are imported.

```ts
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VioletUIAutoImports, VioletUIResolver } from 'violet-ui/resolver'

export default {
  plugins: [
    vue(),
    Components({ resolvers: [VioletUIResolver()] }),
    AutoImport({ imports: ['vue', VioletUIAutoImports] }),
  ],
}
```

## Template type checking

When components are registered globally or auto-imported, add the global component types:

```json
// tsconfig.json
{ "compilerOptions": { "types": ["violet-ui/volar"] } }
```
