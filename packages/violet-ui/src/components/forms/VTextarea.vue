<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import VFormField from './VFormField.vue'

export interface TextareaProps {
  modelValue?: string | null
  id?: string
  name?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string | boolean
  rows?: number
  /** Grow with content up to `maxRows`. */
  autoResize?: boolean
  maxRows?: number
  maxlength?: number
  showCount?: boolean
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  resize?: 'none' | 'vertical' | 'both'
}

defineOptions({ name: 'VTextarea', inheritAttrs: false })
const props = withDefaults(defineProps<TextareaProps>(), { rows: 3, resize: 'vertical' })
const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [e: FocusEvent]
  focus: [e: FocusEvent]
}>()

const el = ref<HTMLTextAreaElement | null>(null)

function fit() {
  const t = el.value
  if (!t || !props.autoResize) return
  t.style.height = 'auto'
  const line = Number.parseFloat(getComputedStyle(t).lineHeight) || 20
  const max = props.maxRows ? line * props.maxRows + 16 : Infinity
  t.style.height = `${Math.min(t.scrollHeight + 2, max)}px`
  t.style.overflowY = t.scrollHeight > max ? 'auto' : 'hidden'
}
onMounted(fit)
watch(
  () => props.modelValue,
  () => nextTick(fit),
)

defineExpose({ focus: () => el.value?.focus(), textarea: el })
</script>

<template>
  <VFormField
    :id="id"
    v-slot="{ id: fid, describedBy, invalid }"
    :label="label"
    :hint="hint"
    :error="error"
    :required="required"
    :disabled="disabled"
    :class="$attrs.class"
  >
    <div :class="['v-textarea', { 'is-invalid': invalid, 'is-disabled': disabled }]">
      <textarea
        :id="fid"
        ref="el"
        v-bind="{ ...$attrs, class: undefined }"
        class="v-textarea__field"
        :style="{ resize: autoResize ? 'none' : resize }"
        :name="name"
        :rows="rows"
        :value="modelValue ?? ''"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="invalid ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
      <span v-if="showCount" class="v-textarea__count">
        {{ (modelValue ?? '').length }}<template v-if="maxlength"> / {{ maxlength }}</template>
      </span>
    </div>
  </VFormField>
</template>
