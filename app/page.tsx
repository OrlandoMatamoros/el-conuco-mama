'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BDED8A] via-[#F0E47D] to-[#97ED3B]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            El Conuco de Mamá
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Sistema de Gestión Integral
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/dashboard" className="block transform hover:scale-105 transition-transform">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#4AED3B] hover:shadow-2xl">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Ver métricas, comparar períodos y analizar el negocio
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#4AED3B] to-[#3BED6B] text-white font-bold rounded-lg">
                Entrar →
              </div>
            </div>
          </Link>

          <Link href="/facturas" className="block transform hover:scale-105 transition-transform">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#E1ED3B] hover:shadow-2xl">
              <div className="text-5xl mb-4">📸</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Facturas</h2>
              <p className="text-gray-600 mb-4">
                Capturar y procesar documentos con el móvil
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#E1ED3B] to-[#F0E47D] text-gray-800 font-bold rounded-lg">
                Entrar →
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#4AED3B]"></div>
            <div className="w-3 h-3 rounded-full bg-[#E1ED3B]"></div>
            <div className="w-3 h-3 rounded-full bg-[#3BED6B]"></div>
            <div className="w-3 h-3 rounded-full bg-[#97ED3B]"></div>
            <div className="w-3 h-3 rounded-full bg-[#F0E47D]"></div>
            <div className="w-3 h-3 rounded-full bg-[#BDED8A]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
