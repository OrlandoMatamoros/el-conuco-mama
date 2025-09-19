export class GoogleSheetsService {
  private apiKey: string
  private spreadsheetId: string
  
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''
    this.spreadsheetId = '1tGGevUx3b2xYcsVSum8mmbLC55XfM4QA'
  }
  
  async getDashboardData(periodo?: string) {
    try {
      // URL de la API de Google Sheets v4
      const range = 'Dashboard!A1:Z100'
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Error al obtener datos')
      }
      
      return this.processSheetData(data.values)
    } catch (error) {
      console.error('Error:', error)
      return this.getMockData()
    }
  }
  
  private processSheetData(values: any[][]) {
    // Procesar los datos del sheet
    // Asumiendo que la estructura es similar a tu Excel
    return {
      ventas: parseFloat(values[1]?.[1] || 0),
      gastos: parseFloat(values[2]?.[1] || 0),
      margen: parseFloat(values[3]?.[1] || 0),
      productos: this.extractProducts(values),
      timestamp: new Date().toISOString()
    }
  }
  
  private extractProducts(values: any[][]) {
    // Extraer productos desde fila 10 en adelante (ajustar según tu sheet)
    const products = []
    for (let i = 10; i < values.length && i < 20; i++) {
      if (values[i]?.[0]) {
        products.push({
          nombre: values[i][0],
          ventas: parseFloat(values[i][1] || 0),
          unidades: parseInt(values[i][2] || 0)
        })
      }
    }
    return products
  }
  
  private getMockData() {
    return {
      ventas: 245678.50,
      gastos: 184567.25,
      margen: 24.9,
      productos: [],
      timestamp: new Date().toISOString()
    }
  }
}

export default GoogleSheetsService
