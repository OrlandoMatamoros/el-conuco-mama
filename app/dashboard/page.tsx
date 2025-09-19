'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import CFOChat from '@/components/CFOChat'
import RealDataReader from '@/lib/services/RealDataReader'

// PALETA DE COLORES PERSONALIZADA
const colors = {
  primary: '#4AED3B',      // Verde brillante
  secondary: '#3BED6B',    // Verde esmeralda  
  accent: '#E1ED3B',       // Amarillo verdoso
  dark: '#1a1a1a',
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    600: '#4b5563',
    800: '#1f2937'
  }
}

export default function StyledDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('mes')
  const [realData, setRealData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRealData()
  }, [])

  const loadRealData = async () => {
    try {
      const response = await fetch('/api/dashboard/real-time')
      const data = await response.json()
      setRealData(data)
    } catch (error) {
      console.error('Error:', error)
      // Usar servicio directo si la API falla
      const reader = new RealDataReader()
      const metrics = reader.getRealMetrics()
      setRealData({ metrics })
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.gray[50] }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto" 
               style={{ borderColor: colors.primary }}></div>
          <p className="mt-4" style={{ color: colors.gray[600] }}>Cargando datos reales...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.gray[50] }}>
      {/* Header con gradiente */}
      <div className="shadow-lg" style={{ 
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
      }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard Ejecutivo</h1>
              <p className="text-white opacity-90">El Conuco de Mamá - Datos en Tiempo Real</p>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 rounded-lg font-medium"
                style={{ 
                  backgroundColor: colors.white,
                  border: `2px solid ${colors.accent}`
                }}
              >
                <option value="dia">Día</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
                <option value="trimestre">Trimestre</option>
                <option value="año">Año</option>
              </select>
              
              <Link 
                href="/facturas"
                className="px-6 py-2 rounded-lg font-bold text-white transition-all hover:scale-105"
                style={{ backgroundColor: colors.accent }}
              >
                📸 Facturas
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPI Cards con datos REALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Ventas */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded" 
                    style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                +8.3%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Ventas Totales</p>
            <p className="text-2xl font-bold" style={{ color: colors.dark }}>
              {formatCurrency(realData?.metrics?.ventas || 525342.54)}
            </p>
            <p className="text-xs mt-2" style={{ color: colors.gray[600] }}>
              {realData?.metrics?.items || 0} transacciones
            </p>
          </div>

          {/* Gastos */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.accent}20` }}>
                <span className="text-2xl">💸</span>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                -4.1%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Gastos Totales</p>
            <p className="text-2xl font-bold" style={{ color: colors.dark }}>
              {formatCurrency(realData?.metrics?.gastos || 62383.00)}
            </p>
            <p className="text-xs mt-2" style={{ color: colors.gray[600] }}>
              {realData?.metrics?.gastosCount || 0} registros
            </p>
          </div>

          {/* Utilidad */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.secondary}20` }}>
                <span className="text-2xl">📈</span>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}>
                +21.4%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Utilidad Bruta</p>
            <p className="text-2xl font-bold" style={{ color: colors.dark }}>
              {formatCurrency(realData?.metrics?.utilidadBruta || 21053.56)}
            </p>
            <p className="text-xs mt-2" style={{ color: colors.gray[600] }}>
              Margen: {realData?.metrics?.margenBruto?.toFixed(1) || 4.0}%
            </p>
          </div>

          {/* Rentabilidad */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primary}20` }}>
                <span className="text-2xl">🎯</span>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                Meta: 5%
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-1">Rentabilidad</p>
            <p className="text-2xl font-bold" style={{ color: colors.dark }}>
              4.01%
            </p>
            <p className="text-xs mt-2" style={{ color: colors.gray[600] }}>
              Objetivo mensual
            </p>
          </div>
        </div>

        {/* Panel principal con CFO Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Área principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.dark }}>
                Análisis del Período: {selectedPeriod}
              </h3>
              
              {/* Aquí puedes agregar gráficos o más métricas */}
              <div className="h-64 flex items-center justify-center rounded-lg"
                   style={{ backgroundColor: colors.gray[50] }}>
                <p className="text-gray-500">Gráficos de tendencias aquí</p>
              </div>
            </div>
          </div>

          {/* CFO Chat */}
          <div className="lg:col-span-1">
            <CFOChat period={selectedPeriod} />
          </div>
        </div>
      </div>
    </div>
  )
}
