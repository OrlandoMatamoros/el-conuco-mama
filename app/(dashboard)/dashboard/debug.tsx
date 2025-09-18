'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [salesData, setSalesData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    debugSales()
  }, [])

  const debugSales = async () => {
    try {
      const response = await fetch('/data/items.csv')
      const text = await response.text()
      const lines = text.split('\n').filter(l => l.trim())
      
      console.log('Total líneas:', lines.length)
      console.log('Primera línea (headers):', lines[0])
      console.log('Segunda línea (datos):', lines[1])
      
      // Analizar primeras 5 líneas de datos
      const sampleData = []
      for (let i = 1; i < Math.min(6, lines.length); i++) {
        const line = lines[i].replace(/"/g, '')
        const cols = line.split(',')
        
        sampleData.push({
          lineNumber: i,
          fecha: cols[0],
          department: cols[1],
          salesColumn: cols[7],
          parsedAmount: parseFloat(cols[7]?.replace('$', '').replace(',', '') || '0'),
          totalColumns: cols.length
        })
      }
      
      // Calcular total rápido
      let quickTotal = 0
      let validLines = 0
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].replace(/"/g, '')
        const cols = line.split(',')
        const amount = parseFloat(cols[7]?.replace('$', '').replace(',', '') || '0')
        
        if (!isNaN(amount) && amount > 0) {
          quickTotal += amount
          validLines++
        }
      }
      
      setSalesData({
        totalLines: lines.length,
        headers: lines[0],
        samples: sampleData,
        quickTotal,
        validLines
      })
      
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-white">Cargando...</div>

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Debug de Datos de Ventas</h1>
      
      {salesData && (
        <div className="space-y-6">
          <div className="bg-white/10 rounded-xl p-4">
            <h2 className="text-amber-400 font-bold mb-2">Archivo items.csv</h2>
            <p>Total de líneas: {salesData.totalLines}</p>
            <p>Líneas válidas con ventas: {salesData.validLines}</p>
            <p className="text-2xl font-bold text-green-400 mt-2">
              Total Ventas (sin filtro): ${salesData.quickTotal?.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <h2 className="text-amber-400 font-bold mb-2">Headers</h2>
            <p className="text-xs font-mono">{salesData.headers}</p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <h2 className="text-amber-400 font-bold mb-2">Primeras 5 líneas de datos</h2>
            {salesData.samples?.map((sample: any) => (
              <div key={sample.lineNumber} className="border-b border-white/10 pb-2 mb-2">
                <p className="text-xs">Línea {sample.lineNumber}:</p>
                <p className="text-xs">Fecha: <span className="text-amber-300">{sample.fecha || 'VACÍO'}</span></p>
                <p className="text-xs">Columna ventas (7): <span className="text-green-300">{sample.salesColumn}</span></p>
                <p className="text-xs">Valor parseado: <span className="text-green-400 font-bold">${sample.parsedAmount}</span></p>
                <p className="text-xs">Total columnas: {sample.totalColumns}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
