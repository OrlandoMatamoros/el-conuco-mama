import * as XLSX from 'xlsx'
import * as fs from 'fs'

export class CompleteExcelReader {
  private workbook: any = null
  
  private loadExcel() {
    const excelPath = '/mnt/user-data/uploads/Dashboard_1_1.xlsx'
    
    if (fs.existsSync(excelPath)) {
      this.workbook = XLSX.readFile(excelPath)
      console.log('Excel cargado. Hojas disponibles:', this.workbook.SheetNames)
      return true
    }
    console.error('Excel no encontrado en:', excelPath)
    return false
  }
  
  // ========== HOJA ITEMS (VENTAS) ==========
  getItemsData() {
    this.loadExcel()
    if (!this.workbook) return []
    
    const itemsSheet = this.workbook.Sheets['Items']
    if (!itemsSheet) {
      console.log('No se encontró hoja Items')
      return []
    }
    
    return XLSX.utils.sheet_to_json(itemsSheet)
  }
  
  calculateTotalSales() {
    const items = this.getItemsData()
    let total = 0
    
    items.forEach((row: any) => {
      const sale = parseFloat(row['Sales $']) || 0
      total += sale
    })
    
    console.log(`Total Ventas calculado: $${total}`)
    return total
  }
  
  // ========== HOJA GASTOS ==========
  getGastosData() {
    this.loadExcel()
    if (!this.workbook) return []
    
    const gastosSheet = this.workbook.Sheets['Gastos']
    if (!gastosSheet) {
      console.log('No se encontró hoja Gastos')
      return []
    }
    
    return XLSX.utils.sheet_to_json(gastosSheet)
  }
  
  calculateTotalGastos() {
    const gastos = this.getGastosData()
    let total = 0
    
    gastos.forEach((row: any) => {
      // Columna C es "Valor"
      const valor = parseFloat(row['Valor']) || 0
      total += valor
    })
    
    console.log(`Total Gastos calculado: $${total}`)
    return total
  }
  
  getGastosByPeriod(period: string) {
    const gastos = this.getGastosData()
    const today = new Date()
    
    const filtered = gastos.filter((row: any) => {
      if (!row['Fecha']) return false
      
      const rowDate = new Date(row['Fecha'])
      
      switch(period) {
        case 'dia':
          return rowDate.toDateString() === today.toDateString()
          
        case 'semana':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return rowDate >= weekAgo && rowDate <= today
          
        case 'mes':
          return rowDate.getMonth() === today.getMonth() && 
                 rowDate.getFullYear() === today.getFullYear()
                 
        case 'trimestre':
          const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)
          return rowDate >= quarterStart && rowDate <= today
          
        case 'año':
          return rowDate.getFullYear() === today.getFullYear()
          
        default:
          return true
      }
    })
    
    // Calcular total del período y agrupar por concepto
    let totalGastos = 0
    const conceptos: any = {}
    
    filtered.forEach((row: any) => {
      const valor = parseFloat(row['Valor']) || 0
      const concepto = row['Concepto'] || 'Sin concepto'
      
      totalGastos += valor
      
      if (!conceptos[concepto]) {
        conceptos[concepto] = 0
      }
      conceptos[concepto] += valor
    })
    
    return {
      totalGastos,
      cantidadGastos: filtered.length,
      conceptos,
      periodo: period
    }
  }
  
  getGastosByConcepto() {
    const gastos = this.getGastosData()
    const conceptos: any = {}
    
    gastos.forEach((row: any) => {
      const concepto = row['Concepto'] || 'Sin concepto'
      const valor = parseFloat(row['Valor']) || 0
      
      if (!conceptos[concepto]) {
        conceptos[concepto] = {
          total: 0,
          cantidad: 0,
          fechas: []
        }
      }
      
      conceptos[concepto].total += valor
      conceptos[concepto].cantidad += 1
      if (row['Fecha']) {
        conceptos[concepto].fechas.push(row['Fecha'])
      }
    })
    
    // Convertir a array ordenado por total
    return Object.entries(conceptos)
      .map(([nombre, data]: [string, any]) => ({
        concepto: nombre,
        total: data.total,
        cantidad: data.cantidad,
        promedio: data.total / data.cantidad,
        ultimaFecha: data.fechas[data.fechas.length - 1] || null
      }))
      .sort((a, b) => b.total - a.total)
  }
  
  // ========== MÉTRICAS CONSOLIDADAS ==========
  getConsolidatedMetrics(period: string) {
    // Ventas
    const ventasPeriod = this.getSalesByPeriod(period)
    
    // Gastos
    const gastosPeriod = this.getGastosByPeriod(period)
    
    // Calcular utilidad y márgenes
    const utilidadBruta = ventasPeriod.totalSales - gastosPeriod.totalGastos
    const margenBruto = ventasPeriod.totalSales > 0 
      ? ((utilidadBruta / ventasPeriod.totalSales) * 100).toFixed(2)
      : 0
    
    return {
      periodo: period,
      ventas: {
        total: ventasPeriod.totalSales,
        transacciones: ventasPeriod.itemCount,
        departamentos: ventasPeriod.departments
      },
      gastos: {
        total: gastosPeriod.totalGastos,
        cantidad: gastosPeriod.cantidadGastos,
        conceptos: gastosPeriod.conceptos
      },
      utilidad: {
        bruta: utilidadBruta,
        margen: margenBruto
      },
      timestamp: new Date().toISOString()
    }
  }
  
  // Método auxiliar de getSalesByPeriod (copiado del anterior)
  getSalesByPeriod(period: string) {
    const items = this.getItemsData()
    const today = new Date()
    
    const filtered = items.filter((row: any) => {
      if (!row['Date']) return false
      
      const rowDate = new Date(row['Date'])
      
      switch(period) {
        case 'dia':
          return rowDate.toDateString() === today.toDateString()
        case 'semana':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          return rowDate >= weekAgo && rowDate <= today
        case 'mes':
          return rowDate.getMonth() === today.getMonth() && 
                 rowDate.getFullYear() === today.getFullYear()
        case 'trimestre':
          const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1)
          return rowDate >= quarterStart && rowDate <= today
        case 'año':
          return rowDate.getFullYear() === today.getFullYear()
        default:
          return true
      }
    })
    
    let totalSales = 0
    let departments: any = {}
    
    filtered.forEach((row: any) => {
      const sale = parseFloat(row['Sales $']) || 0
      totalSales += sale
      
      const dept = row['Department'] || 'General'
      if (!departments[dept]) {
        departments[dept] = 0
      }
      departments[dept] += sale
    })
    
    return {
      totalSales,
      itemCount: filtered.length,
      departments,
      period
    }
  }
}

export default CompleteExcelReader
