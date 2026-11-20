import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { sourceAliases } from '../../tooling/aliases'

export default defineConfig({
  plugins: [vue()],
  // Packages are consumed from source for instant HMR.
  resolve: { alias: sourceAliases },
  css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
  server: { port: 5173 },
})
