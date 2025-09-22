#!/bin/bash
# Verificar si el dashboard tiene CFOChat
if ! grep -q "CFOChat" app/dashboard/page.tsx; then
  echo "❌ Dashboard no tiene CFOChat, restaurando..."
  
  # Buscar en commits anteriores
  git show 2cc6894:app/dashboard/page.tsx > /tmp/dashboard_with_cfo.tsx
  cp /tmp/dashboard_with_cfo.tsx app/dashboard/page.tsx
  echo "✅ Dashboard restaurado con CFOChat"
else
  echo "✅ Dashboard ya tiene CFOChat"
fi

# Verificar componente CFOChat
if [ ! -f "components/CFOChat.tsx" ]; then
  echo "❌ Falta CFOChat.tsx, restaurando..."
  git show 2cc6894:components/CFOChat.tsx > components/CFOChat.tsx
  echo "✅ CFOChat.tsx restaurado"
fi

# Verificar API del CFO
if [ ! -d "app/api/cfo/chat" ]; then
  echo "❌ Falta API cfo/chat, restaurando..."
  mkdir -p app/api/cfo/chat
  git show 2cc6894:app/api/cfo/chat/route.ts > app/api/cfo/chat/route.ts
  echo "✅ API cfo/chat restaurada"
fi

echo ""
echo "📊 Estado actual:"
ls -la app/api/cfo/chat/
ls -la components/CFO*
