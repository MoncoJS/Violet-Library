import type { Decorator, Preview } from '@storybook/vue3'
import { setup } from '@storybook/vue3'
import { THEME_ATTRIBUTE, renderThemeCss } from '@violet-ui/theme'
import { createVioletUI } from 'violet-ui'
import './preview.css'

// Same CSS that ships as `@violet-ui/theme/theme.css`, generated from tokens.
const style = document.createElement('style')
style.id = 'violet-ui-theme'
style.textContent = renderThemeCss()
document.head.appendChild(style)

setup((app) => {
  app.use(createVioletUI({ theme: { storageKey: false, defaultTheme: 'light' } }))
})

const withTheme: Decorator = (story, context) => {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, context.globals.theme ?? 'light')
  return story()
}

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Violet UI theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    layout: 'padded',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    a11y: { test: 'error' },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Actions',
          'Forms',
          'Date',
          'Upload',
          'Feedback',
          'Overlay',
          'Navigation',
          'Data Display',
          'Data',
          'Overview',
        ],
      },
    },
  },
}

export default preview
