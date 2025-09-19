'use client'

import React, { useState } from 'react'

export default function Dashboard() {
  const [period1, setPeriod1] = useState('mes-actual')
  const [period2, setPeriod2] = useState('mes-anterior')

  // Datos de ejemplo basados en tu negocio real
  const data = {
    ventas: {
      hoy: 45678,
      ayer: 42350,
      semana: 285000,
      mes: 1250000
    },
    gastos: {
      hoy: 32100,
      ayer: 29800,
      semana: 198000,
      mes: 875000
    },
    productos: [
      { nombre: 'Pollo Fresco', ventas: 145000, unidades: 450 },
      { nombre: 'Res Premium', ventas: 132000, unidades: 280 },
      { nombre: 'Cerdo', ventas: 98000, unidades: 320 },
      { nombre: 'Vegetales', ventas: 76000, unidades: 890 },
      { nombre: 'Lácteos', ventas: 65000, unidades: 560 }
    ]
  }

  const periods = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'ayer', label: 'Ayer' },
    { value: 'semana-actual', label: 'Esta Semana' },
    { value: 'semana-anterior', label: 'Semana Anterior' },
    { value: 'mes-actual', label: 'Este Mes' },
    { value: 'mes-anterior', label: 'Mes Anterior' }
  ]

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calcularMargen = (ventas: number, gastos: number) => {
    return ((ventas - gastos) / ventas * 100).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard - El Conuco de Mamá
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Selector de Períodos */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Comparar Períodos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período Principal
              </label>
              <select 
                value={period1}
                onChange={(e) => setPeriod1(e.target.value)}
                className="w-full p-3 border-2 border-green-500 rounded-lg"
              >
                {periods.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comparar Con
              </label>
              <select 
                value={period2}
                onChange={(e) => setPeriod2(e.target.value)}
                className="w-full p-3 border-2 border-blue-500 rounded-lg"
              >
                {periods.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Ventas del Mes</p>
            <p className="text-2xl font-bold">{formatMoney(data.ventas.mes)}</p>
            <p className="text-green-600 text-sm">+12.5% vs mes anterior</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Gastos del Mes</p>
            <p className="text-2xl font-bold">{formatMoney(data.gastos.mes)}</p>
            <p className="text-red-600 text-sm">+8.2% vs mes anterior</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Margen Bruto</p>
            <p className="text-2xl font-bold">
              {calcularMargen(data.ventas.mes, data.gastos.mes)}%
            </p>
            <p className="text-green-600 text-sm">+2.3% vs mes anterior</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Ventas Hoy</p>
            <p className="text-2xl font-bold">{formatMoney(data.ventas.hoy)}</p>
            <p className="text-green-600 text-sm">
              +{((data.ventas.hoy - data.ventas.ayer) / data.ventas.ayer * 100).toFixed(1)}% vs ayer
            </p>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Top 5 Productos</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Producto</th>
                    <th className="px-4 py-3 text-right">Ventas</th>
                    <th className="px-4 py-3 text-right">Unidades</th>
                    <th className="px-4 py-3 text-right">Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {data.productos.map((producto, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-4 py-3 font-medium">{producto.nombre}</td>
                      <td className="px-4 py-3 text-right">{formatMoney(producto.ventas)}</td>
                      <td className="px-4 py-3 text-right">{producto.unidades}</td>
                      <td className="px-4 py-3 text-right">
                        {formatMoney(producto.ventas / producto.unidades)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
