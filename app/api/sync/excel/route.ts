import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('Recibiendo datos de n8n...')
    
    // Por ahora solo confirmar que funciona
    return NextResponse.json({ 
      success: true,
      message: 'Endpoint funcionando',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Error en el servidor'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Endpoint de sincronización activo',
    method: 'POST para recibir archivos'
  })
}
