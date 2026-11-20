import { defineConfig } from 'vitepress'
import { sourceAliases } from '../../../tooling/aliases'

export default defineConfig({
  title: 'Violet UI',
  description: 'Premium, accessible Vue 3 components for SaaS and enterprise apps.',
  cleanUrls: true,
  lastUpdated: true,
  head: [['meta', { name: 'theme-color', content: '#7c3aed' }]],
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Components', link: '/components/button' },
      { text: 'Composables', link: '/composables/use-form' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Theming', link: '/guide/theming' },
          { text: 'Auto import', link: '/guide/auto-import' },
          { text: 'SSR & Nuxt', link: '/guide/ssr' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'Input', link: '/components/input' },
          { text: 'Form controls', link: '/components/forms' },
          { text: 'Date & time', link: '/components/date' },
          { text: 'Upload', link: '/components/upload' },
          { text: 'Toast', link: '/components/toast' },
          { text: 'Feedback', link: '/components/feedback' },
          { text: 'Overlays', link: '/components/overlays' },
          { text: 'Navigation', link: '/components/navigation' },
          { text: 'Data display', link: '/components/data-display' },
          { text: 'Data table', link: '/components/data-table' },
        ],
      },
      {
        text: 'Composables',
        items: [
          { text: 'useForm', link: '/composables/use-form' },
          { text: 'useField', link: '/composables/use-field' },
          { text: 'Validation rules', link: '/composables/validation' },
          { text: 'useTheme', link: '/composables/use-theme' },
          { text: 'useToast', link: '/composables/use-toast' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/MoncoJS/Violet-Library' }],
    search: { provider: 'local' },
  },
  vite: {
    resolve: { alias: sourceAliases },
    css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
  },
})
