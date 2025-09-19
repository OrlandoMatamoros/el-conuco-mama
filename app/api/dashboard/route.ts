import { NextRequest, NextResponse } from 'next/server'
import ExcelOneDriveService from '@/lib/services/ExcelOneDriveService'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'mes'
    
    const excelService = new ExcelOneDriveService()
    const data = await excelService.getDashboardByPeriod(period)
    
    return NextResponse.json({
      success: true,
      period,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error en API dashboard:', error)
    return NextResponse.json(
      { success: false, error: 'Error obteniendo datos' },
      { status: 500 }
    )
  }
}

// Endpoint para actualización desde n8n
export async function POST(request: NextRequest) {
  try {
    const excelService = new ExcelOneDriveService()
    await excelService.refreshData()
    
    return NextResponse.json({
      success: true,
      message: 'Datos actualizados correctamente',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error actualizando datos' },
      { status: 500 }
    )
  }
}
