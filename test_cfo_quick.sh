#!/bin/bash
echo "🧪 === PRUEBA RÁPIDA DEL CFO ==="
echo ""

# Iniciar servidor si no está corriendo
if ! lsof -i:3000 > /dev/null 2>&1; then
    echo "🚀 Iniciando servidor..."
    npm run dev > /dev/null 2>&1 &
    sleep 8
fi

echo "📊 Preguntando sobre el margen actual..."
echo ""
curl -s -X POST http://localhost:3000/api/cfo/analyze \
  -H "Content-Type: application/json" \
  -d '{"question":"¿Cuál es mi situación financiera actual? Dame un resumen ejecutivo con los números exactos"}' \
  | python3 -c "import sys, json; data = json.load(sys.stdin); print(data.get('answer', 'Error: ' + str(data)))"

echo ""
echo "✅ Prueba completada"
echo ""
echo "🌐 Abre http://localhost:3000/dashboard para usar el chat completo"
