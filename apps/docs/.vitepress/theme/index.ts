import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import {
  VButton,
  VButtonGroup,
  VIconButton,
  VInput,
  VToaster,
  createVioletUI,
  renderThemeCss,
} from 'violet-ui'
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
        components: { VButton, VButtonGroup, VIconButton, VInput, VToaster },
      }),
    )
  },
} satisfies Theme
