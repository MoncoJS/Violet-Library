# Roadmap

Status of the component set from the [project brief](./PROJECT_BRIEF.md).

✅ shipped · ⬜ planned

## Actions — `@violet-ui/core`

✅ VButton · ✅ VIconButton · ✅ VButtonGroup · ✅ VSpinner (internal primitive, exported)

## Forms — `@violet-ui/forms`

✅ VInput · ⬜ VTextarea · ⬜ VPasswordInput · ⬜ VNumberInput · ⬜ VSelect · ⬜ VMultiSelect · ⬜ VAutocomplete · ⬜ VCheckbox · ⬜ VCheckboxGroup · ⬜ VRadio · ⬜ VRadioGroup · ⬜ VSwitch

Date: ⬜ VDatePicker · ⬜ VDateRangePicker · ⬜ VTimePicker
Upload: ⬜ VUpload · ⬜ VImageUpload

## Feedback — `@violet-ui/feedback`

✅ VToast / VToaster · ⬜ VAlert · ⬜ VSnackbar · ⬜ VProgress · ⬜ VSkeleton · ⬜ VLoadingOverlay

## Overlay — `@violet-ui/overlay` (private)

⬜ VModal · ⬜ VDialog · ⬜ VDrawer · ⬜ VTooltip · ⬜ VPopover

## Navigation — `@violet-ui/navigation` (private)

⬜ VTabs · ⬜ VPagination · ⬜ VMenu · ⬜ VDropdown · ⬜ VBreadcrumb

## Data display — `@violet-ui/data-display` (private)

⬜ VAvatar · ⬜ VBadge · ⬜ VChip · ⬜ VTag · ⬜ VCard · ⬜ VList · ⬜ VAccordion · ⬜ VTimeline · ⬜ VEmptyState

## Data table — `@violet-ui/data-table` (private)

⬜ VDataTable — sorting, search, pagination, row selection, column visibility, CSV export, responsive mode

## Composables — `@violet-ui/composables`

✅ useForm · ✅ useField · ✅ useValidation · ✅ useToast · ✅ useTheme
✅ Rules: required, email, min, max, regex, confirmed

## Adding a component (checklist)

1. `packages/<pkg>/src/components/VThing/{VThing.vue,types.ts,VThing.spec.ts,VThing.stories.ts}`
2. Export from `packages/<pkg>/src/index.ts` with `withInstall`.
3. Add the name to `packages/violet-ui/src/components.ts` **and** `packages/violet-ui/volar.d.ts` (a test enforces this).
4. If the package was private: remove `"private": true`, add `publishConfig`, the `./style.css` export, and `@import` it in `packages/violet-ui/styles/index.css`.
5. Docs page in `apps/docs/components/`.
6. `bun changeset`.
