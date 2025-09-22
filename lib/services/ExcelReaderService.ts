import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export interface ProductData {
  date: string;
  department: string;
  item: string;
  sales: number;
  quantity: number;
}

export interface ExpenseData {
  descripcion: string;
  valor: number;
}

export interface CostData {
  detalle: string;
  valor: number;
}

export interface PayrollData {
  empleado: string;
  cargo: string;
  netoPagar: number;
}

export interface DashboardMetrics {
  totalVentas: number;
  totalCostos: number;
  totalGastos: number;
  totalPayroll: number;
  margenBruto: number;
  margenNeto: number;
  topProducts: Array<{name: string; sales: number}>;
  ventasPorDepartamento: Record<string, number>;
}

class ExcelReaderService {
  private excelPath: string;

  constructor() {
    // El archivo está en /data con espacios en el nombre
    this.excelPath = path.join(process.cwd(), 'data', 'Dashboard 1.1.xlsx');
    
    if (!fs.existsSync(this.excelPath)) {
      // Intentar con guiones bajos
      this.excelPath = path.join(process.cwd(), 'data', 'Dashboard_1_1.xlsx');
    }
    
    console.log(`📊 Usando Excel: ${this.excelPath}`);
    console.log(`📊 Archivo existe: ${fs.existsSync(this.excelPath)}`);
  }

  public async readAllData(): Promise<{
    products: ProductData[];
    expenses: ExpenseData[];
    costs: CostData[];
    payroll: PayrollData[];
    metrics: DashboardMetrics;
  }> {
    if (!fs.existsSync(this.excelPath)) {
      throw new Error(`Archivo Excel no encontrado en: ${this.excelPath}`);
    }

    const workbook = XLSX.readFile(this.excelPath);
    console.log('📋 Hojas disponibles:', workbook.SheetNames);
    
    const products = this.readProductsSheet(workbook);
    const expenses = this.readExpensesSheet(workbook);
    const costs = this.readCostsSheet(workbook);
    const payroll = this.readPayrollSheet(workbook);
    const metrics = this.calculateMetrics(products, expenses, costs, payroll);

    return { products, expenses, costs, payroll, metrics };
  }

  private readProductsSheet(workbook: XLSX.WorkBook): ProductData[] {
    // La hoja se llama "Items" según tu Excel
    const sheet = workbook.Sheets['Items'] || workbook.Sheets['items'] || workbook.Sheets['ITEMS'];
    if (!sheet) {
      console.warn('❌ No se encontró la hoja Items');
      return [];
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`✅ Productos encontrados: ${data.length}`);
    
    return data.map((row: any) => ({
      date: row['Date'] || '',
      department: row['Department'] || '',
      item: row['Item'] || '',
      sales: parseFloat(row['Sales $'] || 0),
      quantity: parseInt(row['# of Items'] || 0)
    }));
  }

  private readExpensesSheet(workbook: XLSX.WorkBook): ExpenseData[] {
    const sheet = workbook.Sheets['GASTOS'] || workbook.Sheets['Gastos'] || workbook.Sheets['gastos'];
    if (!sheet) {
      console.warn('❌ No se encontró la hoja GASTOS');
      return [];
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`✅ Gastos encontrados: ${data.length}`);
    
    return data.map((row: any) => ({
      descripcion: row['DESCRIPCION'] || row['Descripcion'] || '',
      valor: parseFloat(row['VALOR'] || row['Valor'] || 0)
    }));
  }

  private readCostsSheet(workbook: XLSX.WorkBook): CostData[] {
    const sheet = workbook.Sheets['COSTOS'] || workbook.Sheets['Costos'] || workbook.Sheets['costos'];
    if (!sheet) {
      console.warn('❌ No se encontró la hoja COSTOS');
      return [];
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`✅ Costos encontrados: ${data.length}`);
    
    return data.map((row: any) => ({
      detalle: row['DETALLE'] || row['Detalle'] || '',
      valor: parseFloat(row['VALOR'] || row['Valor'] || 0)
    }));
  }

  private readPayrollSheet(workbook: XLSX.WorkBook): PayrollData[] {
    const sheet = workbook.Sheets['Payroll'] || workbook.Sheets['PAYROLL'] || workbook.Sheets['payroll'];
    if (!sheet) {
      console.warn('❌ No se encontró la hoja Payroll');
      return [];
    }

    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(`✅ Empleados encontrados: ${data.length}`);
    
    return data.map((row: any) => ({
      empleado: row['Nombre del Empleado'] || row['Empleado'] || '',
      cargo: row['Cargo'] || '',
      netoPagar: parseFloat(row['Neto a Pagar'] || row['Neto'] || 0)
    }));
  }

  private calculateMetrics(
    products: ProductData[],
    expenses: ExpenseData[],
    costs: CostData[],
    payroll: PayrollData[]
  ): DashboardMetrics {
    const totalVentas = products.reduce((sum, p) => sum + p.sales, 0);
    const totalCostos = costs.reduce((sum, c) => sum + c.valor, 0);
    const totalGastos = expenses.reduce((sum, e) => sum + e.valor, 0);
    const totalPayroll = payroll.reduce((sum, p) => sum + p.netoPagar, 0);

    // Top productos
    const productSales: Record<string, number> = {};
    products.forEach(p => {
      if (p.item) {
        productSales[p.item] = (productSales[p.item] || 0) + p.sales;
      }
    });
    
    const topProducts = Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, sales]) => ({ name, sales }));

    // Ventas por departamento
    const ventasPorDepartamento: Record<string, number> = {};
    products.forEach(p => {
      if (p.department) {
        ventasPorDepartamento[p.department] = (ventasPorDepartamento[p.department] || 0) + p.sales;
      }
    });

    const margenBruto = totalVentas > 0 ? ((totalVentas - totalCostos) / totalVentas) * 100 : 0;
    const margenNeto = totalVentas > 0 ? 
      ((totalVentas - totalCostos - totalGastos - totalPayroll) / totalVentas) * 100 : 0;

    console.log('📊 Métricas calculadas:', {
      totalVentas,
      totalCostos,
      totalGastos,
      totalPayroll,
      margenBruto: margenBruto.toFixed(2),
      margenNeto: margenNeto.toFixed(2)
    });

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

export const excelReaderService = new ExcelReaderService();
