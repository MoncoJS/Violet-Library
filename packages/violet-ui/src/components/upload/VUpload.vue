<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import { IconClose, IconFile, IconUpload } from '../../icons'
import VFormField from '../forms/VFormField.vue'

export interface UploadItem {
  id: string
  file: File
  name: string
  size: number
  /** 0–100 while uploading. */
  progress?: number
  status: 'ready' | 'uploading' | 'done' | 'error'
  error?: string
}

export interface UploadProps {
  modelValue?: UploadItem[]
  id?: string
  name?: string
  label?: string
  hint?: string
  error?: string | boolean
  /** Same syntax as the native `accept` attribute. */
  accept?: string
  multiple?: boolean
  /** Bytes. */
  maxSize?: number
  maxFiles?: number
  disabled?: boolean
  required?: boolean
  /**
   * Upload function. Receives the file and a progress callback; resolve to mark
   * done, reject (Error message) to mark failed. Omit to only collect files.
   */
  upload?: (file: File, onProgress: (percent: number) => void) => Promise<unknown>
  title?: string
  description?: string
}

defineOptions({ name: 'VUpload' })
const props = withDefaults(defineProps<UploadProps>(), {
  modelValue: () => [],
  multiple: true,
  title: 'Click to upload or drag and drop',
})
const emit = defineEmits<{
  'update:modelValue': [items: UploadItem[]]
  reject: [rejections: { file: File; reason: string }[]]
  remove: [item: UploadItem]
}>()

const uid = useId()
const input = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
let dragDepth = 0
let seq = 0

const formatSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i ? 1 : 0)} ${units[i]}`
}
defineExpose({ open: () => input.value?.click(), formatSize })

function accepts(file: File) {
  if (!props.accept) return true
  return props.accept.split(',').some((rule) => {
    const r = rule.trim().toLowerCase()
    if (r.startsWith('.')) return file.name.toLowerCase().endsWith(r)
    if (r.endsWith('/*')) return file.type.startsWith(r.slice(0, -1))
    return file.type === r
  })
}

// Local mirror so rapid progress updates don't race the parent's re-render.
let items: UploadItem[] = props.modelValue
watch(
  () => props.modelValue,
  (v) => (items = v),
)
const emitItems = (next: UploadItem[]) => {
  items = next
  emit('update:modelValue', next)
}
function patch(id: string, p: Partial<UploadItem>) {
  emitItems(items.map((it) => (it.id === id ? { ...it, ...p } : it)))
}

function addFiles(list: FileList | File[]) {
  if (props.disabled) return
  const rejected: { file: File; reason: string }[] = []
  const accepted: UploadItem[] = []
  for (const file of Array.from(list)) {
    if (!accepts(file)) rejected.push({ file, reason: 'File type not allowed' })
    else if (props.maxSize && file.size > props.maxSize)
      rejected.push({ file, reason: `Larger than ${formatSize(props.maxSize)}` })
    else if (props.maxFiles && items.length + accepted.length >= props.maxFiles)
      rejected.push({ file, reason: `Maximum ${props.maxFiles} files` })
    else
      accepted.push({
        id: `${uid}-${++seq}`,
        file,
        name: file.name,
        size: file.size,
        status: props.upload ? 'uploading' : 'ready',
        progress: 0,
      })
    if (!props.multiple) break
  }
  if (rejected.length) emit('reject', rejected)
  if (!accepted.length) return
  emitItems(props.multiple ? [...items, ...accepted] : accepted)
  for (const it of accepted) void run(it)
}

async function run(it: UploadItem) {
  if (!props.upload) return
  patch(it.id, { status: 'uploading', progress: 0, error: undefined })
  try {
    await props.upload(it.file, (p) => patch(it.id, { progress: Math.round(p) }))
    patch(it.id, { status: 'done', progress: 100 })
  } catch (e) {
    patch(it.id, { status: 'error', error: e instanceof Error ? e.message : 'Upload failed' })
  }
}

function remove(it: UploadItem) {
  emitItems(items.filter((x) => x.id !== it.id))
  emit('remove', it)
}

function onDrop(e: DragEvent) {
  dragDepth = 0
  dragging.value = false
  if (e.dataTransfer?.files.length) addFiles(e.dataTransfer.files)
}
function onDragEnter() {
  dragDepth++
  if (!props.disabled) dragging.value = true
}
function onDragLeave() {
  if (--dragDepth <= 0) dragging.value = false
}
function onChange(e: Event) {
  const el = e.target as HTMLInputElement
  if (el.files) addFiles(el.files)
  el.value = ''
}
const acceptHint = computed(
  () =>
    props.description ??
    [props.accept, props.maxSize && `up to ${formatSize(props.maxSize)}`]
      .filter(Boolean)
      .join(' · '),
)
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
    <div class="v-upload">
      <label
        :for="fid"
        :class="[
          'v-upload__zone',
          { 'is-dragging': dragging, 'is-invalid': invalid, 'is-disabled': disabled },
        ]"
        @dragenter.prevent="onDragEnter"
        @dragover.prevent
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
      >
        <input
          :id="fid"
          ref="input"
          class="v-upload__input"
          type="file"
          :name="name"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          :aria-describedby="describedBy"
          @change="onChange"
        />
        <slot name="zone" :dragging="dragging">
          <span class="v-upload__icon" aria-hidden="true"><IconUpload /></span>
          <span class="v-upload__title">{{ title }}</span>
          <span v-if="acceptHint" class="v-upload__desc">{{ acceptHint }}</span>
        </slot>
      </label>
      <ul v-if="modelValue.length" class="v-upload__list" aria-live="polite">
        <li v-for="it in modelValue" :key="it.id" :class="['v-upload__item', `is-${it.status}`]">
          <span class="v-upload__file-icon" aria-hidden="true"><IconFile /></span>
          <div class="v-upload__meta">
            <span class="v-upload__name">{{ it.name }}</span>
            <span class="v-upload__info">
              <template v-if="it.status === 'error'">{{ it.error }}</template>
              <template v-else-if="it.status === 'uploading'"
                >{{ it.progress ?? 0 }}% · {{ formatSize(it.size) }}</template
              >
              <template v-else>{{ formatSize(it.size) }}</template>
            </span>
            <div
              v-if="it.status === 'uploading'"
              class="v-upload__bar"
              role="progressbar"
              :aria-valuenow="it.progress ?? 0"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-label="`Uploading ${it.name}`"
            >
              <span :style="{ width: `${it.progress ?? 0}%` }" />
            </div>
          </div>
          <button
            v-if="it.status === 'error' && upload"
            type="button"
            class="v-upload__retry"
            @click="run(it)"
          >
            Retry
          </button>
          <button
            type="button"
            class="v-upload__remove"
            :aria-label="`Remove ${it.name}`"
            @click="remove(it)"
          >
            <IconClose />
          </button>
        </li>
      </ul>
    </div>
  </VFormField>
</template>
