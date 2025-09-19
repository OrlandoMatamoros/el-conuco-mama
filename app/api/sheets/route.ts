import { NextResponse } from 'next/server'
import GoogleSheetsService from '@/lib/services/googleSheets'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const periodo = searchParams.get('periodo') || 'actual'
  
  try {
    const service = new GoogleSheetsService()
    const data = await service.getDashboardData(periodo)
    
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error al obtener datos',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
