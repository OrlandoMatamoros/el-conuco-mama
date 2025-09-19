const XLSX = require('xlsx');
const fs = require('fs');

const excelPath = './data/Dashboard_1_1.xlsx';

console.log('=== VERIFICANDO EXCEL ===\n');

if (!fs.existsSync(excelPath)) {
  console.log('❌ NO se encontró el archivo Excel en:', excelPath);
  console.log('Por favor, sube Dashboard_1_1.xlsx a la carpeta /data');
  process.exit(1);
}

console.log('✅ Archivo encontrado, leyendo...\n');

try {
  const workbook = XLSX.readFile(excelPath);
  console.log('Hojas disponibles:', workbook.SheetNames);
  
  // Probar Items
  if (workbook.Sheets['Items']) {
    const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items']);
    let totalSales = 0;
    items.forEach(row => totalSales += parseFloat(row['Sales $']) || 0);
    console.log(`\n📊 VENTAS REALES: $${totalSales.toFixed(2)} (${items.length} items)`);
  }
  
  // Probar Gastos
  if (workbook.Sheets['Gastos']) {
    const gastos = XLSX.utils.sheet_to_json(workbook.Sheets['Gastos']);
    let totalGastos = 0;
    gastos.forEach(row => totalGastos += parseFloat(row['Valor']) || 0);
    console.log(`�� GASTOS REALES: $${totalGastos.toFixed(2)} (${gastos.length} registros)`);
  }
  
} catch (error) {
  console.error('Error:', error.message);
}
