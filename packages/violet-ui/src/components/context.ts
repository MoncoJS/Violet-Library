import type { Component, InjectionKey } from 'vue'
import type { ColorRole, ComponentSize } from '../theme'

export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link'

export interface ButtonGroupContext {
  variant?: ButtonVariant
  color?: ColorRole
  size?: ComponentSize
  disabled?: boolean
}

export const BUTTON_GROUP_KEY: InjectionKey<ButtonGroupContext> = Symbol('violet-ui:button-group')

export interface ButtonProps {
  as?: string | Component
  type?: 'button' | 'submit' | 'reset'
  href?: string
  variant?: ButtonVariant
  color?: ColorRole
  size?: ComponentSize
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  block?: boolean
  pill?: boolean
  iconOnly?: boolean
  prependIcon?: Component
  appendIcon?: Component
}
