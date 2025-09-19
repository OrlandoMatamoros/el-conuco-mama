// Servicio para leer el Excel del Conuco desde OneDrive
export class ConucoExcelService {
  private shareUrl: string;
  private cachedData: any = null;
  private lastFetch: Date | null = null;

  constructor() {
    this.shareUrl = process.env.ONEDRIVE_SHARE_URL || '';
  }

  async getExcelData() {
    try {
      console.log('📊 Obteniendo datos del Excel...');
      
      // Convertir el link para descarga directa
      // De: https://1drv.ms/x/c/...
      // A: https://onedrive.live.com/download?cid=...&resid=...
      
      const downloadUrl = this.shareUrl
        .replace('https://1drv.ms/x/c/', 'https://onedrive.live.com/download?cid=')
        .replace('/E', '&resid=0B981E5C9846900F!E')
        + '&authkey=!AMQQnlo15s6jqwE';
      
      console.log('📥 Descargando desde OneDrive...');
      
      // Por ahora retornar datos de ejemplo
      // El download real requiere manejo de CORS
      return this.getMockDataBasedOnRealStructure();
      
    } catch (error) {
      console.error('Error:', error);
      return this.getMockDataBasedOnRealStructure();
    }
  }
  
  // Datos basados en la estructura real de tu Excel
  private getMockDataBasedOnRealStructure() {
    return {
      kpis: {
        ventasTotales: 2456789.50,
        gastosTotales: 1845678.25,
        margenBruto: 24.9,
        clientesUnicos: 234,
        ticketPromedio: 10498.68,
        productosVendidos: 1456
      },
      ventasPorPeriodo: {
        hoy: 85000,
        ayer: 78000,
        semanaActual: 485000,
        semanaAnterior: 425000,
        mesActual: 1850000,
        mesAnterior: 1620000
      },
      productos: [
        { nombre: 'Pollo Fresco', ventas: 145678, unidades: 234, margen: 28.5 },
        { nombre: 'Res Premium', ventas: 132456, unidades: 156, margen: 32.1 },
        { nombre: 'Cerdo', ventas: 98765, unidades: 189, margen: 26.8 },
        { nombre: 'Vegetales', ventas: 87654, unidades: 456, margen: 35.2 },
        { nombre: 'Lácteos', ventas: 65432, unidades: 234, margen: 22.3 }
      ],
      comparaciones: {
        ventasVsAnterior: 15.1,
        gastosVsAnterior: 7.1,
        margenVsAnterior: 2.6,
        clientesVsAnterior: 8.5
      }
    };
  }
  
  async getDataByPeriod(period1: string, period2?: string) {
    const data = await this.getExcelData();
    
    // Calcular comparaciones entre períodos
    if (period2) {
      const valor1 = data.ventasPorPeriodo[period1] || 0;
      const valor2 = data.ventasPorPeriodo[period2] || 0;
      const variacion = ((valor1 - valor2) / valor2 * 100).toFixed(1);
      
      return {
        ...data,
        comparacion: {
          periodo1: { nombre: period1, valor: valor1 },
          periodo2: { nombre: period2, valor: valor2 },
          variacion,
          tendencia: valor1 > valor2 ? 'up' : 'down'
        }
      };
    }
    
    return data;
  }
}

export default ConucoExcelService;
