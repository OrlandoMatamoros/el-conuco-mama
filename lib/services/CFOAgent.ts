import OpenAI from 'openai'
import ExcelOneDriveService from './ExcelOneDriveService'

export class CFOAgent {
  private openai: OpenAI
  private excelService: ExcelOneDriveService

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
    this.excelService = new ExcelOneDriveService()
  }

  // Analizar datos y generar insights
  async analyzeData(period: string = 'mes') {
    const data = await this.excelService.getDashboardByPeriod(period)
    const sourceTables = await this.excelService.getSourceTables()
    
    const prompt = `
    Como CFO Virtual de El Conuco de Mamá, analiza estos datos del período ${period}:
    
    MÉTRICAS ACTUALES:
    - Ventas: $${data.current.totalSales}
    - Gastos: $${data.current.totalExpenses}
    - Margen: ${data.current.grossMargin}%
    - Clientes: ${data.current.uniqueCustomers}
    
    COMPARACIÓN:
    - Cambio en ventas: ${data.change.salesChange}%
    - Cambio en gastos: ${data.change.expenseChange}%
    - Cambio en margen: ${data.change.marginChange}%
    
    Proporciona:
    1. Análisis ejecutivo (2-3 líneas)
    2. 3 alertas importantes
    3. 3 recomendaciones accionables
    4. Predicción para próximo período
    
    Responde en español, siendo específico y directo.
    `

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Eres el CFO Virtual de El Conuco de Mamá, un negocio de alimentos. Proporcionas análisis financiero experto, identificas tendencias y das recomendaciones accionables." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    return completion.choices[0].message.content
  }

  // Responder preguntas específicas
  async answerQuestion(question: string, period: string = 'mes') {
    const data = await this.excelService.getDashboardByPeriod(period)
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: `Eres el CFO Virtual de El Conuco de Mamá. Tienes acceso a estos datos del período ${period}:
          Ventas: $${data.current.totalSales}
          Gastos: $${data.current.totalExpenses}
          Margen: ${data.current.grossMargin}%
          Clientes: ${data.current.uniqueCustomers}
          Cambio en ventas: ${data.change.salesChange}%
          Responde de forma clara y concisa en español.`
        },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    return completion.choices[0].message.content
  }

  // Generar alertas automáticas
  async generateAlerts(period: string = 'mes') {
    const data = await this.excelService.getDashboardByPeriod(period)
    const alerts = []

    // Lógica de alertas
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

    return alerts
  }
}

export default CFOAgent
