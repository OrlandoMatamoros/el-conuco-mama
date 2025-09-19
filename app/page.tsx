'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">El Conuco de Mama</h1>
                <p className="text-xs text-gray-500">Sistema de Gestion Inteligente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Control Total de tu Negocio
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualiza metricas, procesa facturas y toma decisiones inteligentes con IA
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/dashboard" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Ejecutivo</h3>
              <p className="text-gray-600">Visualiza KPIs en tiempo real y tendencias del negocio</p>
            </div>
          </Link>

          <Link href="/documentos-facturas" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Captura de Facturas</h3>
              <p className="text-gray-600">Digitaliza documentos con tu camara o sube archivos</p>
            </div>
          </Link>

          <div className="group opacity-75">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">CFO Virtual con IA</h3>
              <p className="text-gray-600">Analisis financiero inteligente</p>
              <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                Proximamente
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1,234</div>
              <div className="text-gray-600 text-sm mt-1">Facturas Procesadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">98%</div>
              <div className="text-gray-600 text-sm mt-1">Precision OCR</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <div className="text-gray-600 text-sm mt-1">Disponibilidad</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">5min</div>
              <div className="text-gray-600 text-sm mt-1">Procesamiento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">Powered by TuImpulsaLab</p>
        </div>
      </div>
    </div>
  )
}
