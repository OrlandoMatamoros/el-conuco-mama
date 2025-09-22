#!/bin/bash
echo "🚀 === INICIANDO EL CONUCO CFO ==="
echo ""

# Matar procesos anteriores
pkill -f "next dev" 2>/dev/null

# Verificar Excel
echo "📊 Verificando archivo Excel..."
ls -la data/*.xlsx

# Iniciar servidor
echo "🌐 Iniciando servidor Next.js..."
npm run dev &

# Esperar a que inicie
echo "⏳ Esperando que el servidor inicie..."
sleep 10

echo ""
echo "✅ Servidor listo!"
echo ""
echo "📱 URLs disponibles:"
echo "   - Dashboard: http://localhost:3000/dashboard"
echo "   - Facturas: http://localhost:3000/facturas"
echo "   - Sync: http://localhost:3000/sync"
echo ""
echo "🤖 El CFO Virtual está listo para responder preguntas"
