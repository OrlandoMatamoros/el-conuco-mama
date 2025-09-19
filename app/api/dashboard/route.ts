import { NextRequest, NextResponse } from 'next/server';
import ConucoExcelService from '@/lib/services/ConucoExcelService';

const service = new ConucoExcelService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period1 = searchParams.get('period1') || 'mesActual';
    const period2 = searchParams.get('period2') || 'mesAnterior';
    
    const data = await service.getDataByPeriod(period1, period2);
    
    return NextResponse.json({
      success: true,
      data,
      periods: { period1, period2 },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error obteniendo datos'
      },
      { status: 500 }
    );
  }
}
