import type { Theme } from 'vitepress'
import type { Component } from 'vue'
import DefaultTheme from 'vitepress/theme'
import * as Violet from 'violet-ui'
import { createVioletUI, renderThemeCss } from 'violet-ui'
import './custom.css'

// Token stylesheet (identical to the published `@violet-ui/theme/theme.css`).
// VitePress drives light/dark via `.dark`, so map it onto Violet UI themes.
const themeCss = renderThemeCss({ systemDarkTheme: false }).replace(
  '[data-v-theme="dark"]',
  '[data-v-theme="dark"], html.dark',
)

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = themeCss
      document.head.appendChild(style)
    }
    app.use(
      createVioletUI({
        theme: { storageKey: false },
        // register every component globally so markdown demos can use them
        components: Object.fromEntries(
          Object.entries(Violet).filter(([name]) => /^V[A-Z]/.test(name)),
        ) as Record<string, Component>,
      }),
    )
  },
} satisfies Theme
