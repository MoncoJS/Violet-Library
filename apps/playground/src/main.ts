import { createApp } from 'vue'
import { createVioletUI, renderThemeCss } from 'violet-ui'
import App from './App.vue'
import './playground.css'

// In a published app use `import 'violet-ui/style.css'`; the playground runs
// from source, so the token stylesheet is generated on the fly.
const style = document.createElement('style')
style.textContent = renderThemeCss()
document.head.prepend(style)

createApp(App)
  .use(
    createVioletUI({
      theme: {
        defaultTheme: 'system',
        themes: { ocean: { colors: { primary: '#0369a1' } } },
      },
      toast: { position: 'bottom-right' },
    }),
  )
  .mount('#app')
