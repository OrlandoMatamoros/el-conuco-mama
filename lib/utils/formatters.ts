export function formatCurrency(amount: number, currency: string = 'DOP'): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-DO').format(num)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-DO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
