<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { IconClose, IconImage } from '../../icons'
import VFormField from '../forms/VFormField.vue'

export interface ImageUploadProps {
  /** Selected file, or a URL string for an existing image. */
  modelValue?: File | string | null
  id?: string
  name?: string
  label?: string
  hint?: string
  error?: string | boolean
  accept?: string
  /** Bytes. */
  maxSize?: number
  shape?: 'square' | 'circle' | 'wide'
  /** CSS size of the preview box. */
  size?: string
  disabled?: boolean
  required?: boolean
  alt?: string
}

defineOptions({ name: 'VImageUpload' })
const props = withDefaults(defineProps<ImageUploadProps>(), {
  modelValue: null,
  accept: 'image/*',
  shape: 'square',
  size: '8rem',
  alt: 'Selected image',
})
const emit = defineEmits<{ 'update:modelValue': [value: File | null]; reject: [reason: string] }>()
const preview = ref<string | null>(null)
const dragging = ref(false)
let objectUrl: string | null = null

const revoke = () => {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = null
}
watch(
  () => props.modelValue,
  (v) => {
    revoke()
    if (!v) preview.value = null
    else if (typeof v === 'string') preview.value = v
    else if (typeof URL !== 'undefined') preview.value = objectUrl = URL.createObjectURL(v)
  },
  { immediate: true },
)
onBeforeUnmount(revoke)

function take(file?: File | null) {
  if (!file || props.disabled) return
  if (!file.type.startsWith('image/')) return emit('reject', 'Please choose an image file')
  if (props.maxSize && file.size > props.maxSize) return emit('reject', 'Image is too large')
  emit('update:modelValue', file)
}
function onChange(e: Event) {
  const el = e.target as HTMLInputElement
  take(el.files?.[0])
  el.value = ''
}
function onDrop(e: DragEvent) {
  dragging.value = false
  take(e.dataTransfer?.files[0])
}
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
  >
    <div class="v-image-upload">
      <label
        :for="fid"
        :class="[
          'v-image-upload__box',
          `v-image-upload__box--${shape}`,
          {
            'is-dragging': dragging,
            'is-invalid': invalid,
            'is-disabled': disabled,
            'has-image': !!preview,
          },
        ]"
        :style="{ '--_size': size }"
        @dragover.prevent="dragging = !disabled"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <input
          :id="fid"
          class="v-upload__input"
          type="file"
          :name="name"
          :accept="accept"
          :disabled="disabled"
          :aria-describedby="describedBy"
          @change="onChange"
        />
        <img v-if="preview" :src="preview" :alt="alt" class="v-image-upload__img" />
        <span v-else class="v-image-upload__empty">
          <IconImage aria-hidden="true" />
          <span>Upload image</span>
        </span>
        <span v-if="preview && !disabled" class="v-image-upload__overlay" aria-hidden="true"
          >Change</span
        >
      </label>
      <button
        v-if="preview && !disabled"
        type="button"
        class="v-image-upload__remove"
        aria-label="Remove image"
        @click="emit('update:modelValue', null)"
      >
        <IconClose />
      </button>
    </div>
  </VFormField>
</template>
