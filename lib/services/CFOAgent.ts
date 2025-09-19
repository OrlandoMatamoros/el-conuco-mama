import OpenAI from 'openai'
import ConucoExcelService from './ConucoExcelService'

export class CFOAgent {
  private openai: OpenAI | null = null
  private excelService: ConucoExcelService

  constructor() {
    // Solo inicializar OpenAI si hay API key
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }
    this.excelService = new ConucoExcelService()
  }

  async analyzeData(period: string = 'mes') {
    const data = await this.excelService.getDashboardByPeriod(period)
    
    if (!this.openai) {
      // Retornar análisis simulado si no hay OpenAI configurado
      return this.getSimulatedAnalysis(data, period)
    }
    
    const prompt = `
    Como CFO Virtual de El Conuco de Mamá, analiza estos datos del período ${period}:
    
    MÉTRICAS ACTUALES:
    - Ventas: $${data.current.totalSales.toFixed(2)}
    - Gastos: $${data.current.totalExpenses.toFixed(2)}
    - Margen: ${data.current.grossMargin.toFixed(1)}%
    - Clientes: ${data.current.uniqueCustomers}
    
    COMPARACIÓN:
    - Cambio en ventas: ${data.change.salesChange.toFixed(1)}%
    - Cambio en gastos: ${data.change.expenseChange.toFixed(1)}%
    - Cambio en margen: ${data.change.marginChange.toFixed(1)}%
    
    Proporciona:
    1. Análisis ejecutivo (2-3 líneas)
    2. 3 alertas importantes
    3. 3 recomendaciones accionables
    4. Predicción para próximo período
    
    Responde en español, siendo específico y directo.
    `

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "Eres el CFO Virtual de El Conuco de Mamá, un negocio de alimentos. Proporcionas análisis financiero experto." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      return completion.choices[0].message.content
    } catch (error) {
      console.error('Error con OpenAI:', error)
      return this.getSimulatedAnalysis(data, period)
    }
  }

  async answerQuestion(question: string, period: string = 'mes') {
    const data = await this.excelService.getDashboardByPeriod(period)
    
    if (!this.openai) {
      return this.getSimulatedAnswer(question, data, period)
    }
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: `Eres el CFO Virtual de El Conuco de Mamá. Datos del período ${period}:
            Ventas: $${data.current.totalSales.toFixed(2)}
            Gastos: $${data.current.totalExpenses.toFixed(2)}
            Margen: ${data.current.grossMargin.toFixed(1)}%
            Clientes: ${data.current.uniqueCustomers}
            Cambio en ventas: ${data.change.salesChange.toFixed(1)}%
            Responde de forma clara y concisa en español.`
          },
          { role: "user", content: question }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      return completion.choices[0].message.content
    } catch (error) {
      return this.getSimulatedAnswer(question, data, period)
    }
  }

  async generateAlerts(period: string = 'mes') {
    const data = await this.excelService.getDashboardByPeriod(period)
    const alerts = []

    if (data.change.salesChange < -5) {
      alerts.push({
        type: 'critical',
        message: `⚠️ Caída de ventas del ${Math.abs(data.change.salesChange).toFixed(1)}%`,
        recommendation: 'Revisar estrategia de ventas urgentemente'
      })
    }

    if (data.change.expenseChange > 10) {
      alerts.push({
        type: 'warning',
        message: `📈 Gastos aumentaron ${data.change.expenseChange.toFixed(1)}%`,
        recommendation: 'Analizar partidas de gastos para optimización'
      })
    }

    if (data.current.grossMargin < 20) {
      alerts.push({
        type: 'critical',
        message: `💰 Margen bruto bajo: ${data.current.grossMargin.toFixed(1)}%`,
        recommendation: 'Revisar precios y costos inmediatamente'
      })
    }

    if (data.change.salesChange > 20) {
      alerts.push({
        type: 'success',
        message: `🎉 Excelente crecimiento en ventas: ${data.change.salesChange.toFixed(1)}%`,
        recommendation: 'Mantener estrategia actual y preparar inventario'
      })
    }

    return alerts
  }

  private getSimulatedAnalysis(data: any, period: string) {
    return `
    **Análisis Ejecutivo del ${period}:**
    Las ventas muestran un comportamiento ${data.change.salesChange > 0 ? 'positivo' : 'preocupante'} con un cambio del ${data.change.salesChange.toFixed(1)}%. 
    El margen bruto se mantiene en ${data.current.grossMargin.toFixed(1)}%, ${data.current.grossMargin > 25 ? 'por encima del objetivo' : 'requiere atención'}.

    **Alertas Importantes:**
    1. ${data.change.salesChange < 0 ? '🔴 Ventas en descenso' : '🟢 Ventas en crecimiento'} - Variación del ${Math.abs(data.change.salesChange).toFixed(1)}%
    2. Control de gastos: ${data.change.expenseChange > data.change.salesChange ? '⚠️ Gastos creciendo más rápido que ventas' : '✅ Gastos bajo control'}
    3. Base de clientes: ${data.current.uniqueCustomers} clientes activos

    **Recomendaciones:**
    1. ${data.change.salesChange < 5 ? 'Implementar promociones para impulsar ventas' : 'Mantener estrategia de ventas actual'}
    2. ${data.current.grossMargin < 25 ? 'Revisar estructura de costos' : 'Optimizar mix de productos'}
    3. Foco en retención: Meta de ${Math.floor(data.current.uniqueCustomers * 1.1)} clientes para próximo período

    **Predicción:**
    Basado en tendencias actuales, esperamos ventas de $${(data.current.totalSales * 1.05).toFixed(2)} para el próximo período.
    `
  }

  private getSimulatedAnswer(question: string, data: any, period: string) {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('ventas')) {
      return `Las ventas del ${period} son de $${data.current.totalSales.toFixed(2)}, representando un ${data.change.salesChange > 0 ? 'incremento' : 'descenso'} del ${Math.abs(data.change.salesChange).toFixed(1)}% respecto al período anterior.`
    }
    
    if (lowerQuestion.includes('margen') || lowerQuestion.includes('rentabilidad')) {
      return `El margen bruto actual es del ${data.current.grossMargin.toFixed(1)}%, ${data.current.grossMargin > 25 ? 'superando' : 'por debajo de'} el objetivo del 25%. ${data.change.marginChange > 0 ? 'Hemos mejorado' : 'Hay una reducción de'} ${Math.abs(data.change.marginChange).toFixed(1)} puntos porcentuales.`
    }
    
    if (lowerQuestion.includes('cliente')) {
      return `Tenemos ${data.current.uniqueCustomers} clientes únicos en el ${period}, con un ticket promedio de $${data.current.averageTicket.toFixed(2)}.`
    }
    
    if (lowerQuestion.includes('gasto')) {
      return `Los gastos del ${period} suman $${data.current.totalExpenses.toFixed(2)}, con una variación del ${data.change.expenseChange.toFixed(1)}% respecto al período anterior. ${data.change.expenseChange > 10 ? 'Es importante revisar las partidas de mayor incremento.' : 'Los gastos están bajo control.'}`
    }
    
    return `Basándome en los datos del ${period}: Ventas de $${data.current.totalSales.toFixed(2)}, margen del ${data.current.grossMargin.toFixed(1)}%, y ${data.current.uniqueCustomers} clientes activos. ¿Hay algo específico que quieras analizar?`
  }
}

export default CFOAgent
