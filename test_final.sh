#!/bin/bash
echo "🧪 PRUEBAS FINALES DEL CFO"
echo ""

echo "1️⃣ Margen proyectado anual:"
curl -s -X POST http://localhost:3000/api/cfo/analyze \
  -H "Content-Type: application/json" \
  -d '{"question":"cual es el margen de utilidad proyectado al final del año?"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin).get('response', 'Error'))"

echo ""
echo "2️⃣ Producto más vendido:"
curl -s -X POST http://localhost:3000/api/cfo/analyze \
  -H "Content-Type: application/json" \
  -d '{"question":"cual es el producto mas vendido?"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin).get('response', 'Error'))"

echo ""
echo "3️⃣ Análisis general:"
curl -s -X POST http://localhost:3000/api/cfo/analyze \
  -H "Content-Type: application/json" \
  -d '{"question":"dame un analisis completo de mi situacion financiera"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin).get('response', 'Error'))"
