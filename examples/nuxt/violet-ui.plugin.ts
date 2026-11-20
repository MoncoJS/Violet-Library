// plugins/violet-ui.ts (Nuxt 3)
import { createVioletUI, getThemeInitScript } from 'violet-ui'
import 'violet-ui/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  const violet = createVioletUI({
    theme: { themes: { ocean: { colors: { primary: '#0369a1' } } } },
  })
  nuxtApp.vueApp.use(violet)

  useHead({
    // Apply a saved preference before paint (prevents theme flash).
    script: [{ innerHTML: getThemeInitScript(), tagPosition: 'head' }],
    // Custom (non built-in) themes are rendered on the server.
    style: [{ innerHTML: violet.theme.renderStyles(), key: 'violet-ui-themes' }],
  })
})
