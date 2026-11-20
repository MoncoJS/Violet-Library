# Roadmap

Status of the component set from the [project brief](./PROJECT_BRIEF.md). All components ship in the single `violet-ui` package (tree-shakeable, one module per component).

✅ shipped · ⬜ planned

## Actions

✅ VButton · ✅ VIconButton · ✅ VButtonGroup · ✅ VSpinner

## Forms

✅ VInput · ✅ VTextarea · ✅ VPasswordInput · ✅ VNumberInput · ✅ VSelect · ✅ VMultiSelect · ✅ VAutocomplete · ✅ VCheckbox · ✅ VCheckboxGroup · ✅ VRadio · ✅ VRadioGroup · ✅ VSwitch · ✅ VFormField (shared frame)

Date: ✅ VDatePicker · ✅ VDateRangePicker · ✅ VTimePicker · ✅ VCalendar
Upload: ✅ VUpload · ✅ VImageUpload

## Feedback

✅ VToast / VToaster · ✅ VAlert · ✅ VSnackbar · ✅ VProgress · ✅ VSkeleton · ✅ VLoadingOverlay

## Overlay

✅ VModal · ✅ VDialog · ✅ VDrawer · ✅ VTooltip · ✅ VPopover

## Navigation

✅ VTabs · ✅ VPagination · ✅ VMenu · ✅ VDropdown · ✅ VBreadcrumb

## Data display

✅ VAvatar · ✅ VBadge · ✅ VChip · ✅ VTag · ✅ VCard · ✅ VList · ✅ VAccordion · ✅ VTimeline · ✅ VEmptyState

## Data table

✅ VDataTable — sorting (multi-column), search, pagination, row selection, column visibility, CSV export, responsive card mode, server mode

## Composables

✅ useForm · ✅ useField · ✅ useValidation · ✅ useToast · ✅ useTheme
✅ Rules: required, email, min, max, regex, confirmed

## Next

⬜ Per-component unit tests for every component (core behaviours are covered in `components.spec.ts`)
⬜ Visual regression tests for Storybook
⬜ Virtual scrolling for VDataTable / VSelect with very large data sets
⬜ Split into scoped packages (`@violet-ui/forms`, …) if consumers need independent versioning

## Adding a component (checklist)

1. `packages/violet-ui/src/components/<group>/VThing.vue` (`<script setup lang="ts">`, exported `ThingProps` interface).
2. Styles in `packages/violet-ui/src/styles/<group>.css`, using `--v-*` tokens and `v-thing__part` / `is-state` classes.
3. Export from `src/components/index.ts` with `withInstall`.
4. Add the name to `src/resolver.ts` and `volar.d.ts`.
5. Tests in `*.spec.ts`, a story in `*.stories.ts`, a docs page in `apps/docs/components/`.
6. `bun changeset`.
