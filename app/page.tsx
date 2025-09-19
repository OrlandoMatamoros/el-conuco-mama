'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">
          El Conuco de Mama
        </h1>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-2">📊</div>
            <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-600 mt-2">Ver metricas y analisis</p>
          </Link>
          
          <Link href="/documentos-facturas" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-2">📋</div>
            <h2 className="text-xl font-bold text-gray-800">Facturas</h2>
            <p className="text-gray-600 mt-2">Cargar documentos</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
