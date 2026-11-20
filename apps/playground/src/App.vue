<script setup lang="ts">
import {
  IconDownload,
  IconLock,
  IconMail,
  IconMoon,
  IconPlus,
  IconSearch,
  IconSun,
  IconTrash,
  VButton,
  VButtonGroup,
  VIconButton,
  VInput,
  VToaster,
  confirmed,
  email,
  min,
  required,
  useForm,
  useTheme,
  useToast,
} from 'violet-ui'
import { ref } from 'vue'
import Showcase from './Showcase.vue'

const theme = useTheme()
const toast = useToast()
const search = ref('')

const form = useForm({
  initialValues: { name: '', email: '', password: '', confirm: '' },
  labels: { name: 'Name', email: 'Email', password: 'Password', confirm: 'Confirmation' },
  rules: {
    name: [required()],
    email: [required(), email()],
    password: [required(), min(8)],
    confirm: [required(), confirmed('password', 'Passwords do not match')],
  },
  async onSubmit(values, { setErrors, reset }) {
    await new Promise((r) => setTimeout(r, 900))
    if (values.email.endsWith('@taken.com')) {
      setErrors({ email: 'This email is already registered' })
      return
    }
    toast.success(`Welcome aboard, ${values.name}!`, { title: 'Account created' })
    reset()
  },
  onInvalid: () => toast.error('Please fix the highlighted fields.'),
})

function simulateExport() {
  void toast.promise(new Promise((r) => setTimeout(r, 1500)), {
    loading: 'Exporting report…',
    success: 'Report exported',
    error: 'Export failed',
  })
}
</script>

<template>
  <header class="pg-header">
    <div class="pg-brand"><span class="pg-logo" aria-hidden="true" />Violet UI</div>
    <div class="pg-row">
      <VInput
        v-model="search"
        size="sm"
        type="search"
        placeholder="Search…"
        aria-label="Search"
        :prepend-icon="IconSearch"
        clearable
      />
      <VButtonGroup size="sm" variant="outline" color="neutral" label="Theme">
        <VButton
          v-for="name in theme.themes.value"
          :key="name"
          :variant="theme.name.value === name ? 'soft' : 'outline'"
          :color="theme.name.value === name ? 'primary' : 'neutral'"
          :aria-pressed="theme.name.value === name"
          @click="theme.setTheme(name)"
        >
          {{ name }}
        </VButton>
      </VButtonGroup>
      <VIconButton
        :icon="theme.isDark.value ? IconSun : IconMoon"
        :label="theme.isDark.value ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="theme.toggle()"
      />
    </div>
  </header>

  <main class="pg-main">
    <section class="pg-card" aria-labelledby="buttons-title">
      <h2 id="buttons-title">Buttons</h2>
      <p>Variants, colors, sizes, icons and loading states.</p>
      <div class="pg-row">
        <VButton :prepend-icon="IconPlus">New project</VButton>
        <VButton variant="soft">Soft</VButton>
        <VButton
          variant="outline"
          color="neutral"
          :append-icon="IconDownload"
          @click="simulateExport"
        >
          Export
        </VButton>
        <VButton variant="ghost" color="neutral">Ghost</VButton>
        <VButton variant="link">Link</VButton>
      </div>
      <div class="pg-row">
        <VButton color="success" size="sm">Approve</VButton>
        <VButton color="warning" size="sm">Review</VButton>
        <VButton color="danger" size="sm" variant="soft" :prepend-icon="IconTrash">Delete</VButton>
        <VButton loading size="sm">Saving</VButton>
        <VButton disabled size="sm">Disabled</VButton>
      </div>
      <VButtonGroup variant="outline" color="neutral" label="Range">
        <VButton>Day</VButton>
        <VButton>Week</VButton>
        <VButton>Month</VButton>
      </VButtonGroup>
    </section>

    <section class="pg-card" aria-labelledby="signup-title">
      <h2 id="signup-title">Create account</h2>
      <p>useForm + VInput with sync validation and server errors (try “@taken.com”).</p>
      <form novalidate style="display: grid; gap: 1rem" @submit="form.handleSubmit()($event)">
        <VInput label="Name" autocomplete="name" required v-bind="form.register('name')" />
        <VInput
          label="Email"
          type="email"
          autocomplete="email"
          required
          :prepend-icon="IconMail"
          v-bind="form.register('email')"
        />
        <VInput
          label="Password"
          type="password"
          autocomplete="new-password"
          hint="At least 8 characters"
          required
          :prepend-icon="IconLock"
          v-bind="form.register('password')"
        />
        <VInput
          label="Confirm password"
          type="password"
          autocomplete="new-password"
          required
          v-bind="form.register('confirm')"
        />
        <div class="pg-row">
          <VButton type="submit" :loading="form.isSubmitting.value">Create account</VButton>
          <VButton
            variant="ghost"
            color="neutral"
            :disabled="!form.isDirty.value"
            @click="form.reset()"
          >
            Reset
          </VButton>
        </div>
      </form>
    </section>

    <section class="pg-card" aria-labelledby="state-title">
      <h2 id="state-title">Form state</h2>
      <pre class="pg-code">{{
        JSON.stringify(
          {
            values: form.values,
            errors: form.errors.value,
            dirty: form.isDirty.value,
            submitCount: form.submitCount.value,
          },
          null,
          2,
        )
      }}</pre>
      <div class="pg-row">
        <VButton
          size="sm"
          variant="soft"
          color="info"
          @click="toast.info('Heads up: maintenance at 2am UTC')"
        >
          Info toast
        </VButton>
        <VButton
          size="sm"
          variant="soft"
          color="warning"
          @click="
            toast.show({
              title: 'File moved to trash',
              color: 'warning',
              action: { label: 'Undo', onClick: (t) => toast.dismiss(t.id) },
            })
          "
        >
          Toast with action
        </VButton>
      </div>
    </section>
  </main>

  <Showcase />

  <VToaster />
</template>
