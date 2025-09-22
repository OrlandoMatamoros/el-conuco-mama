const XLSX = require('xlsx')
const path = require('path')

const excelPath = path.join(process.cwd(), 'data', 'Dashboard 1.1.xlsx')
const workbook = XLSX.readFile(excelPath)

console.log('Hojas disponibles:', workbook.SheetNames)

if (workbook.Sheets['Items']) {
  const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items'])
  console.log('Primeras 3 filas de Items:', items.slice(0, 3))
} else {
  console.log('No se encontró la hoja Items')
}
