/** Dates are exchanged as ISO `YYYY-MM-DD` strings: timezone-free and SSR-stable. */
export type ISODate = string

const pad = (n: number) => String(n).padStart(2, '0')

export function toISO(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseISO(s: string | null | undefined): Date | null {
  if (!s) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(d.getTime()) || d.getMonth() !== Number(m[2]) - 1 ? null : d
}

export const today = (): ISODate => toISO(new Date())

export function addDays(iso: ISODate, n: number): ISODate {
  const d = parseISO(iso)!
  d.setDate(d.getDate() + n)
  return toISO(d)
}

export function addMonths(year: number, month: number, n: number) {
  const d = new Date(year, month + n, 1)
  return { year: d.getFullYear(), month: d.getMonth() }
}

export interface CalendarDay {
  iso: ISODate
  day: number
  inMonth: boolean
}

/** 6×7 grid for the given month, starting on `firstDay` (0 = Sunday). */
export function monthGrid(year: number, month: number, firstDay = 0): CalendarDay[] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() - firstDay + 7) % 7
  const start = new Date(year, month, 1 - offset)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    return { iso: toISO(d), day: d.getDate(), inMonth: d.getMonth() === month }
  })
}

export function weekdayNames(
  locale: string | undefined,
  firstDay = 0,
  style: 'narrow' | 'short' = 'short',
) {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: style })
  // 2023-01-01 is a Sunday
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(2023, 0, 1 + ((i + firstDay) % 7))),
  )
}

export function monthName(locale: string | undefined, year: number, month: number) {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(year, month, 1),
  )
}

export function formatISO(
  iso: ISODate | null | undefined,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
) {
  const d = parseISO(iso)
  return d ? new Intl.DateTimeFormat(locale, options).format(d) : ''
}

/** Lenient parse of typed text: ISO, or the locale's numeric order (d/m/y or m/d/y). */
export function parseTyped(text: string, locale?: string): ISODate | null {
  const t = text.trim()
  if (!t) return null
  const iso = parseISO(t)
  if (iso) return toISO(iso)
  const parts = t
    .split(/[^\d]+/)
    .filter(Boolean)
    .map(Number)
  if (parts.length !== 3) return null
  const order = new Intl.DateTimeFormat(locale)
    .formatToParts(new Date(2000, 10, 22))
    .filter((p) => p.type === 'day' || p.type === 'month' || p.type === 'year')
    .map((p) => p.type)
  const map: Record<string, number> = {}
  order.forEach((k, i) => (map[k] = parts[i]!))
  let y = map.year!
  if (y < 100) y += 2000
  const d = new Date(y, map.month! - 1, map.day!)
  return d.getMonth() === map.month! - 1 ? toISO(d) : null
}

export const isBetween = (iso: ISODate, a?: ISODate | null, b?: ISODate | null) =>
  !!a && !!b && iso > (a < b ? a : b) && iso < (a < b ? b : a)
