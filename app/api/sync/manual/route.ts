import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No se proporcionó archivo' 
      });
    }

    // Leer el archivo Excel
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    
    // Procesar datos REALES
    let metrics = {
      ventas: 0,
      costos: 0,
      gastos: 0,
      payroll: 0,
      productos: [],
      totalTransacciones: 0
    };
    
    // Leer Items
    if (workbook.Sheets['Items']) {
      const items = XLSX.utils.sheet_to_json(workbook.Sheets['Items']);
      metrics.totalTransacciones = items.length;
      
      // Calcular ventas
      metrics.ventas = items.reduce((sum: number, row: any) => 
        sum + (parseFloat(row['Sales $']) || 0), 0);
      
      // Top productos
      const productosMap: any = {};
      items.forEach((row: any) => {
        const nombre = row['Item'];
        const venta = parseFloat(row['Sales $']) || 0;
        if (nombre && venta > 0) {
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
    
    // Calcular márgenes REALES
    const utilidad = metrics.ventas - metrics.costos - metrics.gastos - metrics.payroll;
    const margenBruto = metrics.ventas > 0 ? 
      ((metrics.ventas - metrics.costos) / metrics.ventas * 100) : 0;
    const margenNeto = metrics.ventas > 0 ? 
      (utilidad / metrics.ventas * 100) : 0;
    
    // Guardar cache actualizado
    const cacheData = {
      ventas: metrics.ventas,
      costos: metrics.costos,
      gastos: metrics.gastos,
      payroll: metrics.payroll,
      utilidad: utilidad,
      margenBruto: margenBruto.toFixed(2),
      margenNeto: margenNeto.toFixed(2),
      productos: metrics.productos,
      totalTransacciones: metrics.totalTransacciones,
      timestamp: new Date().toISOString(),
      source: 'Manual Upload'
    };
    
    // Guardar en cache
    const cachePath = path.join(process.cwd(), 'data', 'metrics-cache.json');
    fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2));
    
    // Guardar Excel actualizado
    const excelPath = path.join(process.cwd(), 'data', 'Dashboard_Current.xlsx');
    XLSX.writeFile(workbook, excelPath);
    
    return NextResponse.json({
      success: true,
      message: 'Datos actualizados correctamente',
      metrics: cacheData
    });
    
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
