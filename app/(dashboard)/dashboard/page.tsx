'use client'

import { useState, useEffect } from 'react'
import { getTotalsByPeriod } from '@/lib/utils/dataProcessor'
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters'
import { RefreshCw, Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import Image from 'next/image'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [customDates, setCustomDates] = useState({
    start: '',
    end: ''
  })

  useEffect(() => {
    loadDataForPeriod(selectedPeriod)
  }, [selectedPeriod])

  const loadDataForPeriod = async (period: string) => {
    setLoading(true)
    
    let startDate = new Date()
    let endDate = new Date()
    
    switch(period) {
      case 'today':
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        endDate.setHours(23, 59, 59, 999)
        break
        
      case 'yesterday':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - 1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        endDate.setDate(endDate.getDate() - 1)
        endDate.setHours(23, 59, 59, 999)
        break
        
      case 'week':
        startDate = new Date()
        startDate.setDate(startDate.getDate() - startDate.getDay())
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        endDate.setHours(23, 59, 59, 999)
        break
        
      case 'month':
        startDate = new Date()
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(0)
        endDate.setHours(23, 59, 59, 999)
        break
        
      case 'year':
        startDate = new Date()
        startDate.setMonth(0)
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        endDate.setHours(23, 59, 59, 999)
        break
        
      case 'custom':
        if (customDates.start && customDates.end) {
          startDate = new Date(customDates.start)
          endDate = new Date(customDates.end)
        }
        break
    }
    
    const processedData = getTotalsByPeriod([], selectedPeriod)
    setLoading(false)
  }

  const periods = [
    { value: 'today', label: 'Hoy', icon: '📅' },
    { value: 'yesterday', label: 'Ayer', icon: '📆' },
    { value: 'week', label: 'Esta Semana', icon: '📊' },
    { value: 'month', label: 'Este Mes', icon: '📈' },
    { value: 'year', label: 'Este Año', icon: '📉' },
    { value: 'custom', label: 'Personalizado', icon: '⚙️' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl p-1">
              <Image 
                src="/conuco-logo.png" 
                alt="El Conuco" 
                width={40} 
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                El Conuco de Mamá
              </h1>
              <p className="text-amber-200/60 text-sm">
                {data?.periodo && `Período: ${data.periodo.inicio} - ${data.periodo.fin}`}
              </p>
            </div>
          </div>
          <button 
            onClick={() => loadDataForPeriod(selectedPeriod)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="p-8">
        {/* Selector de Período */}
        <div className="mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-white/60 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Seleccionar Período
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {periods.map(period => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedPeriod === period.value
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                      : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                  }`}
                >
                  <span className="mr-2">{period.icon}</span>
                  {period.label}
                </button>
              ))}
            </div>
            
            {selectedPeriod === 'custom' && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={customDates.start}
                  onChange={(e) => setCustomDates({...customDates, start: e.target.value})}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
                <input
                  type="date"
                  value={customDates.end}
                  onChange={(e) => setCustomDates({...customDates, end: e.target.value})}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
              <p className="text-white/60">Procesando período seleccionado...</p>
            </div>
          </div>
        ) : data && (
          <>
            {/* KPIs Principales con comparación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-6 rounded-2xl border border-amber-500/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-amber-200/60 text-sm uppercase tracking-wider">Ventas</p>
                  {data.cambioVentas !== 0 && (
                    <span className={`flex items-center gap-1 text-sm font-bold ${
                      data.cambioVentas > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {data.cambioVentas > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(data.cambioVentas).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-4xl font-bold text-white">
                  {formatCurrency(data.ventas)}
                </p>
                <p className="text-amber-200/80 text-sm mt-2">
                  {data.transacciones} transacciones
                </p>
                {data.ventasPrevias > 0 && (
                  <p className="text-amber-200/60 text-xs mt-1">
                    Anterior: {formatCurrency(data.ventasPrevias)}
                  </p>
                )}
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-6 rounded-2xl border border-green-500/20">
                <p className="text-green-200/60 text-sm uppercase tracking-wider mb-2">Utilidad</p>
                <p className="text-4xl font-bold text-white">
                  {formatCurrency(data.utilidad)}
                </p>
                <p className="text-green-200/80 text-sm mt-2">
                  Margen: {formatPercentage(data.margen)}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-blue-500/20">
                <p className="text-blue-200/60 text-sm uppercase tracking-wider mb-2">Ticket Promedio</p>
                <p className="text-4xl font-bold text-white">
                  {formatCurrency(data.ticketPromedio)}
                </p>
                <p className="text-blue-200/80 text-sm mt-2">
                  Por transacción
                </p>
              </div>
            </div>
            
            {/* Estructura de Costos */}
            <h2 className="text-white/60 text-sm uppercase tracking-wider mb-4">Estructura de Costos</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-orange-300/60 text-xs uppercase mb-1">Compras</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(data.costos)}
                </p>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-purple-300/60 text-xs uppercase mb-1">Nómina</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(data.nomina)}
                </p>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-red-300/60 text-xs uppercase mb-1">Gastos</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(data.gastos)}
                </p>
              </div>
              
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-yellow-300/60 text-xs uppercase mb-1">Total Costos</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(data.costos + data.nomina + data.gastos)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
