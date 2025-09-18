export const formatCurrency = (value: number): string => {
  if (!value || isNaN(value)) return '$0'
  
  // Para millones
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  
  // Para miles
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  
  // Para valores pequeños
  return `$${value.toFixed(0)}`
}

export const formatNumber = (value: number): string => {
  if (!value || isNaN(value)) return '0'
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  
  return value.toFixed(0)
}

export const formatPercentage = (value: number): string => {
  if (!value || isNaN(value)) return '0%'
  return `${value.toFixed(1)}%`
}

// Formato completo con separadores de miles
export const formatFullCurrency = (value: number): string => {
  if (!value || isNaN(value)) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
