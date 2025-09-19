import * as XLSX from 'xlsx'
import { EXCEL_PATH, checkExcelExists } from './ExcelConfig'

export class RealDataReader {
  private workbook: any = null
  
  loadExcel() {
    if (!checkExcelExists()) {
      console.log('Usando datos de ejemplo porque no se encontró el Excel')
      return false
    }
    
    try {
      this.workbook = XLSX.readFile(EXCEL_PATH)
      console.log('Excel cargado. Hojas:', this.workbook.SheetNames)
      return true
    } catch (error) {
      console.error('Error leyendo Excel:', error)
      return false
    }
  }
  
  getItemsData() {
    if (!this.loadExcel()) return []
    
    const itemsSheet = this.workbook.Sheets['Items']
    if (!itemsSheet) {
      console.log('No se encontró hoja Items')
      return []
    }
    
    return XLSX.utils.sheet_to_json(itemsSheet)
  }
  
  calculateRealSales() {
    const items = this.getItemsData()
    let total = 0
    
    items.forEach((row: any) => {
      const sale = parseFloat(row['Sales $']) || 0
      total += sale
    })
    
    return total
  }
  
  getGastosData() {
    if (!this.loadExcel()) return []
    
    const gastosSheet = this.workbook.Sheets['Gastos']
    if (!gastosSheet) {
      console.log('No se encontró hoja Gastos')
      return []
    }
    
    return XLSX.utils.sheet_to_json(gastosSheet)
  }
  
  calculateRealGastos() {
    const gastos = this.getGastosData()
    let total = 0
    
    gastos.forEach((row: any) => {
      const valor = parseFloat(row['Valor']) || 0
      total += valor
    })
    
    return total
  }
  
  getRealMetrics() {
    const ventas = this.calculateRealSales()
    const gastos = this.calculateRealGastos()
    
    return {
      ventas,
      gastos,
      utilidadBruta: ventas - gastos,
      margenBruto: ventas > 0 ? ((ventas - gastos) / ventas * 100) : 0,
      items: this.getItemsData().length,
      gastosCount: this.getGastosData().length
    }
  }
}

export default RealDataReader
