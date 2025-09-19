import fs from 'fs'
import path from 'path'

export const EXCEL_PATH = './data/Dashboard_1_1.xlsx'

export function checkExcelExists() {
  if (fs.existsSync(EXCEL_PATH)) {
    console.log('✅ Excel encontrado en:', EXCEL_PATH)
    return true
  } else {
    console.log('❌ Excel NO encontrado en:', EXCEL_PATH)
    console.log('Por favor, sube el archivo Dashboard_1_1.xlsx a la carpeta /data')
    return false
  }
}
