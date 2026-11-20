import { createApp } from 'vue'
import { createTheme, createVioletUI, darkTheme } from 'violet-ui'
import 'violet-ui/style.css'
import App from './App.vue'

// Derive full role scales (hover/active/soft/contrast) from brand colors.
const acmeLight = createTheme({
  colors: {
    primary: '#e11d48',
    secondary: '#0f172a',
    surfaceSunken: '#fff7f8',
  },
  shadows: { md: '0 6px 16px -4px rgb(225 29 72 / 0.18)' },
})

const acmeDark = createTheme({ colors: { primary: '#fb7185' } }, darkTheme)

createApp(App)
  .use(
    createVioletUI({
      theme: {
        defaultTheme: 'system',
        // Replacing the built-in names keeps `toggle()` and `'system'` working.
        themes: { light: acmeLight, dark: acmeDark },
      },
    }),
  )
  .mount('#app')
