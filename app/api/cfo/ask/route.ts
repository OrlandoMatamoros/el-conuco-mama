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
    
    // Leer el archivo Excel
    const excelPath = path.join(process.cwd(), 'data', 'Dashboard_1_1.xlsx')
    const buffer = fs.readFileSync(excelPath)
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items'])
    
    // Procesar productos
    const productos: any = {}
    items.forEach((row: any) => {
      const nombre = row['Item']
      const venta = parseFloat(row['Sales $']) || 0
      if (nombre && venta > 0) {
        productos[nombre] = (productos[nombre] || 0) + venta
      }
    })
    
    const top10 = Object.entries(productos)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 10)
    
    // Calcular proyecciones
    const diasTranscurridos = 262
    const diasAnio = 365
    const ventasDiarias = metrics.ventas / diasTranscurridos
    const proyeccionAnual = ventasDiarias * diasAnio
    
    // Respuestas directas para preguntas comunes
    const q = question.toLowerCase()
    
    if (q.includes('producto') && q.includes('vendido')) {
      const [nombre, ventas] = top10[0]
      return NextResponse.json({
        success: true,
        response: `El producto más vendido es "${nombre}" con ventas de $${(ventas as number).toFixed(2)}`
      })
    }
    
    if (q.includes('margen') || q.includes('rentabilidad')) {
      return NextResponse.json({
        success: true,
        response: `Tu margen de rentabilidad actual es ${metrics.margenNeto}%, por debajo de la meta del 5%. Tienes $${metrics.utilidad.toFixed(2)} de utilidad sobre $${metrics.ventas.toFixed(2)} en ventas.`
      })
    }
    
    if (q.includes('proyección') || q.includes('anual')) {
      return NextResponse.json({
        success: true,
        response: `Proyección anual basada en tendencia actual: $${proyeccionAnual.toFixed(2)}. Esto se basa en ventas diarias promedio de $${ventasDiarias.toFixed(2)} proyectadas a 365 días.`
      })
    }
    
    // Para otras preguntas usar OpenAI
    if (OPENAI_KEY && OPENAI_KEY.startsWith('sk-')) {
      const contexto = `Eres el CFO de El Conuco de Mamá. RESPONDE DIRECTO Y BREVE. USA $ PARA DÓLARES.

DATOS REALES (en USD):
- Ventas YTD: $${metrics.ventas.toFixed(2)}
- Utilidad: $${metrics.utilidad.toFixed(2)}
- Margen: ${metrics.margenNeto}% (Meta: 5%)
- Ventas diarias: $${ventasDiarias.toFixed(2)}
- Proyección anual: $${proyeccionAnual.toFixed(2)}

TOP 5 PRODUCTOS:
${top10.slice(0, 5).map(([n, v]: any, i) => 
  `${i+1}. ${n}: $${v.toFixed(2)}`
).join('\n')}

Pregunta: ${question}

IMPORTANTE: Usa $ para dólares, no RD$. Responde en 1-2 oraciones con los datos exactos.`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Responde con los datos en dólares USD. Usa $ no RD$.' },
            { role: 'user', content: contexto }
          ],
          max_tokens: 100,
          temperature: 0.1
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
    
    return NextResponse.json({
      success: true,
      response: `Ventas: $${metrics.ventas.toFixed(2)}, Margen: ${metrics.margenNeto}%`
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message
    })
  }
}
