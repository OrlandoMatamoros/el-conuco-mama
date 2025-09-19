import { Client } from '@microsoft/microsoft-graph-client'
import { ClientSecretCredential } from '@azure/identity'
import * as XLSX from 'xlsx'

interface DashboardMetrics {
  totalSales: number
  totalExpenses: number
  grossMargin: number
  netProfit: number
  uniqueCustomers: number
  averageTicket: number
  productsSold: number
  salesGrowth: number
  expenseGrowth: number
  marginGrowth: number
}

interface PeriodComparison {
  current: DashboardMetrics
  previous: DashboardMetrics
  change: {
    salesChange: number
    expenseChange: number
    marginChange: number
    percentageChange: number
  }
}

export class ExcelOneDriveService {
  private graphClient: Client
  private fileId: string
  private cachedData: any = null
  private lastFetch: Date | null = null
  private cacheTimeout = 5 * 60 * 1000 // 5 minutos

  constructor() {
    this.fileId = process.env.ONEDRIVE_FILE_ID || '01IZA7GDMMR5S3UQZJAFFZMMGPS7WNVDK7'
    
    // Configurar autenticación
    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID!,
      process.env.AZURE_CLIENT_ID!,
      process.env.AZURE_CLIENT_SECRET!
    )

    this.graphClient = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => {
          const token = await credential.getToken('https://graph.microsoft.com/.default')
          return token?.token || ''
        }
      }
    })
  }

  // Obtener workbook completo con caché
  private async getWorkbook() {
    // Verificar caché
    if (this.cachedData && this.lastFetch) {
      const now = new Date()
      if (now.getTime() - this.lastFetch.getTime() < this.cacheTimeout) {
        return this.cachedData
      }
    }

    try {
      // Descargar archivo de OneDrive
      const response = await this.graphClient
        .api(`/drives/drive/items/${this.fileId}/content`)
        .get()

      // Parsear con xlsx
      const workbook = XLSX.read(response, { type: 'buffer' })
      
      this.cachedData = workbook
      this.lastFetch = new Date()
      
      return workbook
    } catch (error) {
      console.error('Error obteniendo Excel de OneDrive:', error)
      throw error
    }
  }

  // Obtener datos según período seleccionado
  async getDashboardByPeriod(period: string = 'mes'): Promise<PeriodComparison> {
    try {
      const workbook = await this.getWorkbook()
      
      // Hoja 1: Dashboard visual
      const dashboardSheet = workbook.Sheets['Dashboard']
      
      // Mapear celdas según período
      const periodMappings = {
        'dia': { current: 'B', previous: 'C', row_start: 5, row_end: 20 },
        'semana': { current: 'D', previous: 'E', row_start: 5, row_end: 20 },
        'mes': { current: 'F', previous: 'G', row_start: 5, row_end: 20 },
        'trimestre': { current: 'H', previous: 'I', row_start: 5, row_end: 20 },
        'año': { current: 'J', previous: 'K', row_start: 5, row_end: 20 }
      }

      const mapping = periodMappings[period] || periodMappings['mes']
      
      // Extraer métricas actuales
      const current = this.extractMetricsFromColumn(dashboardSheet, mapping.current, mapping.row_start, mapping.row_end)
      
      // Extraer métricas anteriores
      const previous = this.extractMetricsFromColumn(dashboardSheet, mapping.previous, mapping.row_start, mapping.row_end)
      
      // Calcular cambios
      const change = {
        salesChange: ((current.totalSales - previous.totalSales) / previous.totalSales) * 100,
        expenseChange: ((current.totalExpenses - previous.totalExpenses) / previous.totalExpenses) * 100,
        marginChange: current.grossMargin - previous.grossMargin,
        percentageChange: ((current.netProfit - previous.netProfit) / previous.netProfit) * 100
      }

      return { current, previous, change }
    } catch (error) {
      console.error('Error procesando dashboard:', error)
      // Retornar datos mock si falla
      return this.getMockData(period)
    }
  }

  // Extraer métricas de una columna específica
  private extractMetricsFromColumn(sheet: any, column: string, startRow: number, endRow: number): DashboardMetrics {
    // Mapeo de filas a métricas (ajustar según tu Excel real)
    const cellValue = (row: number) => {
      const cell = sheet[`${column}${row}`]
      return cell ? (cell.v || 0) : 0
    }

    return {
      totalSales: cellValue(5),
      totalExpenses: cellValue(7),
      grossMargin: cellValue(9),
      netProfit: cellValue(11),
      uniqueCustomers: cellValue(13),
      averageTicket: cellValue(15),
      productsSold: cellValue(17),
      salesGrowth: cellValue(18),
      expenseGrowth: cellValue(19),
      marginGrowth: cellValue(20)
    }
  }

  // Obtener tablas fuente de datos
  async getSourceTables() {
    try {
      const workbook = await this.getWorkbook()
      
      // Extraer cada hoja de datos
      const tables = {
        ventas: XLSX.utils.sheet_to_json(workbook.Sheets['Ventas'] || workbook.Sheets['Sheet3']),
        costos: XLSX.utils.sheet_to_json(workbook.Sheets['Costos'] || workbook.Sheets['Sheet4']),
        productos: XLSX.utils.sheet_to_json(workbook.Sheets['Productos'] || workbook.Sheets['Sheet5']),
        clientes: XLSX.utils.sheet_to_json(workbook.Sheets['Clientes'] || workbook.Sheets['Sheet6'])
      }

      return tables
    } catch (error) {
      console.error('Error obteniendo tablas fuente:', error)
      return null
    }
  }

  // Obtener métricas DAX de Hoja 2
  async getDAXMetrics() {
    try {
      const workbook = await this.getWorkbook()
      const metricsSheet = workbook.Sheets['Metrics'] || workbook.Sheets['Sheet2']
      
      return XLSX.utils.sheet_to_json(metricsSheet)
    } catch (error) {
      console.error('Error obteniendo métricas DAX:', error)
      return null
    }
  }

  // Mock data para desarrollo
  private getMockData(period: string): PeriodComparison {
    const base = 245678.50
    return {
      current: {
        totalSales: base * 1.15,
        totalExpenses: base * 0.75,
        grossMargin: 24.9,
        netProfit: base * 0.35,
        uniqueCustomers: 234,
        averageTicket: 1989.75,
        productsSold: 8567,
        salesGrowth: 15.3,
        expenseGrowth: 8.7,
        marginGrowth: 2.1
      },
      previous: {
        totalSales: base,
        totalExpenses: base * 0.7,
        grossMargin: 22.8,
        netProfit: base * 0.3,
        uniqueCustomers: 215,
        averageTicket: 1850.50,
        productsSold: 7890,
        salesGrowth: 12.1,
        expenseGrowth: 7.2,
        marginGrowth: 1.5
      },
      change: {
        salesChange: 15,
        expenseChange: 7.1,
        marginChange: 2.1,
        percentageChange: 16.7
      }
    }
  }

  // Actualizar datos (llamado desde n8n)
  async refreshData() {
    this.cachedData = null
    this.lastFetch = null
    return await this.getWorkbook()
  }
}

export default ExcelOneDriveService
