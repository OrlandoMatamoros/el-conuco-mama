const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

console.log('🔍 Verificando archivos Excel...\n');

// Intentar ambas rutas
const paths = [
  path.join(process.cwd(), 'data', 'Dashboard 1.1.xlsx'),
  path.join(process.cwd(), 'data', 'Dashboard_1_1.xlsx')
];

paths.forEach(filePath => {
  console.log(`📁 Ruta: ${filePath}`);
  console.log(`   Existe: ${fs.existsSync(filePath)}`);
  
  if (fs.existsSync(filePath)) {
    try {
      const workbook = XLSX.readFile(filePath);
      console.log(`   ✅ Se puede leer`);
      console.log(`   📋 Hojas: ${workbook.SheetNames.join(', ')}`);
      
      // Verificar hoja Items
      const itemsSheet = workbook.Sheets['Items'];
      if (itemsSheet) {
        const data = XLSX.utils.sheet_to_json(itemsSheet);
        console.log(`   📦 Productos en Items: ${data.length}`);
        if (data.length > 0) {
          console.log(`   📝 Ejemplo de producto:`, Object.keys(data[0]));
        }
      }
    } catch (error) {
      console.log(`   ❌ Error al leer: ${error.message}`);
    }
  }
  console.log('');
});
