# Violet UI

Accessible **Vue 3** components for SaaS dashboards and enterprise apps: 50 components, typed end to end, themeable with design tokens, tree-shakeable and SSR-friendly.

**[Documentation](https://moncojs.github.io/Violet-Library/)** · **[Storybook](https://moncojs.github.io/Violet-Library/storybook/)** · **[GitHub](https://github.com/MoncoJS/Violet-Library)**

## Install

```sh
npm install violet-ui
# or: bun add violet-ui / pnpm add violet-ui
```

Vue `^3.5` is a peer dependency.

## Use

```ts
// main.ts
import { createApp } from 'vue'
import { createVioletUI } from 'violet-ui'
import 'violet-ui/style.css'
import App from './App.vue'

createApp(App)
  .use(createVioletUI({ theme: { defaultTheme: 'system' } }))
  .mount('#app')
```

```vue
<script setup lang="ts">
import { VButton, VDataTable, VInput, email, required, useForm } from 'violet-ui'

const form = useForm({
  initialValues: { email: '' },
  rules: { email: [required(), email()] },
  onSubmit: (values) => api.invite(values),
})
</script>

<template>
  <form novalidate @submit="form.handleSubmit()($event)">
    <VInput label="Email" v-bind="form.register('email')" />
    <VButton type="submit" :loading="form.isSubmitting.value">Invite</VButton>
  </form>
</template>
```

## Components

- **Actions:** VButton, VIconButton, VButtonGroup
- **Forms:** VInput, VTextarea, VPasswordInput, VNumberInput, VSelect, VMultiSelect, VAutocomplete, VCheckbox, VCheckboxGroup, VRadio, VRadioGroup, VSwitch
- **Date & upload:** VDatePicker, VDateRangePicker, VTimePicker, VCalendar, VUpload, VImageUpload
- **Feedback:** VToast, VAlert, VSnackbar, VProgress, VSkeleton, VLoadingOverlay
- **Overlays:** VModal, VDialog, VDrawer, VTooltip, VPopover
- **Navigation:** VTabs, VPagination, VMenu, VDropdown, VBreadcrumb
- **Data display:** VAvatar, VBadge, VChip, VTag, VCard, VList, VAccordion, VTimeline, VEmptyState
- **Data:** VDataTable (sorting, search, pagination, selection, column visibility, CSV export, responsive)
- **Composables:** useForm, useField, useValidation, useToast, useTheme

## Auto import

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { VioletUIResolver } from 'violet-ui/resolver'

export default { plugins: [vue(), Components({ resolvers: [VioletUIResolver()] })] }
```

## License

MIT
