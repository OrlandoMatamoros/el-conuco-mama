'use client'

import React, { useState, useEffect } from 'react'
import ConucoPeriodSelector from '@/components/dashboard/ConucoPeriodSelector'
import ConucoKPICards from '@/components/dashboard/ConucoKPICards'
import CFOChat from '@/components/CFOChat'

export default function ConucoMainDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes')
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])

  // Cargar datos cuando cambia el período
  useEffect(() => {
    loadDashboardData(selectedPeriod)
  }, [selectedPeriod])

  const loadDashboardData = async (period: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/dashboard?period=${period}`)
      const data = await response.json()
      
      if (data.success) {
        setDashboardData(data.data)
        
        // Cargar alertas del CFO
        const alertsResponse = await fetch(`/api/cfo/alerts?period=${period}`)
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData.alerts || [])
      }
    } catch (error) {
      console.error('Error cargando dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Ejecutivo</h1>
              <p className="text-gray-600">El Conuco de Mamá - Análisis en Tiempo Real</p>
            </div>
            <ConucoPeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          </div>
        </div>

        {/* Alertas */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  alert.type === 'critical' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                <p className="font-medium">{alert.message}</p>
                <p className="text-sm mt-1">{alert.recommendation}</p>
              </div>
            ))}
          </div>
        )}

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KPIs y Gráficos */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando datos...</p>
              </div>
            ) : (
              <>
                <ConucoKPICards data={dashboardData} />
                {/* Aquí irían los gráficos */}
              </>
            )}
          </div>

          {/* Chat CFO */}
          <div className="lg:col-span-1">
            <CFOChat period={selectedPeriod} />
          </div>
        </div>
      </div>
    </div>
  )
}
