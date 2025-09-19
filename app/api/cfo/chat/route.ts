import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { question, period } = await request.json()
  
  // Respuestas simuladas basadas en palabras clave
  let answer = ''
  
  const lowerQuestion = question.toLowerCase()
  
  if (lowerQuestion.includes('ventas')) {
    answer = `Las ventas del ${period} actual son de $256,789.50, mostrando un incremento del 8.3% respecto al período anterior ($237,034.75). Este crecimiento se debe principalmente al aumento en la base de clientes y el ticket promedio.`
  } else if (lowerQuestion.includes('margen')) {
    answer = `El margen bruto actual es del 27.0%, una mejora de 2.9 puntos porcentuales respecto al período anterior (24.1%). Aunque positivo, recomiendo mantener vigilancia ya que estamos cerca del objetivo mínimo del 25%.`
  } else if (lowerQuestion.includes('gastos')) {
    answer = `Los gastos del ${period} suman $187,356.25, un aumento del 4.1% respecto al período anterior. El incremento está controlado y es proporcional al crecimiento en ventas. Principales partidas: inventario (65%), personal (20%), operativos (15%).`
  } else if (lowerQuestion.includes('cliente')) {
    answer = `Tenemos 892 clientes únicos en el ${period}, un aumento de 69 clientes (8.4%) respecto al período anterior. El ticket promedio es de $287.88. Recomiendo implementar programa de fidelización para mantener este crecimiento.`
  } else {
    answer = `Basándome en los datos del ${period}: Las ventas están en $256,789.50 (+8.3%), con un margen del 27% y 892 clientes activos. Los indicadores son positivos. ¿Hay algo específico que te gustaría analizar en detalle?`
  }
  
  return NextResponse.json({
    success: true,
    answer,
    timestamp: new Date().toISOString()
  })
}
