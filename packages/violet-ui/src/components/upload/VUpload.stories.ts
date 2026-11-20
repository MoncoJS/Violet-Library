import type { Meta, StoryObj } from '@storybook/vue3'
import * as icons from '../../icons'
import * as components from '../index'
import { useToast } from '../../toast'
import { ref } from 'vue'
import VUpload from './VUpload.vue'

const meta = {
  title: 'Upload/Upload',
  component: VUpload,
  tags: ['autodocs'],
  args: {
    label: 'Attachments',
    accept: 'image/*,.pdf',
    maxSize: 5000000,
  },
  render: (args) => ({
    components: { VUpload },
    setup: () => ({
      args,
      value: ref(
        (args as unknown as Record<string, unknown>).modelValue ??
          (args as unknown as Record<string, unknown>).selected ??
          [],
      ),
    }),
    template: '<VUpload v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof VUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

const all = components as unknown as Record<string, object>
void useToast

// ---- more examples
export const Single: Story = { args: { multiple: false, label: 'Contract (PDF)', accept: '.pdf' } }
export const MaxFiles: Story = { args: { maxFiles: 3, hint: 'Up to 3 files' } }
export const WithError: Story = { args: { error: 'At least one file is required' } }
export const Disabled: Story = { args: { disabled: true } }
export const CustomText: Story = {
  args: { title: 'Drop your CSV here', description: 'We will import it into your workspace' },
}
export const WithUploadProgress: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const files = ref([])
      const upload = (file: File, progress: (p: number) => void) =>
        new Promise<void>((res, rej) => {
          let p = 0
          const t = setInterval(() => {
            p += 10
            progress(p)
            if (p >= 100) {
              clearInterval(t)
              if (file.name.includes('fail')) rej(new Error('Server rejected the file'))
              else res()
            }
          }, 150)
        })
      return { icons, files, upload }
    },
    template:
      '<div style="max-width:32rem"><VUpload v-model="files" label="Attachments" :upload="upload" description="Uploads with fake progress — name a file \'fail\' to see an error" /></div>',
  }),
}
export const Prefilled: Story = {
  render: () => ({
    components: all,
    setup: () => {
      const mk = (name: string, size: number, status: string, extra = {}) => ({
        id: name,
        name,
        size,
        status,
        file: new File([''], name),
        ...extra,
      })
      const files = ref([
        mk('report.pdf', 240000, 'done'),
        mk('photo.jpg', 1800000, 'uploading', { progress: 45 }),
        mk('data.csv', 5200, 'error', { error: 'File type not allowed' }),
      ])
      return { icons, files }
    },
    template: '<div style="max-width:32rem"><VUpload v-model="files" label="Files" /></div>',
  }),
}
