'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import CFOChat from '@/components/CFOChat'

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData(selectedPeriod)
  }, [selectedPeriod])

  const loadDashboardData = async (period: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/dashboard?period=${period}`)
      const data = await response.json()
      console.log('Dashboard data:', data)
      
      if (data.success) {
        setDashboardData(data.data)
        
        const alertsResponse = await fetch(`/api/cfo/alerts?period=${period}`)
        const alertsData = await alertsResponse.json()
        console.log('Alerts:', alertsData)
        setAlerts(alertsData.alerts || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Ejecutivo</h1>
              <p className="text-sm text-gray-600">El Conuco de Mamá - Análisis en Tiempo Real</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Selector de Período */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="dia">Día</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
                <option value="trimestre">Trimestre</option>
                <option value="año">Año</option>
              </select>
              
              <Link 
                href="/facturas"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📸 Facturas
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Alertas */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'critical' 
                    ? 'bg-red-50 text-red-800 border-red-500' 
                    : alert.type === 'success'
                    ? 'bg-green-50 text-green-800 border-green-500'
                    : 'bg-yellow-50 text-yellow-800 border-yellow-500'
                }`}
              >
                <p className="font-semibold">{alert.message}</p>
                <p className="text-sm mt-1 opacity-90">{alert.recommendation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Métricas */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando datos del período {selectedPeriod}...</p>
              </div>
            ) : dashboardData ? (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-500 mb-1">Ventas Actuales</p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatCurrency(dashboardData.current.totalSales)}
                    </p>
                    <p className={`text-sm mt-2 ${dashboardData.change.salesChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(dashboardData.change.salesChange)}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-500 mb-1">Gastos</p>
                    <p className="text-xl font-bold text-gray-800">
                      {formatCurrency(dashboardData.current.totalExpenses)}
                    </p>
                    <p className={`text-sm mt-2 ${dashboardData.change.expenseChange < 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {formatPercent(dashboardData.change.expenseChange)}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-500 mb-1">Margen Bruto</p>
                    <p className="text-xl font-bold text-gray-800">
                      {dashboardData.current.grossMargin}%
                    </p>
                    <p className={`text-sm mt-2 ${dashboardData.change.marginChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {dashboardData.change.marginChange > 0 ? '+' : ''}{dashboardData.change.marginChange.toFixed(1)} pts
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-4">
                    <p className="text-sm text-gray-500 mb-1">Clientes</p>
                    <p className="text-xl font-bold text-gray-800">
                      {dashboardData.current.uniqueCustomers}
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      +{dashboardData.current.uniqueCustomers - dashboardData.previous.uniqueCustomers} nuevos
                    </p>
                  </div>
                </div>

                {/* Tabla de Comparación */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4">
                    <h3 className="text-lg font-bold">Comparación de Períodos - {selectedPeriod}</h3>
                  </div>
                  <div className="p-6">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b">
                          <th className="pb-2">Métrica</th>
                          <th className="pb-2 text-right">Actual</th>
                          <th className="pb-2 text-right">Anterior</th>
                          <th className="pb-2 text-right">Cambio</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr className="border-b">
                          <td className="py-3">Ventas</td>
                          <td className="py-3 text-right font-semibold">
                            {formatCurrency(dashboardData.current.totalSales)}
                          </td>
                          <td className="py-3 text-right text-gray-600">
                            {formatCurrency(dashboardData.previous.totalSales)}
                          </td>
                          <td className={`py-3 text-right font-semibold ${dashboardData.change.salesChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercent(dashboardData.change.salesChange)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Gastos</td>
                          <td className="py-3 text-right font-semibold">
                            {formatCurrency(dashboardData.current.totalExpenses)}
                          </td>
                          <td className="py-3 text-right text-gray-600">
                            {formatCurrency(dashboardData.previous.totalExpenses)}
                          </td>
                          <td className={`py-3 text-right font-semibold ${dashboardData.change.expenseChange < 5 ? 'text-green-600' : 'text-yellow-600'}`}>
                            {formatPercent(dashboardData.change.expenseChange)}
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Margen Bruto</td>
                          <td className="py-3 text-right font-semibold">
                            {dashboardData.current.grossMargin}%
                          </td>
                          <td className="py-3 text-right text-gray-600">
                            {dashboardData.previous.grossMargin}%
                          </td>
                          <td className={`py-3 text-right font-semibold ${dashboardData.change.marginChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dashboardData.change.marginChange > 0 ? '+' : ''}{dashboardData.change.marginChange.toFixed(1)} pts
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3">Clientes Únicos</td>
                          <td className="py-3 text-right font-semibold">
                            {dashboardData.current.uniqueCustomers}
                          </td>
                          <td className="py-3 text-right text-gray-600">
                            {dashboardData.previous.uniqueCustomers}
                          </td>
                          <td className="py-3 text-right font-semibold text-green-600">
                            +{dashboardData.current.uniqueCustomers - dashboardData.previous.uniqueCustomers}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Beneficio Neto: </span>
                        {formatCurrency(dashboardData.current.totalSales - dashboardData.current.totalExpenses)}
                        <span className={`ml-2 ${dashboardData.change.percentageChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({formatPercent(dashboardData.change.percentageChange)})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">No hay datos disponibles</p>
              </div>
            )}
          </div>

          {/* Panel del Chat CFO */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <CFOChat period={selectedPeriod} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
