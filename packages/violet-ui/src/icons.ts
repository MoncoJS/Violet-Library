import { defineComponent, h, type Component } from 'vue'

type IconNode = [tag: string, attrs: Record<string, string | number>]

export function createIcon(name: string, nodes: IconNode[]): Component {
  return defineComponent({
    name,
    props: {
      size: { type: [Number, String], default: '1em' },
      strokeWidth: { type: [Number, String], default: 2 },
      title: { type: String, default: undefined },
    },
    setup(props) {
      return () => {
        const size = typeof props.size === 'number' ? `${props.size}px` : props.size
        const children = nodes.map(([tag, attrs]) => h(tag, attrs))
        if (props.title) children.unshift(h('title', props.title))
        return h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: size,
            height: size,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': props.strokeWidth,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            class: 'v-icon',
            focusable: 'false',
            role: props.title ? 'img' : undefined,
            'aria-hidden': props.title ? undefined : 'true',
          },
          children,
        )
      }
    },
  })
}

const circle: IconNode = ['circle', { cx: 12, cy: 12, r: 10 }]

export const IconClose = createIcon('IconClose', [['path', { d: 'M18 6 6 18M6 6l12 12' }]])
export const IconPlus = createIcon('IconPlus', [['path', { d: 'M12 5v14M5 12h14' }]])
export const IconSearch = createIcon('IconSearch', [
  ['circle', { cx: 11, cy: 11, r: 7 }],
  ['path', { d: 'm20 20-3.5-3.5' }],
])
export const IconInfo = createIcon('IconInfo', [circle, ['path', { d: 'M12 16v-4M12 8h.01' }]])
export const IconCircleCheck = createIcon('IconCircleCheck', [circle, ['path', { d: 'm9 12 2 2 4-4' }]])
export const IconCircleX = createIcon('IconCircleX', [circle, ['path', { d: 'm15 9-6 6M9 9l6 6' }]])
export const IconAlertTriangle = createIcon('IconAlertTriangle', [
  ['path', { d: 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z' }],
  ['path', { d: 'M12 9v4M12 17h.01' }],
])
export const IconMail = createIcon('IconMail', [
  ['rect', { x: 2, y: 4, width: 20, height: 16, rx: 2 }],
  ['path', { d: 'm22 7-10 6L2 7' }],
])
export const IconLock = createIcon('IconLock', [
  ['rect', { x: 4, y: 11, width: 16, height: 10, rx: 2 }],
  ['path', { d: 'M8 11V7a4 4 0 0 1 8 0v4' }],
])
export const IconSun = createIcon('IconSun', [
  ['circle', { cx: 12, cy: 12, r: 4 }],
  [
    'path',
    {
      d: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    },
  ],
])
export const IconMoon = createIcon('IconMoon', [['path', { d: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z' }]])
export const IconTrash = createIcon('IconTrash', [
  [
    'path',
    {
      d: 'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',
    },
  ],
])
export const IconDownload = createIcon('IconDownload', [
  ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' }],
])
