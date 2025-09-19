import { google } from 'googleapis'

const SPREADSHEET_ID = '1tGGevUx3b2xYcsVSum8mmbLC55XfM4QA'

export interface DashboardData {
  ventas: number
  gastos: number
  margen: number
  productos: any[]
  periodos: string[]
  comparativas: any
}

export class GoogleSheetsService {
  private sheets: any
  
  constructor() {
    // Configuración para acceso público (solo lectura)
    this.sheets = google.sheets({
      version: 'v4',
      auth: process.env.GOOGLE_API_KEY
    })
  }
  
  async getDashboardData(periodo?: string): Promise<DashboardData> {
    try {
      // Leer datos del Dashboard
      const response = await this.sheets.spreadsheets.values.batchGet({
        spreadsheetId: SPREADSHEET_ID,
        ranges: [
          'Dashboard!A1:Z100',  // Rango principal
          'Datos!A:Z',          // Datos fuente
        ]
      })
      
      const dashboardRange = response.data.valueRanges[0].values
      const datosRange = response.data.valueRanges[1].values
      
      // Procesar datos según el período seleccionado
      return this.processData(dashboardRange, datosRange, periodo)
    } catch (error) {
      console.error('Error leyendo Google Sheets:', error)
      return this.getMockData() // Datos de respaldo
    }
  }
  
  private processData(dashboard: any[], datos: any[], periodo?: string): DashboardData {
    // Aquí procesamos los datos según el período
    return {
      ventas: this.extractValue(dashboard, 'B2') || 0,
      gastos: this.extractValue(dashboard, 'B3') || 0,
      margen: this.extractValue(dashboard, 'B4') || 0,
      productos: this.extractProducts(datos),
      periodos: this.extractPeriods(datos),
      comparativas: this.calculateComparisons(datos, periodo)
    }
  }
  
  private extractValue(data: any[], cell: string): number {
    // Convertir notación de celda a índices
    const col = cell.charCodeAt(0) - 65
    const row = parseInt(cell.slice(1)) - 1
    return parseFloat(data[row]?.[col] || 0)
  }
  
  private extractProducts(data: any[]): any[] {
    // Extraer lista de productos
    return data.slice(1).map(row => ({
      nombre: row[0],
      ventas: parseFloat(row[1] || 0),
      unidades: parseInt(row[2] || 0),
      margen: parseFloat(row[3] || 0)
    }))
  }
  
  private extractPeriods(data: any[]): string[] {
    // Extraer períodos únicos
    const periods = new Set<string>()
    data.slice(1).forEach(row => {
      if (row[4]) periods.add(row[4]) // Columna de fecha/período
    })
    return Array.from(periods).sort()
  }
  
  private calculateComparisons(data: any[], periodo?: string): any {
    // Calcular comparativas entre períodos
    return {
      variacion: 0,
      tendencia: 'stable',
      proyeccion: 0
    }
  }
  
  private getMockData(): DashboardData {
    // Datos de respaldo si falla la conexión
    return {
      ventas: 245678.50,
      gastos: 184567.25,
      margen: 24.9,
      productos: [],
      periodos: ['Enero', 'Febrero', 'Marzo'],
      comparativas: {
        variacion: 15.3,
        tendencia: 'up',
        proyeccion: 280000
      }
    }
  }
}

export default GoogleSheetsService
