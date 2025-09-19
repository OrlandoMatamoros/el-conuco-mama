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

export class ConucoExcelService {
  private shareLink: string
  private cachedData: any = null
  private lastFetch: Date | null = null
  private cacheTimeout = 5 * 60 * 1000 // 5 minutos

  constructor() {
    this.shareLink = process.env.EXCEL_SHARE_LINK || 'https://1drv.ms/x/c/0b981e5c9846900f/EXZjG-TaMTRNh8FYnfm0o6sB90Ca2PYnHc7H22fWGNohZA'
  }

  async getDashboardByPeriod(period: string = 'mes'): Promise<PeriodComparison> {
    try {
      // Por ahora usamos datos simulados mientras configuramos el acceso real
      // En producción, aquí se conectaría con OneDrive API
      return this.getSimulatedData(period)
    } catch (error) {
      console.error('Error obteniendo datos:', error)
      return this.getSimulatedData(period)
    }
  }

  private getSimulatedData(period: string): PeriodComparison {
    // Datos base que varían según el período
    const periodMultipliers = {
      'dia': { current: 1.0, previous: 0.95, variance: 0.1 },
      'semana': { current: 7.0, previous: 6.8, variance: 0.15 },
      'mes': { current: 30.0, previous: 29.0, variance: 0.2 },
      'trimestre': { current: 90.0, previous: 87.0, variance: 0.25 },
      'año': { current: 365.0, previous: 350.0, variance: 0.3 }
    }

    const multiplier = periodMultipliers[period] || periodMultipliers['mes']
    const baseDaily = 8000 // Ventas diarias base

    const current: DashboardMetrics = {
      totalSales: baseDaily * multiplier.current * (1 + Math.random() * multiplier.variance),
      totalExpenses: baseDaily * multiplier.current * 0.75 * (1 + Math.random() * multiplier.variance),
      grossMargin: 24.9 + Math.random() * 5,
      netProfit: baseDaily * multiplier.current * 0.25,
      uniqueCustomers: Math.floor(15 * multiplier.current),
      averageTicket: 1989.75 + Math.random() * 500,
      productsSold: Math.floor(250 * multiplier.current),
      salesGrowth: 15.3 + Math.random() * 10 - 5,
      expenseGrowth: 8.7 + Math.random() * 8 - 4,
      marginGrowth: 2.1 + Math.random() * 3 - 1.5
    }

    const previous: DashboardMetrics = {
      totalSales: baseDaily * multiplier.previous,
      totalExpenses: baseDaily * multiplier.previous * 0.78,
      grossMargin: 22.8,
      netProfit: baseDaily * multiplier.previous * 0.22,
      uniqueCustomers: Math.floor(14 * multiplier.previous),
      averageTicket: 1850.50,
      productsSold: Math.floor(240 * multiplier.previous),
      salesGrowth: 12.1,
      expenseGrowth: 7.2,
      marginGrowth: 1.5
    }

    const change = {
      salesChange: ((current.totalSales - previous.totalSales) / previous.totalSales) * 100,
      expenseChange: ((current.totalExpenses - previous.totalExpenses) / previous.totalExpenses) * 100,
      marginChange: current.grossMargin - previous.grossMargin,
      percentageChange: ((current.netProfit - previous.netProfit) / previous.netProfit) * 100
    }

    return { current, previous, change }
  }

  async getSourceTables() {
    // Retornar estructura de tablas simuladas
    return {
      ventas: [],
      costos: [],
      productos: [],
      clientes: []
    }
  }

  async refreshData() {
    this.cachedData = null
    this.lastFetch = null
    return true
  }
}

export default ConucoExcelService
