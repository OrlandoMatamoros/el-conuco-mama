'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SyncPage() {
  const [file, setFile] = useState<File | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setSyncing(true)
    const formData = new FormData()
    formData.append('excel', file)

    try {
      const response = await fetch('/api/sync/manual-upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (error) {
      setResult({ success: false, error: 'Error al sincronizar' })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">
          📊 Actualizar Dashboard
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Selecciona el archivo Excel actualizado de OneDrive
            </label>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Instrucciones:</strong><br/>
              1. Descarga el Excel actualizado desde OneDrive<br/>
              2. Selecciónalo aquí<br/>
              3. El dashboard se actualizará automáticamente
            </p>
          </div>
          
          {result && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                {result.success ? '✅ ' + result.message : '❌ ' + result.error}
              </p>
              {result.success && result.metrics && (
                <div className="mt-2 text-xs text-gray-600">
                  <p>Ventas: RD${result.metrics.ventas.toFixed(2)}</p>
                  <p>Margen: {result.metrics.margenBruto}%</p>
                </div>
              )}
            </div>
          )}
          
          <button
            type="submit"
            disabled={!file || syncing}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400"
          >
            {syncing ? '⏳ Sincronizando...' : '🔄 Actualizar Dashboard'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/dashboard" className="text-blue-600 hover:underline text-sm">
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
