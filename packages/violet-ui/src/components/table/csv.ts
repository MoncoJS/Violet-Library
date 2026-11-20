/** RFC 4180 CSV with formula-injection protection for spreadsheet apps. */
export function toCSV(headers: string[], rows: unknown[][], delimiter = ','): string {
  const cell = (v: unknown) => {
    let s = v === null || v === undefined ? '' : v instanceof Date ? v.toISOString() : String(v)
    // Neutralise =, +, -, @ at the start (CSV injection), but keep plain negative numbers.
    if (/^[=+\-@\t\r]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`
    return /["\n\r]|[,;\t]/.test(s) || s.includes(delimiter) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [headers, ...rows].map((r) => r.map(cell).join(delimiter)).join('\r\n')
}

export function downloadCSV(filename: string, csv: string) {
  if (typeof document === 'undefined') return
  // BOM so Excel opens UTF-8 correctly
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
