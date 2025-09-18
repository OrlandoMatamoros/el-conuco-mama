// Lógica tipo Power Pivot con tabla calendario como matriz principal

export const createCalendarTable = () => {
  const calendar = []
  const start = new Date('2025-01-01')
  const end = new Date()
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    calendar.push({
      date: new Date(d),
      dateKey: d.toISOString().split('T')[0],
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      weekday: d.getDay(),
      week: Math.floor((d.getDate() - 1) / 7) + 1,
      monthName: d.toLocaleDateString('es-ES', { month: 'long' }),
      dayName: d.toLocaleDateString('es-ES', { weekday: 'long' })
    })
  }
  return calendar
}

// Función para parsear fechas en diferentes formatos
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null
  
  // Formato MM/DD/YYYY (items.csv)
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      return new Date(parseInt(parts[2]), parseInt(parts[0])-1, parseInt(parts[1]))
    }
  }
  
  // Formato "martes, 7 de enero de 2025" (COSTOS.csv)
  const spanishMatch = dateStr.match(/(\d+) de (\w+) de (\d+)/)
  if (spanishMatch) {
    const months: any = {
      'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
      'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
      'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
    }
    return new Date(parseInt(spanishMatch[3]), months[spanishMatch[2].toLowerCase()], parseInt(spanishMatch[1]))
  }
  
  // Formato DD/MM/YYYY (Gastos.csv)
  if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    const parts = dateStr.split('/')
    return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]))
  }
  
  return null
}

export const getTotalsByPeriod = async (startDate?: Date, endDate?: Date) => {
  try {
    // Crear tabla calendario
    const calendar = createCalendarTable()
    
    // Si no hay fechas, usar todo disponible
    if (!startDate) {
      startDate = new Date('2025-01-01')
      endDate = new Date()
    }
    
    // Filtrar calendario por período
    const periodDays = calendar.filter(day => 
      day.date >= startDate && day.date <= endDate
    ).map(day => day.dateKey)
    
    console.log(`Procesando ${periodDays.length} días del período`)
    
    // PROCESAR VENTAS
    const salesRes = await fetch('/data/items.csv')
    const salesText = await salesRes.text()
    const salesLines = salesText.split('\n').filter(l => l.trim())
    
    // Crear índice de ventas por fecha
    const salesByDate: any = {}
    let totalSales = 0
    let totalTransactions = 0
    
    for (let i = 1; i < salesLines.length; i++) {
      const line = salesLines[i].replace(/"/g, '')
      const cols = line.split(',')
      
      const dateStr = cols[0]?.trim()
      const date = parseDate(dateStr)
      
      if (date) {
        const dateKey = date.toISOString().split('T')[0]
        
        if (!salesByDate[dateKey]) {
          salesByDate[dateKey] = { sales: 0, transactions: 0 }
        }
        
        const amount = parseFloat(cols[7]?.replace('$', '').replace(',', '') || '0')
        if (!isNaN(amount) && amount > 0) {
          salesByDate[dateKey].sales += amount
          salesByDate[dateKey].transactions += 1
        }
      }
    }
    
    // Sumar solo las ventas del período usando la tabla calendario
    periodDays.forEach(dateKey => {
      if (salesByDate[dateKey]) {
        totalSales += salesByDate[dateKey].sales
        totalTransactions += salesByDate[dateKey].transactions
      }
    })
    
    // PROCESAR INVENTARIO (no tiene fecha, usar total actual)
    const invRes = await fetch('/data/invonhand_by_day.csv')
    const invText = await invRes.text()
    const invLines = invText.split('\n').filter(l => l.trim())
    
    let totalInventory = 0
    let productCount = 0
    
    for (let i = 1; i < invLines.length; i++) {
      const line = invLines[i].replace(/"/g, '')
      const cols = line.split(',')
      const qty = parseInt(cols[3] || '0')
      if (qty > 0) {
        totalInventory += qty
        productCount++
      }
    }
    
    // PROCESAR COSTOS
    const costRes = await fetch('/data/COSTOS.csv')
    const costText = await costRes.text()
    const costLines = costText.split('\n').filter(l => l.trim())
    
    const costsByDate: any = {}
    let totalCosts = 0
    
    for (let i = 1; i < costLines.length; i++) {
      const cols = costLines[i].split(';')
      const dateStr = cols[1]?.trim()
      const date = parseDate(dateStr)
      
      if (date) {
        const dateKey = date.toISOString().split('T')[0]
        const amount = parseFloat(
          cols[3]?.replace('$', '').replace(/\s/g, '').replace(',', '.') || '0'
        )
        
        if (!isNaN(amount) && amount > 0) {
          if (!costsByDate[dateKey]) costsByDate[dateKey] = 0
          costsByDate[dateKey] += amount
        }
      }
    }
    
    // Sumar costos del período
    periodDays.forEach(dateKey => {
      if (costsByDate[dateKey]) {
        totalCosts += costsByDate[dateKey]
      }
    })
    
    // PROCESAR PAYROLL (por ahora usar total, después filtrar por período de pago)
    const payrollRes = await fetch('/data/Payroll.csv')
    const payrollText = await payrollRes.text()
    const payrollLines = payrollText.split('\n').filter(l => l.trim())
    
    let totalPayroll = 0
    
    for (let i = 1; i < payrollLines.length; i++) {
      const cols = payrollLines[i].split(';')
      const amount = parseFloat(
        cols[15]?.replace('$', '').replace(/\s/g, '').replace(',', '.') || '0'
      )
      if (!isNaN(amount) && amount > 0) {
        totalPayroll += amount
      }
    }
    
    // PROCESAR GASTOS
    const gastosRes = await fetch('/data/Gastos.csv')
    const gastosText = await gastosRes.text()
    const gastosLines = gastosText.split('\n').filter(l => l.trim())
    
    const gastosByDate: any = {}
    let totalExpenses = 0
    
    for (let i = 1; i < gastosLines.length; i++) {
      const cols = gastosLines[i].split(';')
      const dateStr = cols[0]?.trim()
      const date = parseDate(dateStr)
      
      if (date) {
        const dateKey = date.toISOString().split('T')[0]
        const amount = parseFloat(
          cols[2]?.replace('$', '').replace(/\s/g, '').replace('.', '').replace(',', '.') || '0'
        )
        
        if (!isNaN(amount) && amount > 0) {
          if (!gastosByDate[dateKey]) gastosByDate[dateKey] = 0
          gastosByDate[dateKey] += amount
        }
      }
    }
    
    // Sumar gastos del período
    periodDays.forEach(dateKey => {
      if (gastosByDate[dateKey]) {
        totalExpenses += gastosByDate[dateKey]
      }
    })
    
    // CALCULAR KPIs
    const totalOperatingCosts = totalCosts + totalPayroll + totalExpenses
    const profit = totalSales - totalOperatingCosts
    const margin = totalSales > 0 ? (profit / totalSales) * 100 : 0
    
    console.log('Resumen del período:', {
      días: periodDays.length,
      ventas: totalSales,
      costos: totalCosts,
      gastos: totalExpenses,
      nómina: totalPayroll
    })
    
    return {
      ventas: totalSales,
      transacciones: totalTransactions,
      ticketPromedio: totalTransactions > 0 ? totalSales / totalTransactions : 0,
      inventario: totalInventory,
      productos: productCount,
      costos: totalCosts,
      nomina: totalPayroll,
      gastos: totalExpenses,
      utilidad: profit,
      margen: margin,
      ventasDiarias: salesByDate,
      periodo: {
        inicio: startDate?.toLocaleDateString('es-ES'),
        fin: endDate?.toLocaleDateString('es-ES'),
        dias: periodDays.length
      }
    }
    
  } catch (error) {
    console.error('Error procesando datos:', error)
    return null
  }
}
