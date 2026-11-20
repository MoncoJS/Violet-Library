import type { ComputedRef, InjectionKey } from 'vue'
import type { ColorRole } from '../../theme'

export interface CheckboxGroupContext {
  isChecked: (value: unknown) => boolean
  toggle: (value: unknown, on: boolean) => void
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  name: ComputedRef<string | undefined>
}
export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupContext> = Symbol(
  'violet-ui:checkbox-group',
)

export interface RadioGroupContext {
  value: ComputedRef<unknown>
  select: (value: unknown) => void
  disabled: ComputedRef<boolean>
  invalid: ComputedRef<boolean>
  name: ComputedRef<string>
  color: ComputedRef<ColorRole>
  required: ComputedRef<boolean>
}
export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol('violet-ui:radio-group')
