const XLSX = require('xlsx');
const fs = require('fs');

const excelPath = './data/Dashboard_1_1.xlsx';

console.log('=== LEYENDO DATOS REALES DEL EXCEL ===\n');

const workbook = XLSX.readFile(excelPath);

// VENTAS (Items)
if (workbook.Sheets['Items']) {
  const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items']);
  let totalSales = 0;
  items.forEach(row => totalSales += parseFloat(row['Sales $']) || 0);
  console.log(`💰 VENTAS REALES: $${totalSales.toFixed(2)} (${items.length} items)`);
}

// GASTOS
if (workbook.Sheets['GASTOS']) {
  const gastos = XLSX.utils.sheet_to_json(workbook.Sheets['GASTOS']);
  let totalGastos = 0;
  gastos.forEach(row => totalGastos += parseFloat(row['Valor']) || 0);
  console.log(`💸 GASTOS REALES: $${totalGastos.toFixed(2)} (${gastos.length} registros)`);
}

// COSTOS
if (workbook.Sheets['COSTOS']) {
  const costos = XLSX.utils.sheet_to_json(workbook.Sheets['COSTOS']);
  let totalCostos = 0;
  costos.forEach(row => totalCostos += parseFloat(row['Valor'] || row['Costo'] || 0));
  console.log(`📦 COSTOS REALES: $${totalCostos.toFixed(2)} (${costos.length} registros)`);
}

// PAYROLL
if (workbook.Sheets['Payroll']) {
  const payroll = XLSX.utils.sheet_to_json(workbook.Sheets['Payroll']);
  let totalPayroll = 0;
  payroll.forEach(row => totalPayroll += parseFloat(row['Valor'] || row['Salario'] || row['Amount'] || 0));
  console.log(`👥 PAYROLL REAL: $${totalPayroll.toFixed(2)} (${payroll.length} registros)`);
}

// ANALISIS - Buscar métricas
if (workbook.Sheets['ANALISIS']) {
  console.log('\n📊 MÉTRICAS DE ANALISIS:');
  const data = XLSX.utils.sheet_to_json(workbook.Sheets['ANALISIS'], { header: 1 });
  
  data.slice(0, 30).forEach((row) => {
    if (row[0] && typeof row[0] === 'string') {
      const label = row[0];
      if (label.includes('Total') || label.includes('Utilidad') || label.includes('Rentabilidad')) {
        const value = row[1] || row[2] || row[3];
        if (value) console.log(`  ${label}: ${value}`);
      }
    }
  });
}
