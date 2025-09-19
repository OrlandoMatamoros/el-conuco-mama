'use client'

import React, { useState, useEffect } from 'react'

// Paleta de colores del Conuco
const colors = {
  primary: '#4AED3B',      // Verde brillante principal
  secondary: '#E1ED3B',    // Amarillo lima
  accent: '#3BED6B',       // Verde agua
  light: '#BDED8A',        // Verde claro
  medium: '#97ED3B',       // Verde medio
  warm: '#F0E47D',         // Amarillo cálido
  
  // Para gráficos y datos
  chart: [
    '#4AED3B',  // Verde brillante
    '#E1ED3B',  // Amarillo lima
    '#3BED6B',  // Verde agua
    '#97ED3B',  // Verde medio
    '#F0E47D',  // Amarillo cálido
    '#BDED8A'   // Verde claro
  ]
}

interface DashboardData {
  ventasTotales: number
  costosTotales: number
  margenBruto: number
  margenPorcentaje: number
  clientesUnicos: number
  transacciones: number
  ticketPromedio: number
  productosVendidos: number
  ventasVsPeriodoAnterior: number
  costosVsPeriodoAnterior: number
  margenVsPeriodoAnterior: number
  
  datosPorPeriodo: {
    [key: string]: {
      ventas: number
      costos: number
      margen: number
      transacciones: number
    }
  }
  
  topProductos: Array<{
    producto: string
    ventas: number
    unidades: number
    margen: number
    categoria: string
  }>
  
  ventasPorCategoria: Array<{
    categoria: string
    ventas: number
    porcentaje: number
  }>
}

export default function DashboardConuco() {
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('mes-actual')
  const [comparePeriod, setComparePeriod] = useState('mes-anterior')
  const [data, setData] = useState<DashboardData | null>(null)
  
  const periods = [
    { value: 'hoy', label: 'Hoy' },
    { value: 'ayer', label: 'Ayer' },
    { value: 'semana-actual', label: 'Semana Actual' },
    { value: 'semana-anterior', label: 'Semana Anterior' },
    { value: 'mes-actual', label: 'Mes Actual' },
    { value: 'mes-anterior', label: 'Mes Anterior' },
    { value: 'trimestre-actual', label: 'Trimestre Actual' },
    { value: 'trimestre-anterior', label: 'Trimestre Anterior' },
    { value: 'año-actual', label: 'Año Actual' },
    { value: 'año-anterior', label: 'Año Anterior' }
  ]
  
  useEffect(() => {
    loadDashboardData()
  }, [selectedPeriod, comparePeriod])
  
  const loadDashboardData = async () => {
    setLoading(true)
    
    const mockData: DashboardData = {
      ventasTotales: 2456789.50,
      costosTotales: 1845678.25,
      margenBruto: 611111.25,
      margenPorcentaje: 24.9,
      clientesUnicos: 234,
      transacciones: 1456,
      ticketPromedio: 1687.22,
      productosVendidos: 8956,
      ventasVsPeriodoAnterior: 15.3,
      costosVsPeriodoAnterior: 8.7,
      margenVsPeriodoAnterior: 2.6,
      
      datosPorPeriodo: {
        'hoy': { ventas: 85234, costos: 63925, margen: 21309, transacciones: 48 },
        'ayer': { ventas: 78456, costos: 58842, margen: 19614, transacciones: 44 },
        'semana-actual': { ventas: 485000, costos: 363750, margen: 121250, transacciones: 287 },
        'mes-actual': { ventas: 2456789, costos: 1845678, margen: 611111, transacciones: 1456 }
      },
      
      topProductos: [
        { producto: 'Pollo Fresco (Libra)', ventas: 245678, unidades: 3456, margen: 28.5, categoria: 'Carnes' },
        { producto: 'Res Molida (Libra)', ventas: 198765, unidades: 2134, margen: 32.1, categoria: 'Carnes' },
        { producto: 'Cerdo (Libra)', ventas: 156789, unidades: 1876, margen: 26.8, categoria: 'Carnes' },
        { producto: 'Plátano Verde (Unidad)', ventas: 98765, unidades: 8765, margen: 45.2, categoria: 'Vegetales' },
        { producto: 'Yuca (Libra)', ventas: 87654, unidades: 4532, margen: 38.7, categoria: 'Vegetales' },
        { producto: 'Arroz (Libra)', ventas: 76543, unidades: 5432, margen: 22.3, categoria: 'Granos' },
        { producto: 'Habichuela (Libra)', ventas: 65432, unidades: 3210, margen: 35.6, categoria: 'Granos' },
        { producto: 'Aceite (Galón)', ventas: 54321, unidades: 876, margen: 18.9, categoria: 'Aceites' }
      ],
      
      ventasPorCategoria: [
        { categoria: 'Carnes', ventas: 785234, porcentaje: 32 },
        { categoria: 'Vegetales', ventas: 614567, porcentaje: 25 },
        { categoria: 'Granos', ventas: 490123, porcentaje: 20 },
        { categoria: 'Lácteos', ventas: 367890, porcentaje: 15 },
        { categoria: 'Otros', ventas: 196789, porcentaje: 8 }
      ]
    }
    
    setData(mockData)
    setLoading(false)
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-yellow-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#4AED3B] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    )
  }
  
  if (!data) return null
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-50">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-[#4AED3B] via-[#97ED3B] to-[#E1ED3B] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard - El Conuco de Mamá</h1>
              <p className="text-sm text-gray-800">Sistema de Análisis de Ventas y Márgenes</p>
            </div>
            <div className="text-sm text-gray-800 font-medium">
              Última actualización: {new Date().toLocaleString('es-DO')}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* SEGMENTADORES DE TIEMPO */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-6 border-2 border-[#BDED8A]">
          <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
            <div className="w-4 h-4 bg-[#4AED3B] rounded-full mr-2"></div>
            Segmentadores de Período
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período Principal
              </label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-3 border-2 border-[#4AED3B] rounded-lg focus:ring-2 focus:ring-[#3BED6B] font-medium bg-green-50"
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
                value={comparePeriod}
                onChange={(e) => setComparePeriod(e.target.value)}
                className="w-full p-3 border-2 border-[#E1ED3B] rounded-lg focus:ring-2 focus:ring-[#F0E47D] font-medium bg-yellow-50"
              >
                {periods.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                className="w-full p-3 bg-gradient-to-r from-[#4AED3B] to-[#3BED6B] text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                onClick={loadDashboardData}
              >
                Actualizar Datos
              </button>
            </div>
          </div>
        </div>
        
        {/* KPIs PRINCIPALES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#4AED3B] hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Ventas Totales</span>
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                data.ventasVsPeriodoAnterior > 0 
                  ? 'bg-[#BDED8A] text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {formatPercentage(data.ventasVsPeriodoAnterior)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.ventasTotales)}</p>
            <div className="mt-2 h-1 bg-gradient-to-r from-[#4AED3B] to-[#97ED3B] rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#E1ED3B] hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Costos Totales</span>
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                data.costosVsPeriodoAnterior < 10 
                  ? 'bg-[#BDED8A] text-green-800' 
                  : 'bg-[#F0E47D] text-yellow-800'
              }`}>
                {formatPercentage(data.costosVsPeriodoAnterior)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.costosTotales)}</p>
            <div className="mt-2 h-1 bg-gradient-to-r from-[#E1ED3B] to-[#F0E47D] rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#3BED6B] hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Margen Bruto</span>
              <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                data.margenVsPeriodoAnterior > 0 
                  ? 'bg-[#BDED8A] text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {formatPercentage(data.margenVsPeriodoAnterior)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.margenBruto)}</p>
            <p className="text-sm text-gray-600 font-medium">{data.margenPorcentaje.toFixed(1)}% del total</p>
            <div className="mt-2 h-1 bg-gradient-to-r from-[#3BED6B] to-[#4AED3B] rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-[#97ED3B] hover:shadow-xl transition-shadow">
            <span className="text-gray-600 text-sm font-medium">Ticket Promedio</span>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.ticketPromedio)}</p>
            <p className="text-sm text-gray-600 font-medium">{data.transacciones} transacciones</p>
            <div className="mt-2 h-1 bg-gradient-to-r from-[#97ED3B] to-[#BDED8A] rounded-full"></div>
          </div>
        </div>
        
        {/* TABLAS Y GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Productos */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-[#4AED3B] to-[#97ED3B]">
              <h3 className="text-lg font-bold text-white">Top 8 Productos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F0E47D] bg-opacity-30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Producto</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Ventas</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Unidades</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-gray-700 uppercase">Margen %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.topProductos.map((producto, idx) => (
                    <tr key={idx} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{producto.producto}</p>
                          <p className="text-xs text-gray-500">{producto.categoria}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-800">
                        {formatCurrency(producto.ventas)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {producto.unidades.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                          producto.margen > 30 ? 'bg-[#4AED3B] text-white' : 
                          producto.margen > 20 ? 'bg-[#E1ED3B] text-gray-800' : 
                          'bg-[#F0E47D] text-gray-800'
                        }`}>
                          {producto.margen}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Ventas por Categoría */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-[#E1ED3B] to-[#F0E47D]">
              <h3 className="text-lg font-bold text-gray-800">Distribución por Categoría</h3>
            </div>
            <div className="p-6">
              {data.ventasPorCategoria.map((cat, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-gray-800">{cat.categoria}</span>
                    <span className="font-medium">{formatCurrency(cat.ventas)} ({cat.porcentaje}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-7 overflow-hidden">
                    <div 
                      className="h-full rounded-full flex items-center justify-center text-xs text-white font-bold shadow-inner"
                      style={{ 
                        width: `${cat.porcentaje}%`,
                        background: `linear-gradient(90deg, ${colors.chart[idx % colors.chart.length]}, ${colors.chart[(idx + 1) % colors.chart.length]})`
                      }}
                    >
                      {cat.porcentaje}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
