'use client'

import { useState } from 'react'

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState('')
  
  const syncData = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/sync/auto')
      const data = await response.json()
      
      if (data.success) {
        setLastSync(data.syncTime)
        window.location.reload() // Recargar para ver nuevos datos
      } else {
        alert('Error al sincronizar')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setSyncing(false)
    }
  }
  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={syncData}
        disabled={syncing}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {syncing ? (
          <>
            <svg className="animate-spin h-4 w-4 inline mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sincronizando...
          </>
        ) : (
          'Actualizar Datos'
        )}
      </button>
      {lastSync && (
        <span className="text-xs text-gray-500">
          Última sync: {lastSync}
        </span>
      )}
    </div>
  )
}
