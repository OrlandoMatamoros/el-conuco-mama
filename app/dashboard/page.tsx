'use client'

import React, { useState, useEffect } from 'react'

export default function ConucoDashboard() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [cfoResponse, setCfoResponse] = useState('')
  const [askingCFO, setAskingCFO] = useState(false)
  const [chatHistory, setChatHistory] = useState<any[]>([])

  useEffect(() => {
    // Primero sincronizar desde Excel, luego cargar métricas
    fetch('/api/metrics/sync-from-excel')
      .then(() => fetch('/api/metrics/current'))
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMetrics(data.data)
        }
        setLoading(false)
      })
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const askCFO = async () => {
    if (!question.trim()) return
    
    setAskingCFO(true)
    const currentQuestion = question
    setQuestion('') // Limpiar automáticamente la barra
    
    try {
      const response = await fetch('/api/cfo/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestion })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCfoResponse(data.response)
        // Agregar al historial
        setChatHistory([...chatHistory, {
          q: currentQuestion,
          a: data.response,
          time: new Date().toLocaleTimeString()
        }])
      } else {
        setCfoResponse('Error al procesar la pregunta')
      }
    } catch (error) {
      setCfoResponse('Error de conexión')
    } finally {
      setAskingCFO(false)
    }
  }

  const clearChat = () => {
    setCfoResponse('')
    setChatHistory([])
    setQuestion('')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-700">Cargando datos desde Excel...</p>
      </div>
    </div>
  }

  if (!metrics) {
    return <div className="p-8 text-gray-700">No hay datos disponibles</div>
  }

  const distribucionEgresos = [
    { concepto: 'Costos', valor: metrics.costos, porcentaje: (metrics.costos / metrics.totalEgresos * 100).toFixed(1), color: 'bg-red-500' },
    { concepto: 'Payroll', valor: metrics.payroll, porcentaje: (metrics.payroll / metrics.totalEgresos * 100).toFixed(1), color: 'bg-blue-500' },
    { concepto: 'Gastos', valor: metrics.gastos, porcentaje: (metrics.gastos / metrics.totalEgresos * 100).toFixed(1), color: 'bg-yellow-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">El Conuco de Mamá</h1>
              <p className="text-sm text-gray-700 mt-1">Dashboard Ejecutivo - Datos Reales YTD 2025</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Última actualización</p>
              <p className="text-sm font-semibold text-gray-800">{new Date(metrics.timestamp).toLocaleString('es-DO')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex justify-between items-start mb-3">
              <div className="text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">YTD</span>
            </div>
            <p className="text-sm text-gray-700 mb-1 font-medium">Ventas Totales</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.ventas)}</p>
            <p className="text-xs text-gray-700 mt-2 font-medium">52,891 transacciones</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-500">
            <div className="flex justify-between items-start mb-3">
              <div className="text-red-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                {((metrics.totalEgresos / metrics.ventas) * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-1 font-medium">Total Egresos</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalEgresos)}</p>
            <p className="text-xs text-gray-700 mt-2 font-medium">Costos + Gastos + Payroll</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex justify-between items-start mb-3">
              <div className="text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">⚠️ Bajo</span>
            </div>
            <p className="text-sm text-gray-700 mb-1 font-medium">Utilidad Bruta</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.utilidadBruta)}</p>
            <p className="text-xs text-gray-700 mt-2 font-medium">Ventas - Egresos</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex justify-between items-start mb-3">
              <div className="text-purple-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">Meta: 5%</span>
            </div>
            <p className="text-sm text-gray-700 mb-1 font-medium">Rentabilidad</p>
            <p className="text-2xl font-bold text-gray-900">{metrics.margenBruto}%</p>
            <p className="text-xs text-red-600 mt-2 font-semibold">⚠️ Por debajo del objetivo</p>
          </div>
        </div>

        {/* Análisis de Rentabilidad */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-yellow-800">Análisis de Rentabilidad</h3>
              <div className="mt-2 text-sm text-yellow-800">
                <p className="font-medium">La rentabilidad actual ({metrics.margenBruto}%) está por debajo del objetivo del 5%. Recomendaciones:</p>
                <ul className="list-disc list-inside mt-2 text-yellow-700">
                  <li>Los costos representan el {(metrics.costos / metrics.totalEgresos * 100).toFixed(0)}% de los egresos - revisar proveedores</li>
                  <li>El payroll es el {(metrics.payroll / metrics.totalEgresos * 100).toFixed(1)}% - dentro del rango aceptable</li>
                  <li>Margen de utilidad: {formatCurrency(metrics.utilidadBruta)} de {formatCurrency(metrics.ventas)}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal con CFO Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Métricas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Distribución de Egresos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución de Egresos</h3>
              <div className="space-y-4">
                {distribucionEgresos.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-800">{item.concepto}</span>
                      <span className="text-sm font-medium text-gray-700">{formatCurrency(item.valor)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${item.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${item.porcentaje}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-700 mt-1 font-medium">{item.porcentaje}% del total</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Egresos</span>
                  <span className="font-bold text-xl text-gray-900">{formatCurrency(metrics.totalEgresos)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - CFO Chat */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  CFO Virtual
                </h3>
                {chatHistory.length > 0 && (
                  <button onClick={clearChat} className="text-xs text-red-600 hover:underline font-medium">
                    Limpiar
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Historial */}
                {chatHistory.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto text-xs">
                    {chatHistory.map((item, i) => (
                      <div key={i} className="mb-2 pb-2 border-b border-gray-300">
                        <p className="text-purple-700 font-medium">{item.time} - {item.q}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Respuesta actual */}
                <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] max-h-64 overflow-y-auto">
                  {cfoResponse ? (
                    <div className="text-sm text-gray-800 font-medium">{cfoResponse}</div>
                  ) : (
                    <p className="text-sm text-gray-700">Hola. El margen neto actual de El Conuco de Mamá es del {metrics.margenBruto}%, por debajo de la meta del 5%. Se debe trabajar en reducir los costos y gastos para mejorar la rentabilidad de la empresa.</p>
                  )}
                </div>
                
                {/* Input */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && askCFO()}
                    placeholder="Pregunta sobre tus métricas..."
                    className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-600 text-gray-800"
                  />
                  <button
                    onClick={askCFO}
                    disabled={askingCFO || !question.trim()}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-medium"
                  >
                    {askingCFO ? 'Analizando...' : 'Preguntar'}
                  </button>
                </div>
                
                {/* Sugerencias */}
                <div className="border-t pt-3 border-gray-300">
                  <p className="text-xs text-gray-700 mb-2 font-medium">Preguntas sugeridas:</p>
                  <div className="space-y-1">
                    {[
                      '¿Cuál es mi margen de utilidad?',
                      '¿Cuál producto se vende más?',
                      '¿Cómo puedo mejorar la rentabilidad?'
                    ].map((q, i) => (
                      <button 
                        key={i}
                        onClick={() => setQuestion(q)}
                        className="text-xs text-purple-700 hover:underline block text-left font-medium"
                      >{q}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
