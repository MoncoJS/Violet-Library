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
export const IconCircleCheck = createIcon('IconCircleCheck', [
  circle,
  ['path', { d: 'm9 12 2 2 4-4' }],
])
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
export const IconMoon = createIcon('IconMoon', [
  ['path', { d: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z' }],
])
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
export const IconEye = createIcon('IconEye', [
  ['path', { d: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z' }],
  ['circle', { cx: 12, cy: 12, r: 3 }],
])
export const IconEyeOff = createIcon('IconEyeOff', [
  [
    'path',
    {
      d: 'M9.9 4.2A10.4 10.4 0 0 1 12 4c6.4 0 10 8 10 8a17.6 17.6 0 0 1-2.2 3.2M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 8 10 8a9.7 9.7 0 0 0 5.4-1.6',
    },
  ],
  ['path', { d: 'M14.1 14.1a3 3 0 0 1-4.2-4.2M2 2l20 20' }],
])
export const IconMinus = createIcon('IconMinus', [['path', { d: 'M5 12h14' }]])
export const IconCheck = createIcon('IconCheck', [['path', { d: 'M20 6 9 17l-5-5' }]])
export const IconChevronDown = createIcon('IconChevronDown', [['path', { d: 'm6 9 6 6 6-6' }]])
export const IconChevronUp = createIcon('IconChevronUp', [['path', { d: 'm18 15-6-6-6 6' }]])
export const IconChevronLeft = createIcon('IconChevronLeft', [['path', { d: 'm15 18-6-6 6-6' }]])
export const IconChevronRight = createIcon('IconChevronRight', [['path', { d: 'm9 18 6-6-6-6' }]])
export const IconChevronsLeft = createIcon('IconChevronsLeft', [
  ['path', { d: 'm11 17-5-5 5-5M18 17l-5-5 5-5' }],
])
export const IconChevronsRight = createIcon('IconChevronsRight', [
  ['path', { d: 'm13 17 5-5-5-5M6 17l5-5-5-5' }],
])
export const IconArrowUp = createIcon('IconArrowUp', [['path', { d: 'M12 19V5M5 12l7-7 7 7' }]])
export const IconArrowDown = createIcon('IconArrowDown', [
  ['path', { d: 'M12 5v14M19 12l-7 7-7-7' }],
])
export const IconArrowUpDown = createIcon('IconArrowUpDown', [
  ['path', { d: 'm21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16' }],
])
export const IconCalendar = createIcon('IconCalendar', [
  ['rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }],
  ['path', { d: 'M16 2v4M8 2v4M3 10h18' }],
])
export const IconClock = createIcon('IconClock', [circle, ['path', { d: 'M12 6v6l4 2' }]])
export const IconUpload = createIcon('IconUpload', [
  ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12' }],
])
export const IconFile = createIcon('IconFile', [
  ['path', { d: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z' }],
  ['path', { d: 'M14 2v6h6' }],
])
export const IconImage = createIcon('IconImage', [
  ['rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 }],
  ['circle', { cx: 9, cy: 9, r: 2 }],
  ['path', { d: 'm21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21' }],
])
export const IconMenu = createIcon('IconMenu', [['path', { d: 'M4 6h16M4 12h16M4 18h16' }]])
export const IconMoreHorizontal = createIcon('IconMoreHorizontal', [
  ['circle', { cx: 12, cy: 12, r: 1 }],
  ['circle', { cx: 19, cy: 12, r: 1 }],
  ['circle', { cx: 5, cy: 12, r: 1 }],
])
export const IconColumns = createIcon('IconColumns', [
  ['rect', { x: 3, y: 3, width: 18, height: 18, rx: 2 }],
  ['path', { d: 'M9 3v18M15 3v18' }],
])
export const IconInbox = createIcon('IconInbox', [
  ['path', { d: 'M22 12h-6l-2 3h-4l-2-3H2' }],
  [
    'path',
    {
      d: 'M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1Z',
    },
  ],
])
export const IconUser = createIcon('IconUser', [
  ['circle', { cx: 12, cy: 8, r: 4 }],
  ['path', { d: 'M4 21a8 8 0 0 1 16 0' }],
])
export const IconHome = createIcon('IconHome', [
  ['path', { d: 'm3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z' }],
  ['path', { d: 'M9 22V12h6v10' }],
])
export const IconSettings = createIcon('IconSettings', [
  ['circle', { cx: 12, cy: 12, r: 3 }],
  [
    'path',
    {
      d: 'M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z',
    },
  ],
])
