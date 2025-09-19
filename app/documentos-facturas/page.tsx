'use client'

import React, { useState } from 'react'

const WEBHOOK_URL = 'https://orlandom88.app.n8n.cloud/webhook/process-documents'

export default function DocumentosFacturas() {
  const [files, setFiles] = useState<File[]>([])
  const [docType, setDocType] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (files.length === 0 || !docType) {
      setMessage('⚠️ Selecciona archivos y tipo de documento')
      return
    }

    setIsUploading(true)
    setMessage('📤 Procesando...')

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('docType', docType)
        formData.append('fileName', file.name)
        formData.append('timestamp', new Date().toISOString())

        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) throw new Error('Error al procesar')
      }

      setMessage('✅ Documentos procesados correctamente')
      setFiles([])
      setDocType('')
    } catch (error) {
      setMessage('❌ Error al procesar documentos')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          📋 Sistema de Facturas
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo de Documento *
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">Selecciona...</option>
              <option value="factura_proveedor">Factura de Proveedor</option>
              <option value="recibo_compra">Recibo de Compra</option>
              <option value="payroll">Nómina</option>
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Archivos (Fotos o PDF)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {files.length > 0 && (
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium mb-1">
                {files.length} archivo(s) seleccionado(s):
              </p>
              {files.map((file, i) => (
                <p key={i} className="text-xs text-gray-600">
                  📄 {file.name}
                </p>
              ))}
            </div>
          )}

          {message && (
            <div className={`p-3 rounded text-center font-medium ${
              message.includes('✅') ? 'bg-green-100 text-green-700' :
              message.includes('❌') ? 'bg-red-100 text-red-700' :
              message.includes('⚠️') ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className={`w-full p-3 rounded-lg font-bold text-white ${
              isUploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isUploading ? '⏳ Procesando...' : '📤 Enviar Documentos'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            ← Volver al Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
