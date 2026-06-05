export const formatCurrency = (value: number | string, currency = 'USD'): string => {
  const amount = typeof value === 'string' ? Number.parseFloat(value) : value

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isNaN(amount) ? 0 : amount)
}

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatDate = (value: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export const formatPercent = (value: number): string => {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}
