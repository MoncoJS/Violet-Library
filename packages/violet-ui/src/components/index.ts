import type { App, Component, Plugin } from 'vue'
import _VButton from './VButton.vue'
import _VButtonGroup from './VButtonGroup.vue'
import _VIconButton from './VIconButton.vue'
import _VInput from './VInput.vue'
import _VSpinner from './VSpinner.vue'
import _VToast from './VToast.vue'
import _VToaster from './VToaster.vue'
import _VCheckbox from './forms/VCheckbox.vue'
import _VCheckboxGroup from './forms/VCheckboxGroup.vue'
import _VFormField from './forms/VFormField.vue'
import _VNumberInput from './forms/VNumberInput.vue'
import _VPasswordInput from './forms/VPasswordInput.vue'
import _VRadio from './forms/VRadio.vue'
import _VRadioGroup from './forms/VRadioGroup.vue'
import _VSwitch from './forms/VSwitch.vue'
import _VTextarea from './forms/VTextarea.vue'
import _VCalendar from './date/VCalendar.vue'
import _VDatePicker from './date/VDatePicker.vue'
import _VDateRangePicker from './date/VDateRangePicker.vue'
import _VTimePicker from './date/VTimePicker.vue'
import _VImageUpload from './upload/VImageUpload.vue'
import _VUpload from './upload/VUpload.vue'
import _VAlert from './feedback/VAlert.vue'
import _VSnackbar from './feedback/VSnackbar.vue'
import _VProgress from './feedback/VProgress.vue'
import _VSkeleton from './feedback/VSkeleton.vue'
import _VLoadingOverlay from './feedback/VLoadingOverlay.vue'
import _VModal from './overlay/VModal.vue'
import _VDialog from './overlay/VDialog.vue'
import _VDrawer from './overlay/VDrawer.vue'
import _VTooltip from './overlay/VTooltip.vue'
import _VPopover from './overlay/VPopover.vue'
import _VTabs from './navigation/VTabs.vue'
import _VPagination from './navigation/VPagination.vue'
import _VMenu from './navigation/VMenu.vue'
import _VDropdown from './navigation/VDropdown.vue'
import _VBreadcrumb from './navigation/VBreadcrumb.vue'
import _VAvatar from './display/VAvatar.vue'
import _VBadge from './display/VBadge.vue'
import _VChip from './display/VChip.vue'
import _VTag from './display/VTag.vue'
import _VCard from './display/VCard.vue'
import _VList from './display/VList.vue'
import _VAccordion from './display/VAccordion.vue'
import _VTimeline from './display/VTimeline.vue'
import _VEmptyState from './display/VEmptyState.vue'
import _VDataTable from './table/VDataTable.vue'
import {
  VAutocomplete as _VAutocomplete,
  VMultiSelect as _VMultiSelect,
  VSelect as _VSelect,
} from './forms/select'

export type WithInstall<T> = T & Plugin

/** Adds `install()` so a component can be registered with `app.use()`, while staying a named export. */
export function withInstall<T extends Component>(main: T, ...extra: Component[]): WithInstall<T> {
  const c = main as WithInstall<T>
  c.install = (app: App) => {
    for (const comp of [main, ...extra]) {
      const name = (comp as { name?: string }).name
      if (name) app.component(name, comp)
    }
  }
  return c
}

// actions
export const VButton = /* @__PURE__ */ withInstall(_VButton)
export const VIconButton = /* @__PURE__ */ withInstall(_VIconButton)
export const VButtonGroup = /* @__PURE__ */ withInstall(_VButtonGroup)
export const VSpinner = /* @__PURE__ */ withInstall(_VSpinner)

// forms
export const VFormField = /* @__PURE__ */ withInstall(_VFormField)
export const VInput = /* @__PURE__ */ withInstall(_VInput)
export const VTextarea = /* @__PURE__ */ withInstall(_VTextarea)
export const VPasswordInput = /* @__PURE__ */ withInstall(_VPasswordInput)
export const VNumberInput = /* @__PURE__ */ withInstall(_VNumberInput)
export const VSelect = /* @__PURE__ */ withInstall(_VSelect)
export const VMultiSelect = /* @__PURE__ */ withInstall(_VMultiSelect)
export const VAutocomplete = /* @__PURE__ */ withInstall(_VAutocomplete)
export const VCheckbox = /* @__PURE__ */ withInstall(_VCheckbox)
export const VCheckboxGroup = /* @__PURE__ */ withInstall(_VCheckboxGroup)
export const VRadio = /* @__PURE__ */ withInstall(_VRadio)
export const VRadioGroup = /* @__PURE__ */ withInstall(_VRadioGroup)
export const VSwitch = /* @__PURE__ */ withInstall(_VSwitch)

// date
export const VCalendar = /* @__PURE__ */ withInstall(_VCalendar)
export const VDatePicker = /* @__PURE__ */ withInstall(_VDatePicker)
export const VDateRangePicker = /* @__PURE__ */ withInstall(_VDateRangePicker)
export const VTimePicker = /* @__PURE__ */ withInstall(_VTimePicker)

// upload
export const VUpload = /* @__PURE__ */ withInstall(_VUpload)
export const VImageUpload = /* @__PURE__ */ withInstall(_VImageUpload)

// feedback (toast)
export const VToast = /* @__PURE__ */ withInstall(_VToast)
export const VToaster = /* @__PURE__ */ withInstall(_VToaster)

// feedback
export const VAlert = /* @__PURE__ */ withInstall(_VAlert)
export const VSnackbar = /* @__PURE__ */ withInstall(_VSnackbar)
export const VProgress = /* @__PURE__ */ withInstall(_VProgress)
export const VSkeleton = /* @__PURE__ */ withInstall(_VSkeleton)
export const VLoadingOverlay = /* @__PURE__ */ withInstall(_VLoadingOverlay)

// overlay
export const VModal = /* @__PURE__ */ withInstall(_VModal)
export const VDialog = /* @__PURE__ */ withInstall(_VDialog)
export const VDrawer = /* @__PURE__ */ withInstall(_VDrawer)
export const VTooltip = /* @__PURE__ */ withInstall(_VTooltip)
export const VPopover = /* @__PURE__ */ withInstall(_VPopover)

// navigation
export const VTabs = /* @__PURE__ */ withInstall(_VTabs)
export const VPagination = /* @__PURE__ */ withInstall(_VPagination)
export const VMenu = /* @__PURE__ */ withInstall(_VMenu)
export const VDropdown = /* @__PURE__ */ withInstall(_VDropdown)
export const VBreadcrumb = /* @__PURE__ */ withInstall(_VBreadcrumb)

// display
export const VAvatar = /* @__PURE__ */ withInstall(_VAvatar)
export const VBadge = /* @__PURE__ */ withInstall(_VBadge)
export const VChip = /* @__PURE__ */ withInstall(_VChip)
export const VTag = /* @__PURE__ */ withInstall(_VTag)
export const VCard = /* @__PURE__ */ withInstall(_VCard)
export const VList = /* @__PURE__ */ withInstall(_VList)
export const VAccordion = /* @__PURE__ */ withInstall(_VAccordion)
export const VTimeline = /* @__PURE__ */ withInstall(_VTimeline)
export const VEmptyState = /* @__PURE__ */ withInstall(_VEmptyState)

// data
/** Generic over the row type: `<VDataTable :rows="users" ...>` infers `Row`. */
export const VDataTable = /* @__PURE__ */ withInstall(
  _VDataTable as unknown as Component,
) as unknown as typeof _VDataTable & Plugin
