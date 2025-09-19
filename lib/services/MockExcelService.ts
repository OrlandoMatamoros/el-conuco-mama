// Servicio temporal con datos mock mientras configuras Azure
export class MockExcelService {
  async getDataByPeriod(startDate: Date, endDate: Date) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Datos mock basados en la estructura de tu Excel
    return {
      kpis: {
        ventasTotales: 2456789.50,
        gastosTotales: 1845678.25,
        margenBruto: 24.9,
        clientesUnicos: 234,
        ticketPromedio: 10498.68,
        productosVendidos: 1456
      },
      ventas: [
        { fecha: '2024-01-15', monto: 45000, productos: 234, cliente: 'Cliente A' },
        { fecha: '2024-01-16', monto: 52000, productos: 267, cliente: 'Cliente B' },
        { fecha: '2024-01-17', monto: 48000, productos: 251, cliente: 'Cliente C' },
        { fecha: '2024-01-18', monto: 61000, productos: 289, cliente: 'Cliente D' },
        { fecha: '2024-01-19', monto: 72000, productos: 312, cliente: 'Cliente E' },
      ],
      gastos: [
        { fecha: '2024-01-15', concepto: 'Inventario', monto: 32000, categoria: 'Compras' },
        { fecha: '2024-01-16', concepto: 'Nómina', monto: 28000, categoria: 'Personal' },
        { fecha: '2024-01-17', concepto: 'Servicios', monto: 8500, categoria: 'Operación' },
      ],
      productos: [
        { nombre: 'Pollo Fresco', cantidad: 234, ventas: 145678, margen: 28.5 },
        { nombre: 'Res Premium', cantidad: 156, ventas: 132456, margen: 32.1 },
        { nombre: 'Cerdo', cantidad: 189, ventas: 98765, margen: 26.8 },
        { nombre: 'Vegetales Varios', cantidad: 456, ventas: 87654, margen: 35.2 },
        { nombre: 'Lácteos', cantidad: 234, ventas: 65432, margen: 22.3 },
      ],
      comparaciones: {
        ventas: {
          actual: 2456789.50,
          anterior: 2134567.80,
          variacion: 15.1,
          tendencia: 'up'
        },
        gastos: {
          actual: 1845678.25,
          anterior: 1723456.90,
          variacion: 7.1,
          tendencia: 'up'
        },
        margen: {
          actual: 24.9,
          anterior: 22.3,
          variacion: 2.6,
          tendencia: 'up'
        }
      }
    };
  }
  
  async refreshData() {
    console.log('✅ Datos actualizados (mock)');
    return true;
  }
}

export default MockExcelService;
