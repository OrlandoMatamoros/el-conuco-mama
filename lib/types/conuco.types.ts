export interface SalesData {
  Date: string
  Department: string
  UPC: string
  Item: string
  Baskets: number
  Items: number
  'Sales$': number
}

export interface InventoryData {
  UPC: string
  Item: string
  Department: string
  Quantity: number
  Cost: number
}

export interface ExpenseData {
  Fecha: string
  Concepto: string
  Valor: number
}

export interface PayrollData {
  Fecha: string
  Empleado: string
  Cargo: string
  Horas: number
  Sueldo: number
}

export interface DashboardMetrics {
  sales: {
    total: number
    byDepartment: Record<string, number>
    byDate: Record<string, number>
    trend: number
  }
  inventory: {
    totalValue: number
    itemCount: number
    turnoverRate: number
  }
  expenses: {
    total: number
    byCategory: Record<string, number>
    trend: number
  }
  payroll: {
    total: number
    byEmployee: Record<string, number>
    avgHours: number
  }
  kpis: {
    grossMargin: number
    netProfit: number
    netMargin: number
    salesGrowth: number
  }
}

export interface Period {
  start: Date
  end: Date
  label: string
  type: 'day' | 'week' | 'month' | 'quarter' | 'year'
}
