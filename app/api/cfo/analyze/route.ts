import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import * as XLSX from 'xlsx'

export async function POST(request: Request) {
  try {
    const { question } = await request.json()
    
    // Cargar métricas del cache
    const metricsPath = path.join(process.cwd(), 'data', 'metrics-cache.json')
    const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'))
    
    // Cargar Excel para análisis detallado
    const excelPath = path.join(process.cwd(), 'data', 'Dashboard 1.1.xlsx')
    const workbook = XLSX.readFile(excelPath)
    
    // Análisis de productos
    if (question.toLowerCase().includes('producto')) {
      const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items'])
      const productos: any = {}
      
      items.forEach((item: any) => {
        const name = item['Item'] || 'Sin nombre'
        if (!productos[name]) {
          productos[name] = { ventas: 0, cantidad: 0 }
        }
        productos[name].ventas += parseFloat(item['Sales $']) || 0
        productos[name].cantidad += 1
      })
      
      const top5 = Object.entries(productos)
        .sort((a: any, b: any) => b[1].ventas - a[1].ventas)
        .slice(0, 5)
      
      const response = `Top 5 productos más vendidos:
${top5.map((p: any, i: number) => 
  `${i + 1}. ${p[0]}: RD$${p[1].ventas.toFixed(2)} (${p[1].cantidad} transacciones)`
).join('\n')}`
      
      return NextResponse.json({ success: true, response })
    }
    
    // Respuesta genérica
    return NextResponse.json({
      success: true,
      response: `Análisis: Ventas totales RD$${metrics.ventas.toFixed(2)}, Margen ${metrics.margenBruto}%`
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
