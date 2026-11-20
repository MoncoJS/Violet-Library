# useToast

```ts
const toast = useToast()

toast.success('Saved')
toast.error('Upload failed')
toast.warning('Storage almost full')
toast.info('New version available')

const id = toast.show({ title: 'Syncing', description: 'This may take a minute', duration: 0 })
toast.update(id, { description: 'Done', color: 'success', duration: 3000 })
toast.dismiss(id)
toast.clear()
```

| Option                 | Type                                                        | Default     |
| ---------------------- | ----------------------------------------------------------- | ----------- |
| `title`, `description` | `string`                                                    | —           |
| `color`                | `'neutral' \| 'success' \| 'info' \| 'warning' \| 'danger'` | `'neutral'` |
| `duration`             | `number` (ms, `0` = persistent)                             | `5000`      |
| `closable`             | `boolean`                                                   | `true`      |
| `action`               | `{ label, onClick(toast) }`                                 | —           |
| `onClose`              | `() => void`                                                | —           |

Store options (`max`, `duration`, `position`) are set via `createVioletUI({ toast })`. Render with [`VToaster`](../components/toast).
