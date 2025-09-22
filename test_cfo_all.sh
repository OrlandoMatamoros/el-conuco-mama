#!/bin/bash
echo "🧪 === PROBANDO CFO RESTAURADO ==="
echo ""

echo "1️⃣ Proyección anual:"
curl -s -X POST http://localhost:3000/api/cfo/analyze \
  -H "Content-Type: application/json" \
  -d '{"question":"cual es mi proyeccion anual?"}' | python3 -m json.tool

echo ""
echo "2️⃣ Producto más vendido:"
curl -s -X POST http://localhost:3000/api/cfo/analyze \
  -H "Content-Type: application/json" \
  -d '{"question":"cual es el producto mas vendido?"}' | python3 -m json.tool

echo ""
echo "3️⃣ Margen actual:"
curl -s -X POST http://localhost:3000/api/cfo/analyze \
  -H "Content-Type: application/json" \
  -d '{"question":"cual es mi margen actual?"}' | python3 -m json.tool

echo ""
echo "✅ Pruebas completadas"
