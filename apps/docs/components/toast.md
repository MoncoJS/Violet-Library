# Toast

Mount `VToaster` once near your app root, then call `useToast()` anywhere.

```vue
<!-- App.vue -->
<template>
  <RouterView />
  <VToaster />
</template>
```

```ts
const toast = useToast()
toast.success('Changes saved')
toast.show({ title: 'File deleted', color: 'warning', action: { label: 'Undo', onClick: restore } })
await toast.promise(save(), { loading: 'Saving…', success: 'Saved', error: 'Could not save' })
```

Toasts pause while hovered or focused. Errors use `role="alert"`; others use `role="status"`.
