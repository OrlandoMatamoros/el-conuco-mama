#!/bin/bash
echo "=== 📁 ESTRUCTURA COMPLETA DEL PROYECTO ==="
echo ""
echo "🌳 Árbol de archivos (sin node_modules):"
tree -L 3 -I 'node_modules|.next|.git' --filesfirst
echo ""
echo "📄 Archivos en /app:"
ls -la app/
echo ""
echo "📄 Archivos en /app/api:"
ls -la app/api/ 2>/dev/null || echo "No hay carpeta /app/api"
echo ""
echo "📄 Archivos en /components:"
ls -la components/
echo ""
echo "📄 Archivos en /lib/services:"
ls -la lib/services/ 2>/dev/null || echo "No hay carpeta /lib/services"
echo ""
echo "📄 package.json dependencies:"
grep -A 20 '"dependencies"' package.json
