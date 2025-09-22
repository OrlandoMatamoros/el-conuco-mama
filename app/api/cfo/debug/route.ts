import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    const excelPath = path.join(process.cwd(), 'data', 'Dashboard 1.1.xlsx')
    const exists = fs.existsSync(excelPath)
    
    if (!exists) {
      return NextResponse.json({ error: 'Excel no existe', path: excelPath })
    }
    
    const workbook = XLSX.readFile(excelPath)
    const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items'])
    
    const productos: any = {}
    items.forEach((row: any) => {
      const nombre = row['Item']
      const venta = parseFloat(row['Sales $']) || 0
      if (nombre && venta > 0) {
        productos[nombre] = (productos[nombre] || 0) + venta
      }
    })
    
    const top5 = Object.entries(productos)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 5)
    
    return NextResponse.json({
      success: true,
      totalProductos: Object.keys(productos).length,
      top5: top5.map(([n, v]: any) => ({ producto: n, ventas: v })),
      primeraFila: items[0]
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}
