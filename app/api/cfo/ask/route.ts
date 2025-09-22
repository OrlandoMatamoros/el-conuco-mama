import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import * as XLSX from 'xlsx'

const OPENAI_KEY = process.env.OPENAI_API_KEY

export async function POST(request: Request) {
  try {
    const { question } = await request.json()
    
    // Leer métricas del cache
    const metricsPath = path.join(process.cwd(), 'data', 'metrics-cache.json')
    const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'))
    
    // Intentar leer productos del Excel
    let topProductos = ''
    try {
      const excelPath = path.join(process.cwd(), 'data', 'Dashboard 1.1.xlsx')
      const workbook = XLSX.readFile(excelPath)
      
      if (workbook.Sheets['Items']) {
        const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items'])
        const productos: any = {}
        
        items.forEach((row: any) => {
          const nombre = row['Item']
          const venta = parseFloat(row['Sales $']) || 0
          if (nombre) {
            productos[nombre] = (productos[nombre] || 0) + venta
          }
        })
        
        const top5 = Object.entries(productos)
          .sort((a: any, b: any) => b[1] - a[1])
          .slice(0, 5)
        
        if (question.toLowerCase().includes('producto')) {
          topProductos = `\nTop 5 productos: ${top5.map(([n, v]: any) => `${n}: RD$${v.toFixed(2)}`).join(', ')}`
        }
      }
    } catch (e) {
      // Excel no disponible, usar solo cache
    }
    
    // Usar OpenAI si está configurado
    if (OPENAI_KEY && OPENAI_KEY.startsWith('sk-')) {
      const prompt = `Eres el CFO de El Conuco de Mamá.
      
DATOS REALES:
- Ventas: RD$${metrics.ventas}
- Costos: RD$${metrics.costos}
- Gastos: RD$${metrics.gastos}
- Nómina: RD$${metrics.payroll}
- Margen Neto: ${metrics.margenNeto}%
- Meta: 5%
${topProductos}

Pregunta: ${question}
Responde en 2-3 oraciones máximo con estos datos.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Responde directo y conciso.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      })

      const data = await response.json()
      if (data.choices?.[0]) {
        return NextResponse.json({
          success: true,
          response: data.choices[0].message.content
        })
      }
    }
    
    // Respuesta sin OpenAI
    return NextResponse.json({
      success: true,
      response: `Margen actual: ${metrics.margenNeto}% (Meta: 5%). Ventas: RD$${metrics.ventas}.${topProductos}`
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
