import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import {
  VButton,
  VButtonGroup,
  VCalendar,
  VCheckboxGroup,
  VDataTable,
  VInput,
  VModal,
  VNumberInput,
  VPagination,
  VSelect,
  VTabs,
} from './index'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('VButton', () => {
  it('inherits group defaults and blocks clicks while loading', async () => {
    const onClick = vi.fn()
    const w = mount(VButtonGroup, {
      props: { variant: 'outline', color: 'neutral' },
      slots: { default: () => [h(VButton, { loading: true, onClick }, () => 'Save')] },
    })
    const btn = w.get('button')
    expect(btn.classes()).toEqual(
      expect.arrayContaining(['v-button--outline', 'v-button--neutral', 'is-loading']),
    )
    expect(btn.attributes('aria-busy')).toBe('true')
    await btn.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('VInput', () => {
  it('links label, error and emits parsed numbers', async () => {
    const w = mount(VInput, { props: { label: 'Age', type: 'number', error: 'Too young' } })
    const input = w.get('input')
    expect(w.get('label').attributes('for')).toBe(input.attributes('id'))
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toContain('-error')
    await input.setValue('42')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([42])
  })
})

describe('VNumberInput', () => {
  it('clamps on blur and steps with arrow keys', async () => {
    const w = mount(VNumberInput, { props: { modelValue: 5, min: 0, max: 10, step: 2 } })
    const input = w.get('input')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([7])
    await input.setValue('99')
    await input.trigger('blur')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([10])
  })
})

describe('VSelect', () => {
  it('opens with keyboard, moves the active option and selects with Enter', async () => {
    const w = mount(VSelect, {
      attachTo: document.body,
      props: {
        options: ['Apple', { label: 'Banana', value: 'b', disabled: true }, 'Cherry'],
        label: 'Fruit',
      },
    })
    const trigger = w.get('[role="combobox"]')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const options = document.body.querySelectorAll('[role="option"]')
    expect(options).toHaveLength(3)
    await trigger.trigger('keydown', { key: 'ArrowDown' }) // skips disabled Banana
    await trigger.trigger('keydown', { key: 'Enter' })
    expect(w.findComponent({ name: 'VSelectBase' }).emitted('update:modelValue')!.at(-1)).toEqual([
      'Cherry',
    ])
    w.unmount()
  })
})

describe('VCheckboxGroup', () => {
  it('select-all toggles only enabled options', async () => {
    const w = mount(VCheckboxGroup, {
      props: {
        modelValue: [],
        selectAll: true,
        options: ['a', 'b', { label: 'c', value: 'c', disabled: true }],
      },
    })
    await w.findAll('input[type="checkbox"]')[0]!.setValue(true)
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([['a', 'b']])
  })
})

describe('VPagination', () => {
  it('collapses long ranges and marks the current page', () => {
    const w = mount(VPagination, { props: { modelValue: 10, total: 200, pageSize: 10 } })
    const pages = w.findAll('.v-pagination__page').map((b) => b.text())
    expect(pages).toEqual(['1', '9', '10', '11', '20'])
    expect(w.get('[aria-current="page"]').text()).toBe('10')
    expect(w.findAll('.v-pagination__gap')).toHaveLength(2)
  })
})

describe('VTabs', () => {
  it('moves selection with arrow keys (automatic activation)', async () => {
    const w = mount(VTabs, {
      attachTo: document.body,
      props: {
        modelValue: 'a',
        items: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
          { value: 'c', label: 'C' },
        ],
      },
    })
    const tabs = w.findAll('[role="tab"]')
    ;(tabs[0]!.element as HTMLElement).focus()
    await w.get('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['c'])
    expect(w.get('[role="tabpanel"]').attributes('aria-labelledby')).toBe(tabs[0]!.attributes('id'))
    w.unmount()
  })
})

describe('VCalendar', () => {
  it('supports arrow-key navigation and range selection', async () => {
    const w = mount(VCalendar, {
      attachTo: document.body,
      props: { range: true, modelValue: ['2024-03-10', null] },
    })
    const day = (iso: string) => w.get(`[data-iso="${iso}"]`)
    await day('2024-03-10').trigger('click')
    await day('2024-03-14').trigger('click')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual([['2024-03-10', '2024-03-14']])
    await w.get('.v-calendar').trigger('keydown', { key: 'ArrowRight' })
    await flushPromises()
    expect(document.activeElement?.getAttribute('data-iso')).toBe('2024-03-15')
    w.unmount()
  })
})

describe('VModal', () => {
  it('traps focus, closes on Escape and restores focus', async () => {
    const Host = defineComponent({
      setup() {
        const open = ref(false)
        return () => [
          h('button', { id: 'opener', onClick: () => (open.value = true) }, 'Open'),
          h(
            VModal,
            {
              modelValue: open.value,
              title: 'Hello',
              'onUpdate:modelValue': (v: boolean) => (open.value = v),
            },
            () => h('input', { id: 'inside' }),
          ),
        ]
      },
    })
    const w = mount(Host, { attachTo: document.body })
    const opener = w.get('#opener').element as HTMLButtonElement
    opener.focus()
    await w.get('#opener').trigger('click')
    await flushPromises()
    const dialog = document.querySelector('[role="dialog"]')!
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(document.activeElement?.id).toBe('inside')
    expect(document.body.style.overflow).toBe('hidden')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(opener)
    expect(document.body.style.overflow).toBe('')
    w.unmount()
  })
})

describe('VDataTable', () => {
  const rows = [
    { id: 1, name: 'Ada', age: 36 },
    { id: 2, name: 'Grace', age: 85 },
    { id: 3, name: 'Linus', age: 54 },
    { id: 4, name: 'Barbara', age: 12 },
  ]
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'age', label: 'Age', sortable: true, align: 'right' as const },
  ]
  const names = (w: ReturnType<typeof mount>) =>
    w
      .findAll('tbody tr td:not(.v-table__select)')
      .filter((_, i) => i % 2 === 0)
      .map((td) => td.text())

  it('sorts, searches, paginates and selects', async () => {
    const w = mount(VDataTable, {
      props: { rows, columns, pageSize: 2, selectable: true, responsiveBreakpoint: 0 },
    })
    expect(names(w)).toEqual(['Ada', 'Grace'])

    await w.findAll('.v-table__sort')[1]!.trigger('click') // age asc
    expect(names(w)).toEqual(['Barbara', 'Ada'])
    expect(w.findAll('th')[2]!.attributes('aria-sort')).toBe('ascending')

    await w.get('.v-table__search input').setValue('li')
    expect(names(w)).toEqual(['Linus'])
    expect(w.get('.v-table__range').text()).toBe('1–1 of 1')

    await w.get('thead input[type="checkbox"]').setValue(true)
    expect(w.emitted('update:selected')!.at(-1)).toEqual([[3]])
  })

  it('hides columns via the toggle state', async () => {
    const w = mount(VDataTable, {
      props: { rows, columns, hiddenColumns: ['age'], responsiveBreakpoint: 0 },
    })
    expect(w.findAll('thead th').map((t) => t.text())).toEqual(['Name'])
  })
})
