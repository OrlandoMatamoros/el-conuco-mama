'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            El Conuco de Mamá
          </h1>
          <p className="text-xl text-gray-600">
            Sistema de Gestión Integral
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/dashboard" className="block">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">
                Ver métricas, comparar períodos y analizar el negocio
              </p>
              <div className="mt-4 text-green-600 font-semibold">
                Entrar →
              </div>
            </div>
          </Link>

          <Link href="/facturas" className="block">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📸</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Facturas</h2>
              <p className="text-gray-600">
                Capturar y procesar documentos con el móvil
              </p>
              <div className="mt-4 text-green-600 font-semibold">
                Entrar →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
