# useForm

```ts
import { useForm, required, email, min, confirmed } from 'violet-ui'

const form = useForm({
  initialValues: { email: '', password: '', confirm: '' },
  labels: { email: 'Email', password: 'Password' },
  rules: {
    email: [required(), email()],
    password: [required(), min(8)],
    confirm: [confirmed('password', 'Passwords do not match')],
  },
  validateOn: ['blur', 'submit'], // default
  async onSubmit(values, { setErrors, reset }) {
    const res = await api.signUp(values)
    if (res.fieldErrors) return setErrors(res.fieldErrors)
    reset()
  },
})
```

```vue
<form novalidate @submit="form.handleSubmit()($event)">
  <VInput label="Email" v-bind="form.register('email')" />
  <VButton type="submit" :loading="form.isSubmitting.value">Sign up</VButton>
</form>
```

## Behaviour

- Errors appear on blur (or input, if `validateOn` includes it) and on submit.
- A field already showing an error re-validates on every change, so errors clear immediately.
- Fields depending on others (e.g. `confirmed`) re-validate when their target changes.
- Out-of-order async results are discarded — only the latest validation run wins.
- `handleSubmit` prevents default, ignores double submits, touches every field, validates, and passes a **deep copy** of values to the handler.

## Return value

| Member                                                                   | Description                                    |
| ------------------------------------------------------------------------ | ---------------------------------------------- |
| `values`                                                                 | Reactive values                                |
| `errors`                                                                 | `ComputedRef` — first message per field        |
| `allErrors`, `touched`                                                   | Readonly per-field state                       |
| `isDirty`, `isValid`, `isValidating`                                     | `ComputedRef<boolean>`                         |
| `isSubmitting`, `submitCount`                                            | Readonly refs                                  |
| `register(name)`                                                         | Props for any Violet input                     |
| `handleSubmit(onValid?, onInvalid?)`                                     | Returns a submit listener                      |
| `validate()`, `validateField(name)`                                      | Returns `Promise<boolean>`                     |
| `setFieldValue`, `setValues`, `setFieldError`, `setErrors`, `setTouched` | Imperative updates                             |
| `reset(values?)`                                                         | Restore initial values (or set a new baseline) |
