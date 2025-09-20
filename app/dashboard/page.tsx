'use client'

import React, { useState } from 'react'

export default function ConucoDashboard() {
  // DATOS REALES ACTUALIZADOS AL 19/09/2025
  const datosReales = {
    ventas: 525342.54,
    gastos: 62383.00,
    costos: 351924.59,
    payroll: 95738.54,
    totalEgresos: 510046.13,
    utilidadBruta: 15296.41,
    rentabilidad: 2.91,
    ventasYTD: 525342.54,
    egresosYTD: 510046.13,
    utilidadYTD: 15296.41,
    rentabilidadYTD: 2.91
  }

  const ventasPorSemana = [
    { semana: 'S-37', ventas: 2496.48, tipo: 'actual' },
    { semana: 'S-32', ventas: 13963.70, tipo: 'pasada' },
    { semana: 'S-31', ventas: 14026.93, tipo: 'pasada' },
    { semana: 'S-27', ventas: 13712.20, tipo: 'pasada' },
    { semana: 'S-26', ventas: 13407.13, tipo: 'pasada' },
    { semana: 'S-25', ventas: 13364.42, tipo: 'pasada' },
    { semana: 'S-24', ventas: 13850.99, tipo: 'pasada' },
    { semana: 'S-22', ventas: 13901.48, tipo: 'pasada' },
    { semana: 'S-16', ventas: 17080.55, tipo: 'mejor' },
    { semana: 'S-15', ventas: 16022.68, tipo: 'buena' },
    { semana: 'S-14', ventas: 15856.50, tipo: 'buena' }
  ]

  const distribucionEgresos = [
    { concepto: 'Costos', porcentaje: 69.00, monto: datosReales.costos, color: '#ef4444' },
    { concepto: 'Payroll', porcentaje: 18.77, monto: datosReales.payroll, color: '#3b82f6' },
    { concepto: 'Gastos', porcentaje: 12.23, monto: datosReales.gastos, color: '#f59e0b' }
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2
    }).format(value)
  }

  const [selectedPeriod, setSelectedPeriod] = useState('ytd')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">El Conuco de Mamá</h1>
              <p className="text-sm text-gray-600 mt-1">Dashboard Ejecutivo - Datos Reales YTD 2025</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Última actualización</p>
              <p className="text-sm font-semibold">19 Sep 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Ventas Totales */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex justify-between items-start mb-3">
              <div className="text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">YTD</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Ventas Totales</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(datosReales.ventas)}</p>
            <p className="text-xs text-gray-500 mt-2">52,891 transacciones</p>
          </div>

          {/* Total Egresos */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
            <div className="flex justify-between items-start mb-3">
              <div className="text-red-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">97.09%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Egresos</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(datosReales.totalEgresos)}</p>
            <p className="text-xs text-gray-500 mt-2">Costos + Gastos + Payroll</p>
          </div>

          {/* Utilidad Bruta */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex justify-between items-start mb-3">
              <div className="text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">⚠️ Bajo</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Utilidad Bruta</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(datosReales.utilidadBruta)}</p>
            <p className="text-xs text-gray-500 mt-2">Ventas - Egresos</p>
          </div>

          {/* Rentabilidad */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex justify-between items-start mb-3">
              <div className="text-purple-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Meta: 5%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Rentabilidad</p>
            <p className="text-2xl font-bold text-gray-900">{datosReales.rentabilidad}%</p>
            <p className="text-xs text-red-600 mt-2">⚠️ Por debajo del objetivo</p>
          </div>
        </div>

        {/* Distribución de Egresos y Tendencia de Ventas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribución de Egresos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución de Egresos</h3>
            <div className="space-y-4">
              {distribucionEgresos.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.concepto}</span>
                    <span className="text-sm text-gray-600">{formatCurrency(item.monto)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${item.porcentaje}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.porcentaje}% del total</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Egresos</span>
                <span className="font-bold text-xl text-gray-900">{formatCurrency(datosReales.totalEgresos)}</span>
              </div>
            </div>
          </div>

          {/* Ventas Semanales */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ventas Semanales Recientes</h3>
            <div className="space-y-2">
              {ventasPorSemana.slice(0, 8).map((semana, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">{semana.semana}</span>
                    {semana.tipo === 'actual' && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Actual</span>
                    )}
                    {semana.tipo === 'mejor' && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Top</span>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">{formatCurrency(semana.ventas)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerta de Rentabilidad */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-yellow-800">Análisis de Rentabilidad</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>La rentabilidad actual (2.91%) está por debajo del objetivo del 5%. Recomendaciones:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Los costos representan el 69% de los egresos - revisar proveedores</li>
                  <li>El payroll es el 18.77% - dentro del rango aceptable</li>
                  <li>Margen de utilidad: ${formatCurrency(datosReales.utilidadBruta)} de ${formatCurrency(datosReales.ventas)}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
