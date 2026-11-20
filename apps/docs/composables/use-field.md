# useField

Build custom inputs that plug into `useForm` automatically, or manage a single field standalone.

```ts
// MyColorPicker.vue
const props = defineProps<{ name: string }>()
const { value, error, handleBlur } = useField<string>(props.name, {
  rules: [required()],
  label: 'Brand color',
})
```

Inside a component tree that called `useForm`, the field reads and writes the form's state and its rules are **merged** with the form-level rules. Outside a form, it keeps its own state (`initialValue`, `validateOn`).

`field.bindings` is a computed object you can spread onto any Violet input: `<VInput v-bind="field.bindings.value" />`.
