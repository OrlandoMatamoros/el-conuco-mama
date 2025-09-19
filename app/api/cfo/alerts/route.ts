import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get('period') || 'mes'
  
  // Generar alertas basadas en el período
  const alerts = [
    {
      type: 'success',
      message: '🎉 Ventas aumentaron 8.3% en el período',
      recommendation: 'Mantener estrategia actual y preparar inventario adicional'
    },
    {
      type: 'warning',
      message: '⚠️ Margen bruto en 27%, cerca del límite mínimo',
      recommendation: 'Revisar costos de proveedores y optimizar precios'
    }
  ]
  
  // Agregar alerta crítica aleatoria para demostración
  if (Math.random() > 0.5) {
    alerts.push({
      type: 'critical',
      message: '🔴 Inventario bajo en productos cárnicos',
      recommendation: 'Contactar proveedores urgentemente'
    })
  }
  
  return NextResponse.json({
    success: true,
    alerts,
    timestamp: new Date().toISOString()
  })
}
