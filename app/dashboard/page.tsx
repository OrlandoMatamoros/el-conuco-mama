'use client'

import React, { useState, useEffect } from 'react'

export default function Dashboard() {
  const [data, setData] = useState({
    ventas: 525342.54,
    gastos: 62383.00,
    costos: 349147.44,
    payroll: 92758.54
  })

  const totalEgresos = data.gastos + data.costos + data.payroll
  const utilidad = data.ventas - totalEgresos
  const margen = (utilidad / data.ventas * 100).toFixed(2)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Dashboard El Conuco</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Ventas</p>
          <p className="text-2xl font-bold text-green-600">
            ${data.ventas.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Egresos</p>
          <p className="text-2xl font-bold text-red-600">
            ${totalEgresos.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Utilidad</p>
          <p className="text-2xl font-bold text-blue-600">
            ${utilidad.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Margen</p>
          <p className="text-2xl font-bold text-purple-600">
            {margen}%
          </p>
        </div>
      </div>
      
      <div className="mt-8 bg-yellow-100 p-4 rounded-lg">
        <p className="text-sm">
          📍 Próximo paso: Conectar con OneDrive vía n8n
        </p>
      </div>
    </div>
  )
}
