'use client'

import React, { useState, useEffect } from 'react'

// Estructura basada en el Excel real
interface DashboardData {
  // KPIs principales (de la hoja Dashboard)
  ventasTotales: number
  costosTotales: number
  margenBruto: number
  margenPorcentaje: number
  clientesUnicos: number
  transacciones: number
  ticketPromedio: number
  productosVendidos: number
  
  // Comparaciones (calculadas con DAX)
  ventasVsPeriodoAnterior: number
  costosVsPeriodoAnterior: number
  margenVsPeriodoAnterior: number
  
  // Datos por período
  datosPorPeriodo: {
    [key: string]: {
      ventas: number
      costos: number
      margen: number
      transacciones: number
    }
  }
  
  // Top productos
  topProductos: Array<{
    producto: string
    ventas: number
    unidades: number
    margen: number
    categoria: string
  }>
  
  // Ventas por categoría
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
  
  // Períodos disponibles (como en el Excel)
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
  
  // Cargar datos cuando cambian los períodos (como los slicers del Excel)
  useEffect(() => {
    loadDashboardData()
  }, [selectedPeriod, comparePeriod])
  
  const loadDashboardData = async () => {
    setLoading(true)
    
    // Simular datos basados en la estructura del Excel
    // En producción, esto vendría del API que lee el Excel real
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }
  
  if (!data) return null
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard - El Conuco de Mamá</h1>
              <p className="text-sm text-gray-600">Sistema de Análisis de Ventas y Márgenes</p>
            </div>
            <div className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleString('es-DO')}
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* SEGMENTADORES DE TIEMPO - Como los Slicers del Excel */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Segmentadores de Período</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período Principal
              </label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-3 border-2 border-green-500 rounded-lg focus:ring-2 focus:ring-green-600 font-medium"
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
                className="w-full p-3 border-2 border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
              >
                {periods.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button className="w-full p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                🔄 Actualizar Datos
              </button>
            </div>
          </div>
        </div>
        
        {/* KPIs PRINCIPALES - Primera fila del Excel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Ventas Totales</span>
              <span className={`text-sm font-bold ${data.ventasVsPeriodoAnterior > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(data.ventasVsPeriodoAnterior)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.ventasTotales)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Costos Totales</span>
              <span className={`text-sm font-bold ${data.costosVsPeriodoAnterior > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatPercentage(data.costosVsPeriodoAnterior)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.costosTotales)}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Margen Bruto</span>
              <span className={`text-sm font-bold ${data.margenVsPeriodoAnterior > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(data.margenVsPeriodoAnterior)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.margenBruto)}</p>
            <p className="text-sm text-gray-600">{data.margenPorcentaje.toFixed(1)}% del total</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <span className="text-gray-600 text-sm">Ticket Promedio</span>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.ticketPromedio)}</p>
            <p className="text-sm text-gray-600">{data.transacciones} transacciones</p>
          </div>
        </div>
        
        {/* TABLAS Y GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Productos */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Top 8 Productos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ventas</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unidades</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Margen %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.topProductos.map((producto, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{producto.producto}</p>
                          <p className="text-xs text-gray-500">{producto.categoria}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(producto.ventas)}</td>
                      <td className="px-4 py-3 text-right">{producto.unidades.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          producto.margen > 30 ? 'bg-green-100 text-green-800' : 
                          producto.margen > 20 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
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
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">Distribución por Categoría</h3>
            </div>
            <div className="p-6">
              {data.ventasPorCategoria.map((cat, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{cat.categoria}</span>
                    <span>{formatCurrency(cat.ventas)} ({cat.porcentaje}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className="bg-green-600 h-6 rounded-full flex items-center justify-center text-xs text-white font-semibold"
                      style={{ width: `${cat.porcentaje}%` }}
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
