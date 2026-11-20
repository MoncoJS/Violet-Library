<script setup lang="ts">
import {
  IconLock,
  IconMail,
  VButton,
  VInput,
  email,
  min,
  required,
  useForm,
  useToast,
} from 'violet-ui'

const emit = defineEmits<{ success: [user: { email: string }] }>()
const toast = useToast()

async function login(credentials: { email: string; password: string }) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  return { ok: res.ok, body: await res.json() }
}

const form = useForm({
  initialValues: { email: '', password: '' },
  labels: { email: 'Email', password: 'Password' },
  rules: {
    email: [required(), email()],
    password: [required(), min(8)],
  },
  async onSubmit(values, { setErrors }) {
    const { ok, body } = await login(values)
    if (!ok) {
      // Map server validation errors back onto fields.
      setErrors(body.errors ?? { password: 'Invalid email or password' })
      return
    }
    toast.success('Welcome back!')
    emit('success', body.user)
  },
})
</script>

<template>
  <form class="login" novalidate @submit="form.handleSubmit()($event)">
    <VInput
      label="Email"
      type="email"
      autocomplete="username"
      required
      :prepend-icon="IconMail"
      v-bind="form.register('email')"
    />
    <VInput
      label="Password"
      type="password"
      autocomplete="current-password"
      required
      :prepend-icon="IconLock"
      v-bind="form.register('password')"
    />
    <VButton type="submit" block :loading="form.isSubmitting.value">Sign in</VButton>
  </form>
</template>

<style scoped>
.login {
  display: grid;
  gap: var(--v-space-4);
  max-width: 24rem;
}
</style>
