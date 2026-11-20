You are a Senior Frontend Architect and Open Source Maintainer.

Create a production-ready Vue 3 UI Component Library named "Violet UI".

Project Goals:
- Compete with modern UI libraries such as Vuetify, PrimeVue, Naive UI, and Element Plus.
- Focus on simplicity, performance, excellent developer experience, and enterprise applications.
- Components should be highly customizable, accessible, and responsive.
- Design language should be modern, clean, premium, and suitable for SaaS dashboards.

Tech Stack:
- Vue 3
- TypeScript
- Vite
- Composition API
- SCSS
- Vitest
- Storybook
- bun Workspace
- Turbo Monorepo

Project Structure:

packages/
├── core
├── forms
├── overlay
├── navigation
├── feedback
├── data-display
├── data-table
├── theme
├── icons
├── composables

apps/
├── docs
├── playground

docs/
examples/

Create the following components:

Action Components
- VButton
- VIconButton
- VButtonGroup

Form Components
- VInput
- VTextarea
- VPasswordInput
- VNumberInput
- VSelect
- VMultiSelect
- VAutocomplete
- VCheckbox
- VCheckboxGroup
- VRadio
- VRadioGroup
- VSwitch

Date Components
- VDatePicker
- VDateRangePicker
- VTimePicker

Upload Components
- VUpload
- VImageUpload

Feedback Components
- VAlert
- VToast
- VSnackbar
- VProgress
- VSkeleton
- VLoadingOverlay

Overlay Components
- VModal
- VDialog
- VDrawer
- VTooltip
- VPopover

Navigation Components
- VTabs
- VPagination
- VMenu
- VDropdown
- VBreadcrumb

Data Display
- VAvatar
- VBadge
- VChip
- VTag
- VCard
- VList
- VAccordion
- VTimeline
- VEmptyState

Advanced Components
- VDataTable

DataTable Features
- Sorting
- Search
- Pagination
- Row Selection
- Column Visibility
- Export CSV
- Responsive Mode

Create composables:

- useForm()
- useField()
- useValidation()
- useToast()
- useTheme()

Validation Rules:
- required
- email
- min
- max
- regex
- confirmed

Theme System:
- Light Theme
- Dark Theme
- Custom Theme Support
- Design Tokens
- CSS Variables

Requirements:
- Full TypeScript support
- Tree Shaking support
- Accessibility (ARIA)
- Keyboard Navigation
- Responsive Design
- SSR Friendly
- Auto Import Support

Generate:
1. Complete folder structure
2. Component architecture
3. Type definitions
4. Theme system architecture
5. Build configuration
6. Package export strategy
7. Example implementation of VButton
8. Example implementation of VInput
9. Example implementation of useForm
10. Storybook setup
11. NPM publishing workflow
12. GitHub Actions CI/CD

Follow enterprise-grade coding standards.
Output production-quality code only.