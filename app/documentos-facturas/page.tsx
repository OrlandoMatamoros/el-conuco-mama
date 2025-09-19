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
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (error) {
      setMessage('❌ Error al procesar documentos')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Sistema de Facturas
          </h1>
          <p className="text-gray-700">El Conuco de Mamá</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tipo de Documento */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Tipo de Documento *
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full p-4 text-base font-medium text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="" className="text-gray-500">Selecciona...</option>
                <option value="factura_proveedor" className="text-gray-900">Factura de Proveedor</option>
                <option value="recibo_compra" className="text-gray-900">Recibo de Compra</option>
                <option value="payroll" className="text-gray-900">Nómina</option>
                <option value="ingreso" className="text-gray-900">Ingreso</option>
                <option value="gasto" className="text-gray-900">Gasto</option>
              </select>
            </div>

            {/* Selector de Archivos */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Archivos (Fotos o PDF)
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full p-4 text-base font-medium text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-600 file:text-white hover:file:bg-green-700"
                  required
                />
                <div className="mt-2 text-xs font-medium text-gray-700">
                  📷 Puedes tomar fotos o seleccionar PDFs
                </div>
              </div>
            </div>

            {/* Archivos Seleccionados */}
            {files.length > 0 && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-sm font-bold text-gray-900 mb-2">
                  {files.length} archivo(s) seleccionado(s):
                </p>
                <ul className="space-y-1">
                  {files.map((file, i) => (
                    <li key={i} className="text-sm font-medium text-gray-800 flex items-center">
                      <span className="mr-2">📄</span>
                      <span className="truncate">{file.name}</span>
                      <span className="ml-auto text-xs text-gray-600">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mensaje de Estado */}
            {message && (
              <div className={`p-4 rounded-lg font-bold text-center ${
                message.includes('✅') ? 'bg-green-100 text-green-900 border-2 border-green-300' :
                message.includes('❌') ? 'bg-red-100 text-red-900 border-2 border-red-300' :
                message.includes('⚠️') ? 'bg-yellow-100 text-yellow-900 border-2 border-yellow-300' :
                'bg-blue-100 text-blue-900 border-2 border-blue-300'
              }`}>
                {message}
              </div>
            )}

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all transform ${
                isUploading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg active:scale-95'
              }`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </span>
              ) : (
                '📤 Enviar Documentos'
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <a 
              href="/dashboard" 
              className="block text-center text-base font-bold text-green-600 hover:text-green-700"
            >
              ← Volver al Dashboard
            </a>
          </div>

          {/* Ayuda */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-sm font-bold text-blue-900 mb-1">💡 Consejo:</p>
            <p className="text-sm font-medium text-blue-800">
              Para mejor calidad, asegúrate de que las fotos estén bien iluminadas y enfocadas.
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs font-medium text-gray-600">
            Procesamiento automático vía n8n
          </p>
          <p className="text-xs font-medium text-gray-500 mt-1">
            © 2024 El Conuco de Mamá
          </p>
        </div>
      </div>
    </div>
  )
}
