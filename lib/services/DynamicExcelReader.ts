import * as XLSX from 'xlsx'
import * as fs from 'fs'

export class DynamicExcelReader {
  private workbook: any = null
  
  // Leer el Excel cada vez (sin caché)
  private loadExcel() {
    const excelPath = '/mnt/user-data/uploads/Dashboard_1_1.xlsx'
    
    if (fs.existsSync(excelPath)) {
      this.workbook = XLSX.readFile(excelPath)
      return true
    }
    return false
  }
  
  // Obtener TODOS los datos de Items en bruto
  getItemsData() {
    this.loadExcel()
    if (!this.workbook) return []
    
    const itemsSheet = this.workbook.Sheets['Items']
    if (!itemsSheet) return []
    
    // Convertir toda la hoja a JSON
    return XLSX.utils.sheet_to_json(itemsSheet)
  }
  
  // Calcular ventas totales REALES sumando columna H
  calculateTotalSales() {
    const items = this.getItemsData()
    let total = 0
    
    items.forEach((row: any) => {
      // La columna H es "Sales $"
      const sale = parseFloat(row['Sales $']) || 0
      total += sale
    })
    
    return total
  }
  
  // Obtener métricas de la hoja Analisis dinámicamente
  getAnalisisMetrics() {
    this.loadExcel()
    if (!this.workbook) return null
    
    const analisisSheet = this.workbook.Sheets['Analisis']
    if (!analisisSheet) return null
    
    // Convertir a array para buscar
    const data = XLSX.utils.sheet_to_json(analisisSheet, { header: 1 })
    const metrics: any = {}
    
    // Buscar cada métrica por su nombre
    data.forEach((row: any[]) => {
      if (!row || !row[0]) return
      
      const label = row[0].toString().toLowerCase()
      
      // Buscar el valor numérico en las siguientes columnas
      for (let i = 1; i < row.length; i++) {
        if (typeof row[i] === 'number') {
          if (label.includes('total ventas')) {
            metrics.totalVentas = row[i]
          } else if (label.includes('total egresos')) {
            metrics.totalEgresos = row[i]
          } else if (label.includes('total costos')) {
            metrics.totalCostos = row[i]
          } else if (label.includes('total gastos')) {
            metrics.totalGastos = row[i]
          } else if (label.includes('total payroll')) {
            metrics.totalPayroll = row[i]
          } else if (label.includes('utilidad bruta')) {
            metrics.utilidadBruta = row[i]
          } else if (label.includes('rentabilidad')) {
            metrics.rentabilidad = row[i]
          }
          break // Tomar el primer valor numérico encontrado
        }
      }
    })
    
    return metrics
  }
  
  // Filtrar ventas por período
  getSalesByPeriod(period: string) {
    const items = this.getItemsData()
    const today = new Date()
    
    const filtered = items.filter((row: any) => {
      if (!row['Date']) return false
      
      const rowDate = new Date(row['Date'])
      
      switch(period) {
        case 'dia':
          // Solo hoy
          return rowDate.toDateString() === today.toDateString()
          
        case 'semana':
          // Últimos 7 días
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return rowDate >= weekAgo && rowDate <= today
          
        case 'mes':
          // Mes actual
          return rowDate.getMonth() === today.getMonth() && 
                 rowDate.getFullYear() === today.getFullYear()
                 
        case 'trimestre':
          // Último trimestre
          const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)
          return rowDate >= quarterStart && rowDate <= today
          
        case 'año':
          // Año actual
          return rowDate.getFullYear() === today.getFullYear()
          
        default:
          return true
      }
    })
    
    // Calcular totales del período
    let totalSales = 0
    let uniqueCustomers = new Set()
    let departments: any = {}
    
    filtered.forEach((row: any) => {
      const sale = parseFloat(row['Sales $']) || 0
      totalSales += sale
      
      // Contar clientes únicos (podría ser por transacción)
      if (row['Transaction']) {
        uniqueCustomers.add(row['Transaction'])
      }
      
      // Agrupar por departamento
      const dept = row['Department'] || 'General'
      if (!departments[dept]) {
        departments[dept] = 0
      }
      departments[dept] += sale
    })
    
    return {
      totalSales,
      itemCount: filtered.length,
      uniqueCustomers: uniqueCustomers.size,
      departments,
      period,
      dateRange: {
        from: filtered.length > 0 ? filtered[0]['Date'] : null,
        to: filtered.length > 0 ? filtered[filtered.length - 1]['Date'] : null
      }
    }
  }
  
  // Obtener ventas por departamento
  getSalesByDepartment() {
    const items = this.getItemsData()
    const departments: any = {}
    
    items.forEach((row: any) => {
      const dept = row['Department'] || 'General'
      const sale = parseFloat(row['Sales $']) || 0
      
      if (!departments[dept]) {
        departments[dept] = {
          ventas: 0,
          items: 0,
          productos: new Set()
        }
      }
      
      departments[dept].ventas += sale
      departments[dept].items += 1
      departments[dept].productos.add(row['Item'])
    })
    
    // Convertir a array con porcentajes
    const total = Object.values(departments).reduce((sum: number, d: any) => sum + d.ventas, 0)
    
    return Object.entries(departments).map(([name, data]: [string, any]) => ({
      departamento: name,
      ventas: data.ventas,
      items: data.items,
      productos: data.productos.size,
      porcentaje: ((data.ventas / total) * 100).toFixed(2)
    }))
  }
  
  // Obtener productos top
  getTopProducts(limit: number = 10) {
    const items = this.getItemsData()
    const products: any = {}
    
    items.forEach((row: any) => {
      const product = row['Item']
      if (!product) return
      
      const sale = parseFloat(row['Sales $']) || 0
      const upc = row['UPC']
      
      if (!products[product]) {
        products[product] = {
          nombre: product,
          upc: upc,
          ventas: 0,
          cantidad: 0,
          transacciones: new Set()
        }
      }
      
      products[product].ventas += sale
      products[product].cantidad += 1
      if (row['Transaction']) {
        products[product].transacciones.add(row['Transaction'])
      }
    })
    
    // Ordenar por ventas y tomar el top
    return Object.values(products)
      .sort((a: any, b: any) => b.ventas - a.ventas)
      .slice(0, limit)
      .map((p: any) => ({
        producto: p.nombre,
        upc: p.upc,
        ventas: p.ventas,
        cantidad: p.cantidad,
        transacciones: p.transacciones.size
      }))
  }
}

export default DynamicExcelReader
