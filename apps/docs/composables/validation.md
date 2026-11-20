# Validation rules

| Rule                         | Passes when                                              | Empty values |
| ---------------------------- | -------------------------------------------------------- | ------------ |
| `required(message?)`         | not `null`, `undefined`, `''`, whitespace, `[]`, `false` | fail         |
| `email(message?)`            | valid email address                                      | pass         |
| `min(n, message?)`           | string length / number / array length ≥ `n`              | pass         |
| `max(n, message?)`           | string length / number / array length ≤ `n`              | pass         |
| `regex(pattern, message?)`   | `pattern.test(String(value))`                            | pass         |
| `confirmed(field, message?)` | equals `values[field]`                                   | —            |

Messages may be strings or functions receiving `{ label, ...params }`:

```ts
min(8, ({ label, min }) => `${label} needs ${min}+ characters`)
```

## Custom and async rules

A rule is `(value, { field, values, label }) => true | string | Promise<true | string>`.

```ts
const uniqueUsername: ValidationRule<string> = async (value) =>
  (await api.isAvailable(value)) || 'Username is taken'
```

Rules run in order and stop at the first failure, so cheap sync checks guard expensive async ones.

## useValidation

Low-level validation of any ref:

```ts
const { error, validate } = useValidation(email, [required(), emailRule()], { watchValue: true })
```
