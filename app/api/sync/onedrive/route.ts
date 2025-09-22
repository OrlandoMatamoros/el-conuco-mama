import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// URL directa del Excel en OneDrive
const ONEDRIVE_URL = 'https://1drv.ms/x/c/0b981e5c9846900f/EXZjG-TaMTRNh8FYnfm0o6sB90Ca2PYnHc7H22fWGNohZA';

export async function GET(request: NextRequest) {
  try {
    console.log('📥 Descargando Excel desde OneDrive...');
    
    // Descargar el archivo desde OneDrive
    const response = await fetch(ONEDRIVE_URL);
    
    if (!response.ok) {
      throw new Error('No se pudo descargar el archivo');
    }
    
    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Guardar localmente
    const localPath = path.join(process.cwd(), 'data', 'Dashboard_OneDrive.xlsx');
    XLSX.writeFile(workbook, localPath);
    
    // Procesar datos
    const sheets = workbook.SheetNames;
    let metrics = {
      ventas: 0,
      costos: 0,
      gastos: 0,
      payroll: 0,
      productos: []
    };
    
    // Leer hoja Items para productos y ventas
    if (workbook.Sheets['Items']) {
      const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items']);
      
      // Calcular ventas totales
      metrics.ventas = items.reduce((sum: number, row: any) => 
        sum + (parseFloat(row['Sales $']) || 0), 0);
      
      // Agrupar productos
      const productosMap: any = {};
      items.forEach((row: any) => {
        const nombre = row['Item'];
        const venta = parseFloat(row['Sales $']) || 0;
        if (nombre) {
          productosMap[nombre] = (productosMap[nombre] || 0) + venta;
        }
      });
      
      metrics.productos = Object.entries(productosMap)
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 20)
        .map(([nombre, ventas]: any) => ({ nombre, ventas }));
    }
    
    // Leer COSTOS
    if (workbook.Sheets['COSTOS']) {
      const costos = XLSX.utils.sheet_to_json(workbook.Sheets['COSTOS']);
      metrics.costos = costos.reduce((sum: number, row: any) => 
        sum + (parseFloat(row['VALOR']) || 0), 0);
    }
    
    // Leer GASTOS
    if (workbook.Sheets['GASTOS']) {
      const gastos = XLSX.utils.sheet_to_json(workbook.Sheets['GASTOS']);
      metrics.gastos = gastos.reduce((sum: number, row: any) => 
        sum + (parseFloat(row['VALOR']) || 0), 0);
    }
    
    // Leer Payroll
    if (workbook.Sheets['Payroll']) {
      const payroll = XLSX.utils.sheet_to_json(workbook.Sheets['Payroll']);
      metrics.payroll = payroll.reduce((sum: number, row: any) => 
        sum + (parseFloat(row['Neto a Pagar']) || 0), 0);
    }
    
    // Calcular márgenes
    const utilidad = metrics.ventas - metrics.costos - metrics.gastos - metrics.payroll;
    const margenBruto = metrics.ventas > 0 ? 
      ((metrics.ventas - metrics.costos) / metrics.ventas * 100) : 0;
    const margenNeto = metrics.ventas > 0 ? 
      (utilidad / metrics.ventas * 100) : 0;
    
    // Actualizar cache con datos REALES
    const cacheData = {
      ventas: metrics.ventas,
      costos: metrics.costos,
      gastos: metrics.gastos,
      payroll: metrics.payroll,
      utilidad: utilidad,
      margenBruto: margenBruto.toFixed(2),
      margenNeto: margenNeto.toFixed(2),
      productos: metrics.productos,
      timestamp: new Date().toISOString(),
      source: 'OneDrive'
    };
    
    // Guardar en cache
    const cachePath = path.join(process.cwd(), 'data', 'metrics-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Datos sincronizados desde OneDrive',
      metrics: cacheData,
      sheets: sheets
    });
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
