'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react'

export default function DashboardConectado() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [periodo1, setPeriodo1] = useState('actual')
  const [periodo2, setPeriodo2] = useState('anterior')
  
  // Cargar datos desde Google Sheets
  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/sheets?periodo=${periodo1}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [periodo1, periodo2])
  
  // Función para calcular variación
  const calcularVariacion = (actual: number, anterior: number) => {
    if (anterior === 0) return 0
    return ((actual - anterior) / anterior * 100).toFixed(1)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="animate-spin h-8 w-8 text-green-600" />
        <span className="ml-2">Cargando datos de Google Sheets...</span>
      </div>
    )
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Selector de Períodos */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
        <div>
          <label className="text-sm text-gray-600">Período 1</label>
          <Select value={periodo1} onValueChange={setPeriodo1}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hoy">Hoy</SelectItem>
              <SelectItem value="ayer">Ayer</SelectItem>
              <SelectItem value="semana-actual">Semana Actual</SelectItem>
              <SelectItem value="semana-anterior">Semana Anterior</SelectItem>
              <SelectItem value="mes-actual">Mes Actual</SelectItem>
              <SelectItem value="mes-anterior">Mes Anterior</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="año">Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-2xl font-bold text-gray-400">VS</div>
        
        <div>
          <label className="text-sm text-gray-600">Período 2</label>
          <Select value={periodo2} onValueChange={setPeriodo2}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ayer">Ayer</SelectItem>
              <SelectItem value="semana-anterior">Semana Anterior</SelectItem>
              <SelectItem value="mes-anterior">Mes Anterior</SelectItem>
              <SelectItem value="trimestre-anterior">Trimestre Anterior</SelectItem>
              <SelectItem value="año-anterior">Año Anterior</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={loadData} className="ml-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>
      
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <DollarSign className="h-8 w-8 text-green-600" />
              <span className={`text-sm ${data?.comparativas?.variacion > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data?.comparativas?.variacion > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {Math.abs(data?.comparativas?.variacion || 0)}%
              </span>
            </div>
            <p className="text-2xl font-bold mt-2">${(data?.ventas || 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Ventas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Package className="h-8 w-8 text-blue-600" />
              <span className="text-sm text-gray-600">
                {data?.margen || 0}%
              </span>
            </div>
            <p className="text-2xl font-bold mt-2">${(data?.gastos || 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Gastos</p>
          </CardContent>
        </Card>
        
        {/* Más KPIs aquí... */}
      </div>
      
      {/* Tabla de Productos */}
      {data?.productos && data.productos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Producto</th>
                  <th className="text-right p-2">Ventas</th>
                  <th className="text-right p-2">Unidades</th>
                  <th className="text-right p-2">Margen</th>
                </tr>
              </thead>
              <tbody>
                {data.productos.slice(0, 10).map((producto: any, idx: number) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{producto.nombre}</td>
                    <td className="text-right p-2">${producto.ventas.toLocaleString()}</td>
                    <td className="text-right p-2">{producto.unidades}</td>
                    <td className="text-right p-2">{producto.margen}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
