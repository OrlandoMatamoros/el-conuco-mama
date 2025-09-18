/**
 * Data Processor for El Conuco de Mamá
 * Minimarket in Brooklyn, NY
 * Handles CSV/XLSX files for sales, inventory, expenses, and payroll
 */

import * as XLSX from 'xlsx';

// ==================== INTERFACES ====================

/**
 * Raw data interfaces matching CSV structures
 */
interface SalesRecord {
  Date: string;
  Department: string;
  UPC: string;
  Item: string;
  Baskets: number;
  Items: number;
  'Sales$': number;
}

interface InventoryRecord {
  UPC: string;
  Item: string;
  Department: string;
  Quantity: number;
  Cost: number;
}

interface ExpenseRecord {
  Fecha: string;
  Concepto: string;
  Valor: number;
}

interface PayrollRecord {
  Fecha: string;
  Empleado: string;
  Cargo: string;
  Horas: number;
  Sueldo: number;
}

/**
 * Processed data output structure
 */
export interface ProcessedData {
  sales: {
    total: number;
    byDepartment: Record<string, number>;
    byDate: Record<string, number>;
    itemCount: number;
    transactionCount: number;
  };
  inventory: {
    totalValue: number;
    items: number;
    byDepartment: Record<string, { quantity: number; value: number }>;
    lowStock: Array<{ item: string; quantity: number }>;
  };
  expenses: {
    total: number;
    byCategory: Record<string, number>;
    monthly: Record<string, number>;
  };
  payroll: {
    total: number;
    byEmployee: Record<string, number>;
    byPosition: Record<string, number>;
    totalHours: number;
  };
  metrics: {
    grossMargin: number;
    netProfit: number;
    inventoryTurnover: number;
    laborCostPercentage: number;
  };
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Parse date strings in various formats
 */
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  
  // Handle MM/DD/YYYY or MM-DD-YYYY
  const parts = dateStr.split(/[\/\-]/);
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  // Fallback to standard parsing
  return new Date(dateStr);
};

/**
 * Format date to YYYY-MM for monthly aggregation
 */
const getMonthKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Parse numeric values handling different formats
 */
const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  // Remove currency symbols and spaces
  const cleaned = String(value).replace(/[$,\s]/g, '');
  
  // Handle both comma and period as decimal separator
  const normalized = cleaned.replace(',', '.');
  
  return parseFloat(normalized) || 0;
};

/**
 * Read file as text or buffer based on type
 */
const readFileContent = async (file: File): Promise<string | ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    
    // Check if XLSX file
    if (file.name.toLowerCase().endsWith('.xlsx') || 
        file.name.toLowerCase().endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

// ==================== CSV PROCESSING FUNCTIONS ====================

/**
 * Process sales CSV file (itemsales_by_custom.csv)
 * Structure: Date, Department, UPC, Item, Baskets, Items, Sales$
 */
export async function processSalesCSV(file: File): Promise<ProcessedData['sales']> {
  try {
    const content = await readFileContent(file);
    let data: SalesRecord[] = [];
    
    if (typeof content === 'string') {
      // Parse CSV
      const lines = content.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        return record;
      });
    } else {
      // Parse XLSX
      const workbook = XLSX.read(content, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json<SalesRecord>(sheet);
    }
    
    // Process data
    const result = {
      total: 0,
      byDepartment: {} as Record<string, number>,
      byDate: {} as Record<string, number>,
      itemCount: 0,
      transactionCount: 0
    };
    
    data.forEach(record => {
      const sales = parseNumber(record['Sales$']);
      const items = parseNumber(record.Items);
      const baskets = parseNumber(record.Baskets);
      const date = parseDate(record.Date);
      const dateKey = date.toISOString().split('T')[0];
      
      result.total += sales;
      result.itemCount += items;
      result.transactionCount += baskets;
      
      // Aggregate by department
      if (!result.byDepartment[record.Department]) {
        result.byDepartment[record.Department] = 0;
      }
      result.byDepartment[record.Department] += sales;
      
      // Aggregate by date
      if (!result.byDate[dateKey]) {
        result.byDate[dateKey] = 0;
      }
      result.byDate[dateKey] += sales;
    });
    
    return result;
  } catch (error) {
    console.error('Error processing sales CSV:', error);
    throw new Error(`Failed to process sales file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process inventory CSV file (invonhand_by_day.csv)
 * Structure: UPC, Item, Department, Quantity, Cost
 */
export async function processInventoryCSV(file: File): Promise<ProcessedData['inventory']> {
  try {
    const content = await readFileContent(file);
    let data: InventoryRecord[] = [];
    
    if (typeof content === 'string') {
      // Parse CSV
      const lines = content.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      
      data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        return record;
      });
    } else {
      // Parse XLSX
      const workbook = XLSX.read(content, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json<InventoryRecord>(sheet);
    }
    
    // Process data
    const result = {
      totalValue: 0,
      items: 0,
      byDepartment: {} as Record<string, { quantity: number; value: number }>,
      lowStock: [] as Array<{ item: string; quantity: number }>
    };
    
    const LOW_STOCK_THRESHOLD = 10; // Configure as needed
    
    data.forEach(record => {
      const quantity = parseNumber(record.Quantity);
      const cost = parseNumber(record.Cost);
      const value = quantity * cost;
      
      result.totalValue += value;
      result.items++;
      
      // Aggregate by department
      if (!result.byDepartment[record.Department]) {
        result.byDepartment[record.Department] = { quantity: 0, value: 0 };
      }
      result.byDepartment[record.Department].quantity += quantity;
      result.byDepartment[record.Department].value += value;
      
      // Track low stock items
      if (quantity < LOW_STOCK_THRESHOLD) {
        result.lowStock.push({
          item: record.Item,
          quantity: quantity
        });
      }
    });
    
    // Sort low stock by quantity (lowest first)
    result.lowStock.sort((a, b) => a.quantity - b.quantity);
    
    return result;
  } catch (error) {
    console.error('Error processing inventory CSV:', error);
    throw new Error(`Failed to process inventory file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process expenses CSV file (Gastos.csv or COSTOS.csv)
 * Structure: Fecha;Concepto;Valor (semicolon separated)
 */
export async function processExpensesCSV(file: File): Promise<ProcessedData['expenses']> {
  try {
    const content = await readFileContent(file);
    let data: ExpenseRecord[] = [];
    
    if (typeof content === 'string') {
      // Parse CSV with semicolon separator
      const lines = content.split('\n').filter(line => line.trim());
      const headers = lines[0].split(';').map(h => h.trim());
      
      data = lines.slice(1).map(line => {
        const values = line.split(';').map(v => v.trim());
        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        return record;
      });
    } else {
      // Parse XLSX
      const workbook = XLSX.read(content, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json<ExpenseRecord>(sheet);
    }
    
    // Process data
    const result = {
      total: 0,
      byCategory: {} as Record<string, number>,
      monthly: {} as Record<string, number>
    };
    
    data.forEach(record => {
      const value = parseNumber(record.Valor);
      const date = parseDate(record.Fecha);
      const monthKey = getMonthKey(date);
      const category = record.Concepto || 'Other';
      
      result.total += value;
      
      // Aggregate by category
      if (!result.byCategory[category]) {
        result.byCategory[category] = 0;
      }
      result.byCategory[category] += value;
      
      // Aggregate by month
      if (!result.monthly[monthKey]) {
        result.monthly[monthKey] = 0;
      }
      result.monthly[monthKey] += value;
    });
    
    return result;
  } catch (error) {
    console.error('Error processing expenses CSV:', error);
    throw new Error(`Failed to process expenses file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process payroll CSV file (Payroll.csv)
 * Structure: Fecha;Empleado;Cargo;Horas;Sueldo (semicolon separated)
 */
export async function processPayrollCSV(file: File): Promise<ProcessedData['payroll']> {
  try {
    const content = await readFileContent(file);
    let data: PayrollRecord[] = [];
    
    if (typeof content === 'string') {
      // Parse CSV with semicolon separator
      const lines = content.split('\n').filter(line => line.trim());
      const headers = lines[0].split(';').map(h => h.trim());
      
      data = lines.slice(1).map(line => {
        const values = line.split(';').map(v => v.trim());
        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        return record;
      });
    } else {
      // Parse XLSX
      const workbook = XLSX.read(content, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json<PayrollRecord>(sheet);
    }
    
    // Process data
    const result = {
      total: 0,
      byEmployee: {} as Record<string, number>,
      byPosition: {} as Record<string, number>,
      totalHours: 0
    };
    
    data.forEach(record => {
      const salary = parseNumber(record.Sueldo);
      const hours = parseNumber(record.Horas);
      const employee = record.Empleado || 'Unknown';
      const position = record.Cargo || 'Other';
      
      result.total += salary;
      result.totalHours += hours;
      
      // Aggregate by employee
      if (!result.byEmployee[employee]) {
        result.byEmployee[employee] = 0;
      }
      result.byEmployee[employee] += salary;
      
      // Aggregate by position
      if (!result.byPosition[position]) {
        result.byPosition[position] = 0;
      }
      result.byPosition[position] += salary;
    });
    
    return result;
  } catch (error) {
    console.error('Error processing payroll CSV:', error);
    throw new Error(`Failed to process payroll file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ==================== AGGREGATION FUNCTIONS ====================

/**
 * Calculate aggregate metrics from all processed data
 */
export function aggregateMetrics(data: Partial<ProcessedData>): ProcessedData['metrics'] {
  const metrics: ProcessedData['metrics'] = {
    grossMargin: 0,
    netProfit: 0,
    inventoryTurnover: 0,
    laborCostPercentage: 0
  };
  
  // Calculate gross margin
  if (data.sales && data.inventory) {
    const revenue = data.sales.total;
    const cogs = data.inventory.totalValue * 0.7; // Estimate COGS as 70% of inventory value
    metrics.grossMargin = revenue > 0 ? ((revenue - cogs) / revenue) * 100 : 0;
  }
  
  // Calculate net profit
  if (data.sales && data.expenses && data.payroll) {
    const revenue = data.sales.total;
    const totalExpenses = (data.expenses?.total || 0) + (data.payroll?.total || 0);
    metrics.netProfit = revenue - totalExpenses;
  }
  
  // Calculate inventory turnover
  if (data.sales && data.inventory) {
    const annualSales = data.sales.total * 12; // Assuming monthly data
    metrics.inventoryTurnover = data.inventory.totalValue > 0 
      ? annualSales / data.inventory.totalValue 
      : 0;
  }
  
  // Calculate labor cost percentage
  if (data.sales && data.payroll) {
    metrics.laborCostPercentage = data.sales.total > 0 
      ? (data.payroll.total / data.sales.total) * 100 
      : 0;
  }
  
  return metrics;
}

// ==================== MAIN PROCESSOR ====================

/**
 * Process all data files and return comprehensive metrics
 */
export async function processAllData(files: {
  sales?: File;
  inventory?: File;
  expenses?: File;
  payroll?: File;
  costs?: File;
}): Promise<ProcessedData> {
  const result: Partial<ProcessedData> = {};
  
  // Process each file type
  if (files.sales) {
    result.sales = await processSalesCSV(files.sales);
  }
  
  if (files.inventory) {
    result.inventory = await processInventoryCSV(files.inventory);
  }
  
  // Process expenses (combine Gastos.csv and COSTOS.csv if both provided)
  if (files.expenses || files.costs) {
    const expensesData = files.expenses ? await processExpensesCSV(files.expenses) : null;
    const costsData = files.costs ? await processExpensesCSV(files.costs) : null;
    
    if (expensesData && costsData) {
      // Combine both expense sources
      result.expenses = {
        total: expensesData.total + costsData.total,
        byCategory: { ...expensesData.byCategory },
        monthly: { ...expensesData.monthly }
      };
      
      // Merge categories
      Object.entries(costsData.byCategory).forEach(([category, value]) => {
        if (!result.expenses!.byCategory[category]) {
          result.expenses!.byCategory[category] = 0;
        }
        result.expenses!.byCategory[category] += value;
      });
      
      // Merge monthly
      Object.entries(costsData.monthly).forEach(([month, value]) => {
        if (!result.expenses!.monthly[month]) {
          result.expenses!.monthly[month] = 0;
        }
        result.expenses!.monthly[month] += value;
      });
    } else {
      result.expenses = expensesData || costsData || {
        total: 0,
        byCategory: {},
        monthly: {}
      };
    }
  }
  
  if (files.payroll) {
    result.payroll = await processPayrollCSV(files.payroll);
  }
  
  // Calculate aggregate metrics
  result.metrics = aggregateMetrics(result);
  
  // Ensure all fields are present
  return {
    sales: result.sales || {
      total: 0,
      byDepartment: {},
      byDate: {},
      itemCount: 0,
      transactionCount: 0
    },
    inventory: result.inventory || {
      totalValue: 0,
      items: 0,
      byDepartment: {},
      lowStock: []
    },
    expenses: result.expenses || {
      total: 0,
      byCategory: {},
      monthly: {}
    },
    payroll: result.payroll || {
      total: 0,
      byEmployee: {},
      byPosition: {},
      totalHours: 0
    },
    metrics: result.metrics
  };
}

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate file format and structure
 */
export function validateFile(file: File, expectedType: 'sales' | 'inventory' | 'expenses' | 'payroll'): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check file extension
  const validExtensions = ['.csv', '.xlsx', '.xls'];
  const hasValidExtension = validExtensions.some(ext => 
    file.name.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    errors.push(`Invalid file extension. Expected: ${validExtensions.join(', ')}`);
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size: 10MB`);
  }
  
  // Check expected filename patterns
  const expectedPatterns: Record<typeof expectedType, RegExp[]> = {
    sales: [/itemsales/i, /sales/i],
    inventory: [/invonhand/i, /inventory/i],
    expenses: [/gastos/i, /costos/i, /expenses/i],
    payroll: [/payroll/i, /nomina/i]
  };
  
  const patterns = expectedPatterns[expectedType];
  const matchesPattern = patterns.some(pattern => pattern.test(file.name));
  
  if (!matchesPattern) {
    errors.push(`Filename doesn't match expected pattern for ${expectedType}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Format currency values for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Format percentage values for display
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Export processed data to JSON
 */
export function exportToJSON(data: ProcessedData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Export processed data to CSV format
 */
export function exportToCSV(data: ProcessedData): {
  sales: string;
  inventory: string;
  expenses: string;
  payroll: string;
  metrics: string;
} {
  // Sales CSV
  const salesRows = ['Department,Total Sales'];
  Object.entries(data.sales.byDepartment).forEach(([dept, total]) => {
    salesRows.push(`${dept},${total}`);
  });
  
  // Inventory CSV
  const inventoryRows = ['Department,Quantity,Value'];
  Object.entries(data.inventory.byDepartment).forEach(([dept, info]) => {
    inventoryRows.push(`${dept},${info.quantity},${info.value}`);
  });
  
  // Expenses CSV
  const expenseRows = ['Category,Total'];
  Object.entries(data.expenses.byCategory).forEach(([category, total]) => {
    expenseRows.push(`${category},${total}`);
  });
  
  // Payroll CSV
  const payrollRows = ['Employee,Total'];
  Object.entries(data.payroll.byEmployee).forEach(([employee, total]) => {
    payrollRows.push(`${employee},${total}`);
  });
  
  // Metrics CSV
  const metricsRows = [
    'Metric,Value',
    `Gross Margin,${data.metrics.grossMargin}%`,
    `Net Profit,$${data.metrics.netProfit}`,
    `Inventory Turnover,${data.metrics.inventoryTurnover}`,
    `Labor Cost %,${data.metrics.laborCostPercentage}%`
  ];
  
  return {
    sales: salesRows.join('\n'),
    inventory: inventoryRows.join('\n'),
    expenses: expenseRows.join('\n'),
    payroll: payrollRows.join('\n'),
    metrics: metricsRows.join('\n')
  };
}
