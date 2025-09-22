import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

interface ExcelData {
  products: any[];
  expenses: any[];
  costs: any[];
  payroll: any[];
  metrics: {
    totalVentas: number;
    totalCostos: number;
    totalGastos: number;
    totalPayroll: number;
    margenBruto: number;
    margenNeto: number;
    topProducts: Array<{name: string; sales: number}>;
    ventasPorDepartamento: Record<string, number>;
  };
}

class RobustExcelReader {
  private workbook: XLSX.WorkBook | null = null;

  constructor() {
    this.loadWorkbook();
  }

  private loadWorkbook() {
    // Intentar con el archivo con espacios primero
    const pathWithSpaces = path.join(process.cwd(), 'data', 'Dashboard 1.1.xlsx');
    const pathWithUnderscores = path.join(process.cwd(), 'data', 'Dashboard_1_1.xlsx');
    
    try {
      if (fs.existsSync(pathWithSpaces)) {
        console.log('📊 Cargando Excel con espacios...');
        this.workbook = XLSX.readFile(pathWithSpaces);
      } else if (fs.existsSync(pathWithUnderscores)) {
        console.log('📊 Cargando Excel con guiones bajos...');
        this.workbook = XLSX.readFile(pathWithUnderscores);
      } else {
        console.error('❌ No se encontró ningún archivo Excel');
      }
      
      if (this.workbook) {
        console.log('✅ Excel cargado. Hojas:', this.workbook.SheetNames);
      }
    } catch (error) {
      console.error('❌ Error al cargar Excel:', error);
    }
  }

  public async readAllData(): Promise<ExcelData> {
    if (!this.workbook) {
      // Intentar cargar de nuevo
      this.loadWorkbook();
      if (!this.workbook) {
        throw new Error('No se pudo cargar el archivo Excel');
      }
    }

    const products = this.readProducts();
    const expenses = this.readExpenses();
    const costs = this.readCosts();
    const payroll = this.readPayroll();
    const metrics = this.calculateMetrics(products, expenses, costs, payroll);

    return { products, expenses, costs, payroll, metrics };
  }

  private readProducts(): any[] {
    if (!this.workbook) return [];
    
    // Buscar la hoja con diferentes nombres posibles
    const possibleNames = ['Items', 'items', 'ITEMS', 'Productos', 'Products'];
    let sheet = null;
    
    for (const name of possibleNames) {
      if (this.workbook.Sheets[name]) {
        sheet = this.workbook.Sheets[name];
        console.log(`✅ Hoja de productos encontrada: ${name}`);
        break;
      }
    }
    
    if (!sheet) {
      console.log('⚠️ No se encontró hoja de productos');
      return [];
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`📦 Productos encontrados: ${data.length}`);
    
    return data.map((row: any) => ({
      date: row['Date'] || row['Fecha'] || '',
      department: row['Department'] || row['Departamento'] || '',
      item: row['Item'] || row['Producto'] || '',
      sales: parseFloat(row['Sales $'] || row['Ventas'] || 0),
      quantity: parseInt(row['# of Items'] || row['Cantidad'] || 0)
    }));
  }

  private readExpenses(): any[] {
    if (!this.workbook) return [];
    
    const sheet = this.workbook.Sheets['GASTOS'] || this.workbook.Sheets['Gastos'];
    if (!sheet) {
      console.log('⚠️ No se encontró hoja GASTOS');
      return [];
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    return data.map((row: any) => ({
      descripcion: row['DESCRIPCION'] || row['Descripcion'] || '',
      valor: parseFloat(row['VALOR'] || row['Valor'] || 0)
    }));
  }

  private readCosts(): any[] {
    if (!this.workbook) return [];
    
    const sheet = this.workbook.Sheets['COSTOS'] || this.workbook.Sheets['Costos'];
    if (!sheet) {
      console.log('⚠️ No se encontró hoja COSTOS');
      return [];
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    return data.map((row: any) => ({
      detalle: row['DETALLE'] || row['Detalle'] || '',
      valor: parseFloat(row['VALOR'] || row['Valor'] || 0)
    }));
  }

  private readPayroll(): any[] {
    if (!this.workbook) return [];
    
    const sheet = this.workbook.Sheets['Payroll'] || this.workbook.Sheets['PAYROLL'];
    if (!sheet) {
      console.log('⚠️ No se encontró hoja Payroll');
      return [];
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    return data.map((row: any) => ({
      empleado: row['Nombre del Empleado'] || row['Empleado'] || '',
      cargo: row['Cargo'] || '',
      netoPagar: parseFloat(row['Neto a Pagar'] || row['Neto'] || 0)
    }));
  }

  private calculateMetrics(products: any[], expenses: any[], costs: any[], payroll: any[]) {
    const totalVentas = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    const totalCostos = costs.reduce((sum, c) => sum + (c.valor || 0), 0);
    const totalGastos = expenses.reduce((sum, e) => sum + (e.valor || 0), 0);
    const totalPayroll = payroll.reduce((sum, p) => sum + (p.netoPagar || 0), 0);

    // Calcular top productos
    const productSales: Record<string, number> = {};
    products.forEach(p => {
      if (p.item) {
        productSales[p.item] = (productSales[p.item] || 0) + (p.sales || 0);
      }
    });
    
    const topProducts = Object.entries(productSales)
      .filter(([name, sales]) => sales > 0)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, sales]) => ({ name, sales }));

    // Ventas por departamento
    const ventasPorDepartamento: Record<string, number> = {};
    products.forEach(p => {
      if (p.department) {
        ventasPorDepartamento[p.department] = (ventasPorDepartamento[p.department] || 0) + (p.sales || 0);
      }
    });

    const margenBruto = totalVentas > 0 ? ((totalVentas - totalCostos) / totalVentas) * 100 : 0;
    const margenNeto = totalVentas > 0 ? 
      ((totalVentas - totalCostos - totalGastos - totalPayroll) / totalVentas) * 100 : 0;

    return {
      totalVentas,
      totalCostos,
      totalGastos,
      totalPayroll,
      margenBruto,
      margenNeto,
      topProducts,
      ventasPorDepartamento
    };
  }
}

export const robustExcelReader = new RobustExcelReader();
