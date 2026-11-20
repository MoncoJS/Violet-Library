<script setup>
import { ref } from 'vue'
const files = ref([])
const avatar = ref(null)
function upload(file, progress) {
  return new Promise((resolve) => {
    let p = 0
    const t = setInterval(() => {
      p += 25
      progress(p)
      if (p >= 100) {
        clearInterval(t)
        resolve()
      }
    }, 200)
  })
}
</script>

# Upload

<div class="demo demo--grid">
  <VUpload v-model="files" label="Attachments" accept="image/*,.pdf" :max-size="5000000" :upload="upload" />
  <VImageUpload v-model="avatar" label="Avatar" shape="circle" />
</div>

```vue
<VUpload
  v-model="files"
  accept="image/*,.pdf"
  :max-size="5_000_000"
  :max-files="10"
  :upload="(file, onProgress) => api.upload(file, { onProgress })"
  @reject="(list) => toast.error(list[0].reason)"
/>
```

`v-model` is an array of `{ id, file, name, size, status: 'ready' | 'uploading' | 'done' | 'error', progress, error }`. Pass `upload` to upload immediately with progress and retry; omit it to collect files for a normal form submit.

`VImageUpload` takes a `File` or an existing image URL, previews it, and supports `shape="square | circle | wide"` and `size`.
