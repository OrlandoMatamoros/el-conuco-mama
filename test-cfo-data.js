const XLSX = require('xlsx')
const path = require('path')

const excelPath = path.join(process.cwd(), 'data', 'Dashboard 1.1.xlsx')
const workbook = XLSX.readFile(excelPath)

// Contar productos únicos
const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items'])
const productos = {}

items.forEach(row => {
  const nombre = row['Item']
  const venta = parseFloat(row['Sales $']) || 0
  if (nombre) {
    productos[nombre] = (productos[nombre] || 0) + venta
  }
})

const top5 = Object.entries(productos)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)

console.log('TOP 5 PRODUCTOS MÁS VENDIDOS:')
top5.forEach(([nombre, ventas], i) => {
  console.log(`${i+1}. ${nombre}: RD$${ventas.toFixed(2)}`)
})

console.log('\nTotal productos únicos:', Object.keys(productos).length)
console.log('Total ventas:', items.reduce((sum, row) => sum + (parseFloat(row['Sales $']) || 0), 0).toFixed(2))
