'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  Upload,
  Camera,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  File,
  Plus,
  Trash2,
  Send,
  FileImage,
  FileSpreadsheet,
  Receipt
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useToast } from '@/hooks/use-toast'
// Configuración
const WEBHOOK_URL = 'https://orlandom88.app.n8n.cloud/webhook/process-documents'
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  'application/pdf': ['.pdf']
}

// Tipos
interface FileWithPreview {
  file: File
  preview?: string
  id: string
  status?: 'pending' | 'uploading' | 'success' | 'error'
  progress?: number
  error?: string
}

interface DocumentType {
  value: string
  label: string
  icon: React.ElementType
  color: string
}

const documentTypes: DocumentType[] = [
  { value: 'factura_proveedor', label: 'Factura de Proveedor', icon: Receipt, color: 'blue' },
  { value: 'recibo_compra', label: 'Recibo de Compra', icon: FileText, color: 'green' },
  { value: 'payroll', label: 'Nómina (Payroll)', icon: FileSpreadsheet, color: 'purple' },
  { value: 'ingreso', label: 'Registro de Ingreso', icon: Plus, color: 'emerald' },
  { value: 'gasto', label: 'Registro de Gasto', icon: Trash2, color: 'red' },
  { value: 'otro', label: 'Otro', icon: File, color: 'gray' }
]

export default function DocumentUploadPage() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [docType, setDocType] = useState('')
  const [notes, setNotes] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1048576).toFixed(1) + ' MB'
  }

  // Obtener icono según tipo de archivo
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon
    if (type === 'application/pdf') return FileText
    return File
  }

  // Obtener color según tipo de archivo
  const getFileColor = (type: string) => {
    if (type.startsWith('image/')) return 'text-blue-500'
    if (type === 'application/pdf') return 'text-red-500'
    return 'text-gray-500'
  }

  // Validar archivo
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `El archivo excede el límite de ${MAX_FILE_SIZE / 1048576}MB` }
    }
    
    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
    if (!isValidType) {
      return { valid: false, error: 'Tipo de archivo no soportado' }
    }
    
    return { valid: true }
  }

  // Manejar selección de archivos
  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return

    const newFiles: FileWithPreview[] = []
    
    Array.from(fileList).forEach(file => {
      const validation = validateFile(file)
      
      if (validation.valid) {
        const fileWithPreview: FileWithPreview = {
          file,
          id: Math.random().toString(36).substr(2, 9),
          status: 'pending'
        }
        
        // Crear preview para imágenes
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setFiles(prev => prev.map(f => 
              f.id === fileWithPreview.id 
                ? { ...f, preview: reader.result as string }
                : f
            ))
          }
          reader.readAsDataURL(file)
        }
        
        newFiles.push(fileWithPreview)
      } else {
        toast({
          title: 'Error',
          description: `${file.name}: ${validation.error}`,
          variant: 'destructive'
        })
      }
    })
    
    setFiles(prev => [...prev, ...newFiles])
  }, [toast])

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  // Eliminar archivo
  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  // Enviar archivos
  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona al menos un archivo',
        variant: 'destructive'
      })
      return
    }

    if (!docType) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona el tipo de documento',
        variant: 'destructive'
      })
      return
    }

    setIsUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)

    const totalFiles = files.length
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i]
      
      try {
        // Actualizar estado del archivo
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'uploading' } : f
        ))
        
        setStatusMessage(`Procesando ${i + 1} de ${totalFiles}: ${fileItem.file.name}`)
        setUploadProgress((i / totalFiles) * 100)

        const formData = new FormData()
        formData.append('file', fileItem.file)
        formData.append('docType', docType)
        formData.append('notes', notes)
        formData.append('fileName', fileItem.file.name)
        formData.append('fileType', fileItem.file.type)
        formData.append('timestamp', new Date().toISOString())

        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          successCount++
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, status: 'success' } : f
          ))
        } else {
          throw new Error(`Error al procesar ${fileItem.file.name}`)
        }
      } catch (error) {
        errorCount++
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id 
            ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Error desconocido' }
            : f
        ))
      }
    }

    setUploadProgress(100)
    
    if (errorCount === 0) {
      setUploadStatus('success')
      setStatusMessage(`✅ ${successCount} documento(s) procesados correctamente`)
      toast({
        title: 'Éxito',
        description: 'Todos los documentos fueron procesados correctamente'
      })
      
      // Limpiar después de 2 segundos
      setTimeout(() => {
        setFiles([])
        setDocType('')
        setNotes('')
        setUploadStatus('idle')
        setStatusMessage('')
      }, 2000)
    } else {
      setUploadStatus('error')
      setStatusMessage(`⚠️ ${successCount} procesados, ${errorCount} con errores`)
      toast({
        title: 'Proceso completado con errores',
        description: `${successCount} archivos procesados, ${errorCount} fallaron`,
        variant: 'destructive'
      })
    }

    setIsUploading(false)
  }

  // Componente de área de carga
  const DropZone = () => (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all duration-200 
        ${dragActive 
          ? 'border-green-500 bg-green-50 scale-105' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={filterType === 'image' ? 'image/*' : filterType === 'pdf' ? '.pdf' : '.pdf,image/*'}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      
      <div className="flex flex-col items-center gap-3">
        <div className={`
          p-4 rounded-full 
          ${dragActive ? 'bg-green-100' : 'bg-gray-100'}
        `}>
          <Upload className={`h-8 w-8 ${dragActive ? 'text-green-600' : 'text-gray-600'}`} />
        </div>
        
        <div>
          <p className="text-lg font-semibold text-gray-700">
            {dragActive ? 'Suelta los archivos aquí' : 'Arrastra y suelta archivos'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            o haz clic para seleccionar
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center mt-2">
          <Badge variant="secondary">PDF</Badge>
          <Badge variant="secondary">JPG</Badge>
          <Badge variant="secondary">PNG</Badge>
          <Badge variant="secondary">Máx. 10MB</Badge>
        </div>
      </div>
    </div>
  )

  // Componente de preview de archivo
  const FilePreview = ({ fileItem }: { fileItem: FileWithPreview }) => {
    const Icon = getFileIcon(fileItem.file.type)
    
    return (
      <div className={`
        relative group border rounded-lg p-3 
        ${fileItem.status === 'success' ? 'border-green-500 bg-green-50' : 
          fileItem.status === 'error' ? 'border-red-500 bg-red-50' : 
          fileItem.status === 'uploading' ? 'border-blue-500 bg-blue-50' : 
          'border-gray-200 hover:border-gray-300'}
        transition-all duration-200
      `}>
        <div className="flex items-start gap-3">
          {/* Preview o icono */}
          <div className="flex-shrink-0">
            {fileItem.preview ? (
              <img 
                src={fileItem.preview} 
                alt={fileItem.file.name}
                className="w-12 h-12 rounded object-cover"
              />
            ) : (
              <div className={`p-2 rounded ${getFileColor(fileItem.file.type)} bg-opacity-10`}>
                <Icon className={`h-8 w-8 ${getFileColor(fileItem.file.type)}`} />
              </div>
            )}
          </div>
          
          {/* Info del archivo */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fileItem.file.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(fileItem.file.size)}
            </p>
            
            {/* Estado */}
            {fileItem.status === 'uploading' && (
              <div className="flex items-center gap-2 mt-1">
                <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                <span className="text-xs text-blue-600">Procesando...</span>
              </div>
            )}
            {fileItem.status === 'success' && (
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Completado</span>
              </div>
            )}
            {fileItem.status === 'error' && (
              <div className="flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600">{fileItem.error || 'Error'}</span>
              </div>
            )}
          </div>
          
          {/* Botón eliminar */}
          {fileItem.status !== 'uploading' && fileItem.status !== 'success' && (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFile(fileItem.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Sistema de Procesamiento de Documentos
          </CardTitle>
          <CardDescription className="text-green-50">
            Carga y procesa facturas, recibos y documentos contables
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Selector de tipo de documento */}
          <div className="space-y-2">
            <Label htmlFor="docType" className="text-sm font-medium">
              Tipo de Documento *
            </Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger id="docType" className="w-full">
                <SelectValue placeholder="Selecciona el tipo de documento..." />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map(type => {
                  const Icon = type.icon
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 text-${type.color}-500`} />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Filtros de tipo de archivo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de Archivo</Label>
            <Tabs value={filterType} onValueChange={setFilterType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="image">Imágenes</TabsTrigger>
                <TabsTrigger value="pdf">PDF</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Seleccionar Archivos
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="h-4 w-4 mr-2" />
              Tomar Foto
            </Button>
            
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Zona de carga */}
          <DropZone />

          {/* Lista de archivos */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Archivos seleccionados ({files.length})
                </Label>
                {files.length > 0 && !isUploading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiles([])}
                  >
                    Limpiar todo
                  </Button>
                )}
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                {files.map(fileItem => (
                  <FilePreview key={fileItem.id} fileItem={fileItem} />
                ))}
              </div>
            </div>
          )}

          {/* Notas adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notas adicionales (opcional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Agrega cualquier información relevante sobre estos documentos..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Progreso de carga */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{statusMessage}</span>
                <span className="font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Estado de la operación */}
          {uploadStatus !== 'idle' && !isUploading && (
            <Alert className={
              uploadStatus === 'success' ? 'border-green-500 bg-green-50' :
              uploadStatus === 'error' ? 'border-red-500 bg-red-50' :
              ''
            }>
              {uploadStatus === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={
                uploadStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }>
                {statusMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Botón de envío */}
          <Button
            onClick={handleSubmit}
            disabled={files.length === 0 || !docType || isUploading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Procesar {files.length > 0 ? `${files.length} ` : ''}Documento{files.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
