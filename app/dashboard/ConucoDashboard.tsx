'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ConucoTimeSelector from '@/components/dashboard/ConucoTimeSelector'
import ConucoComparisonCards from '@/components/dashboard/ConucoComparisonCards'
import ConucoRevenueChart from '@/components/dashboard/ConucoRevenueChart'
import ConucoExpenseBreakdown from '@/components/dashboard/ConucoExpenseBreakdown'
import { RefreshCw, Menu, X, Brain, FileText, Database, TrendingUp } from 'lucide-react'

const ConucoDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    loadRealData()
  }, [])

  const loadRealData = async () => {
    setIsLoading(true)
    try {
      // Cargar ventas
      const salesResponse = await fetch('/data/itemsales_by_custom.csv')
      const salesText = await salesResponse.text()
      const salesData = processSalesData(salesText)
      
      // Cargar inventario
      const invResponse = await fetch('/data/invonhand_by_day.csv')
      const invText = await invResponse.text()
      const invData = processInventoryData(invText)
      
      // Cargar costos
      const costResponse = await fetch('/data/COSTOS.csv')
      const costText = await costResponse.text()
      const costData = processCostData(costText)
      
      // Cargar payroll
      const payrollResponse = await fetch('/data/Payroll.csv')
      const payrollText = await payrollResponse.text()
      const payrollData = processPayrollData(payrollText)
      
      // Cargar gastos
      const gastosResponse = await fetch('/data/Gastos.csv')
      const gastosText = await gastosResponse.text()
      const gastosData = processGastosData(gastosText)
      
      // Calcular métricas reales
      const totalCosts = costData.total
      const totalPayroll = payrollData.total
      const totalExpenses = gastosData.total
      const totalOperatingCosts = totalCosts + totalPayroll + totalExpenses
      const profit = salesData.total - totalOperatingCosts
      const margin = (profit / salesData.total) * 100
      
      const combinedData = {
        sales: salesData.total,
        transactions: salesData.count,
        avgTicket: salesData.total / salesData.count,
        inventory: invData.totalItems,
        itemCount: invData.count,
        costs: totalCosts,
        payroll: totalPayroll,
        expenses: totalExpenses,
        profit: profit,
        margin: margin,
        departmentSales: salesData.byDepartment,
        topProducts: salesData.topProducts
      }
      
      console.log('Datos procesados:', combinedData)
      setDashboardData(combinedData)
      updateTimestamp()
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const processSalesData = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim())
    
    let total = 0
    let count = 0
    const byDepartment: any = {}
    const topProducts: any[] = []
    
    // Empezar desde línea 1 (saltar headers)
    for (let i = 1; i < lines.length && i < 100; i++) { // Limitar para pruebas
      try {
        // Remover comillas y dividir por coma
        const line = lines[i].replace(/"/g, '')
        const values = line.split(',')
        
        if (values.length >= 8) {
          const department = values[1]?.trim() || 'Other'
          const item = values[3]?.trim()
          const baskets = parseInt(values[4]) || 0
          const items = parseInt(values[5]) || 0
          // Procesar valor monetario: remover $ y convertir
          const salesStr = values[7]?.trim().replace('$', '').replace(',', '')
          const sales = parseFloat(salesStr) || 0
          
          if (sales > 0) {
            total += sales
            count += baskets // Usar baskets como número de transacciones
            
            // Por departamento
            if (!byDepartment[department]) byDepartment[department] = 0
            byDepartment[department] += sales
            
            // Top productos
            if (topProducts.length < 10) {
              topProducts.push({ item, sales, units: items })
            }
          }
        }
      } catch (err) {
        console.error('Error en línea:', i, err)
      }
    }
    
    return { total, count, byDepartment, topProducts }
  }

  const processInventoryData = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim())
    let totalItems = 0
    let count = 0
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i].replace(/"/g, '')
        const values = line.split(',')
        
        const quantity = parseInt(values[3]) || 0
        if (quantity > 0) {
          totalItems += quantity
          count++
        }
      } catch (err) {
        continue
      }
    }
    
    return { totalItems, count }
  }

  const processCostData = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim())
    let total = 0
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(';')
        if (values.length >= 4) {
          // El valor está en la posición 3, formato: $ XXX,XX
          const valueStr = values[3]?.trim()
            .replace('$', '')
            .replace(/\s/g, '')
            .replace(',', '.')
          
          const value = parseFloat(valueStr) || 0
          if (value > 0) total += value
        }
      } catch (err) {
        continue
      }
    }
    
    return { total }
  }

  const processPayrollData = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim())
    let total = 0
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(';')
        if (values.length >= 16) {
          // Sueldo base está en posición 15
          const salaryStr = values[15]?.trim()
            .replace('$', '')
            .replace(/\s/g, '')
            .replace(',', '.')
          
          const salary = parseFloat(salaryStr) || 0
          if (salary > 0) total += salary
        }
      } catch (err) {
        continue
      }
    }
    
    return { total }
  }

  const processGastosData = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim())
    let total = 0
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(';')
        if (values.length >= 3) {
          // Valor en posición 2
          const valueStr = values[2]?.trim()
            .replace('$', '')
            .replace(/\s/g, '')
            .replace('.', '') // Remover separador de miles
            .replace(',', '.') // Convertir coma decimal a punto
          
          const value = parseFloat(valueStr) || 0
          if (value > 0) total += value
        }
      } catch (err) {
        continue
      }
    }
    
    return { total }
  }

  const updateTimestamp = () => {
    setLastUpdate(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Brain className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventario', icon: <Database className="w-4 h-4" /> },
    { id: 'reports', label: 'Reportes', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Análisis', icon: <TrendingUp className="w-4 h-4" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-amber-500/20 transform transition-transform duration-300 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white rounded-xl p-1 shadow-xl">
                  <Image 
                    src="/conuco-logo.png" 
                    alt="El Conuco" 
                    width={48} 
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">El Conuco</h2>
                  <p className="text-amber-200/60 text-xs">de Mamá</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navigationItems.map(item => (
                  <button key={item.id} className={`w-full text-left px-4 py-3 rounded-xl transition-all ${item.id === 'dashboard' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white' : 'hover:bg-white/10 text-white/80'}`}>
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </nav>

            <div className="p-4 border-t border-amber-500/20 text-center">
              <p className="text-amber-200/60 text-xs">Powered by</p>
              <p className="text-amber-400 font-bold">IMPULSA LAB</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 bg-white/10 rounded-lg">
                  {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">Dashboard Financiero</h1>
                  <p className="text-amber-200/60 text-sm">
                    {dashboardData ? (
                      <>
                        Ventas: ${dashboardData.sales?.toFixed(2)} • 
                        Margen: {dashboardData.margin?.toFixed(1)}% • 
                        {dashboardData.transactions} transacciones
                      </>
                    ) : 'Cargando datos del POS...'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-amber-200/40 text-sm">{lastUpdate}</span>
                <button onClick={loadRealData} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                  <RefreshCw className={`w-4 h-4 text-amber-200 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <ConucoTimeSelector onRangeChange={setTimeRange} />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mb-4"></div>
                  <p className="text-white/60">Procesando datos del POS NRS Plus...</p>
                </div>
              </div>
            ) : dashboardData && (
              <div className="space-y-8">
                <ConucoComparisonCards
                  currentPeriod={timeRange?.label || 'Datos Actuales'}
                  previousPeriod="Período Anterior"
                  data={dashboardData}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ConucoRevenueChart data={dashboardData} period={timeRange?.granularity || 'month'} />
                  <ConucoExpenseBreakdown data={dashboardData} />
                </div>

                {/* Indicador de datos reales */}
                <div className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-500/30">
                  <p className="text-green-400 font-bold text-center">
                    ✅ DATOS REALES NRS PLUS • {dashboardData.itemCount} productos • ${dashboardData.avgTicket?.toFixed(2)} ticket promedio
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConucoDashboard
