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
    
    // Leer el archivo Excel con fs primero
    const excelPath = path.join(process.cwd(), 'data', 'Dashboard_1_1.xlsx')
    const buffer = fs.readFileSync(excelPath)
    
    // Luego pasarlo a XLSX
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
    
    // Respuesta directa para producto más vendido
    if (question.toLowerCase().includes('producto')) {
      const [nombre, ventas] = top10[0]
      return NextResponse.json({
        success: true,
        response: `El producto más vendido es "${nombre}" con ventas de RD$${(ventas as number).toFixed(2)}`
      })
    }
    
    // Para otras preguntas
    const productList = top10.map(([n, v]: any, i) => 
      `${i+1}. ${n}: RD$${v.toFixed(2)}`
    ).join('\n')
    
    if (OPENAI_KEY && OPENAI_KEY.startsWith('sk-')) {
      const contexto = `Datos de El Conuco:
Ventas: RD$${metrics.ventas}
Margen: ${metrics.margenNeto}%

TOP PRODUCTOS:
${productList}

Pregunta: ${question}`

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: contexto }
          ],
          max_tokens: 150
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
      response: `Margen: ${metrics.margenNeto}%. Top producto: ${top10[0][0]}`
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message
    })
  }
}
