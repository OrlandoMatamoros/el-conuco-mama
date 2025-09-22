const fs = require('fs')
const path = require('path')

const files = [
  'data/Dashboard_1_1.xlsx',
  'data/Dashboard 1.1.xlsx',
  './data/Dashboard_1_1.xlsx',
  './data/Dashboard 1.1.xlsx'
]

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file)
  const exists = fs.existsSync(fullPath)
  console.log(`${file}: ${exists ? 'EXISTE' : 'NO EXISTE'}`)
  if (exists) {
    const stats = fs.statSync(fullPath)
    console.log(`  Tamaño: ${stats.size} bytes`)
  }
})

// Listar archivos en data/
const dataDir = path.join(process.cwd(), 'data')
console.log('\nArchivos en data/:')
fs.readdirSync(dataDir).forEach(file => {
  if (file.endsWith('.xlsx')) {
    console.log(`  - ${file}`)
  }
})
