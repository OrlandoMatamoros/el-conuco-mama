import { NextResponse } from 'next/server'

export async function GET() {
  // Aqui conectaremos con tu Excel
  // Por ahora datos de ejemplo
  
  const dashboardData = {
    kpis: {
      ventas: 245678.50,
      gastos: 184567.25,
      margen: 24.9,
      clientes: 234
    },
    ventasPorMes: [
      { mes: 'Ene', ventas: 18000 },
      { mes: 'Feb', ventas: 19500 },
      { mes: 'Mar', ventas: 21000 }
    ]
  }
  
  return NextResponse.json(dashboardData)
}
