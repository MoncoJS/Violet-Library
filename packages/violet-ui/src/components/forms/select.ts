import { defineComponent, h } from 'vue'
import VSelectBase from './VSelectBase.vue'

/** Builds a named preset of VSelectBase that keeps its full prop typing. */
function preset(name: string, fixed: Record<string, unknown>) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots, expose }) {
      const inner = { value: null as null | InstanceType<typeof VSelectBase> }
      expose({
        open: () => inner.value?.open(),
        close: () => inner.value?.close(),
        focus: () => inner.value?.focus(),
      })
      return () =>
        h(
          VSelectBase,
          {
            ...attrs,
            ...fixed,
            ref: (el: unknown) => (inner.value = el as InstanceType<typeof VSelectBase>),
          },
          slots,
        )
    },
  }) as unknown as typeof VSelectBase
}

/** Single-value dropdown. */
export const VSelect = preset('VSelect', { multiple: false, searchable: false })
/** Multiple values shown as removable chips. Add `searchable` to filter. */
export const VMultiSelect = preset('VMultiSelect', { multiple: true })
/** Text input with filtered suggestions; supports `multiple`, `allow-custom` and server `@search`. */
export const VAutocomplete = preset('VAutocomplete', { searchable: true })
