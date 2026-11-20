import type { StorybookConfig } from '@storybook/vue3-vite'
import vue from '@vitejs/plugin-vue'
import { mergeConfig } from 'vite'
import { sourceAliases } from '../tooling/aliases'

const config: StorybookConfig = {
  stories: ['./*.mdx', '../packages/*/src/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@storybook/addon-interactions'],
  framework: { name: '@storybook/vue3-vite', options: {} },
  core: { disableTelemetry: true },
  docs: { defaultName: 'Docs' },
  // There is no root vite.config, so register the Vue plugin here, and
  // consume packages from source so stories hot-reload without a build.
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [vue()],
      resolve: { alias: sourceAliases },
      css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
    }),
}

export default config
