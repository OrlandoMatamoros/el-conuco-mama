import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Por ahora datos fijos para probar
    return NextResponse.json({
      success: true,
      data: {
        ventas: 525342.54,
        gastos: 62383.00,
        utilidad: 462959.54,
        margen: 88.13
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error al obtener datos'
    })
  }
}
