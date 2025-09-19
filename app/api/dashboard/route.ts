import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get('period') || 'mes'
  
  // Datos reales simulados que cambian según el período
  const periodData = {
    'dia': {
      current: { 
        totalSales: 8543.25, 
        totalExpenses: 6234.18,
        grossMargin: 27.0,
        uniqueCustomers: 45 
      },
      previous: { 
        totalSales: 7892.50, 
        totalExpenses: 5987.25,
        grossMargin: 24.1,
        uniqueCustomers: 42 
      }
    },
    'semana': {
      current: { 
        totalSales: 59802.75, 
        totalExpenses: 43638.26,
        grossMargin: 27.0,
        uniqueCustomers: 234 
      },
      previous: { 
        totalSales: 55247.50, 
        totalExpenses: 41910.25,
        grossMargin: 24.1,
        uniqueCustomers: 215 
      }
    },
    'mes': {
      current: { 
        totalSales: 256789.50, 
        totalExpenses: 187356.25,
        grossMargin: 27.0,
        uniqueCustomers: 892 
      },
      previous: { 
        totalSales: 237034.75, 
        totalExpenses: 179866.50,
        grossMargin: 24.1,
        uniqueCustomers: 823 
      }
    }
  }

  const data = periodData[period] || periodData['mes']
  
  const change = {
    salesChange: ((data.current.totalSales - data.previous.totalSales) / data.previous.totalSales) * 100,
    expenseChange: ((data.current.totalExpenses - data.previous.totalExpenses) / data.previous.totalExpenses) * 100,
    marginChange: data.current.grossMargin - data.previous.grossMargin,
    percentageChange: ((data.current.totalSales - data.current.totalExpenses - (data.previous.totalSales - data.previous.totalExpenses)) / (data.previous.totalSales - data.previous.totalExpenses)) * 100
  }

  return NextResponse.json({
    success: true,
    period,
    data: {
      current: data.current,
      previous: data.previous,
      change
    }
  })
}
