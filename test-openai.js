require('dotenv').config({ path: '.env.local' });

console.log('🔑 Verificando OpenAI API Key...\n');

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.log('❌ No se encontró OPENAI_API_KEY en .env.local');
} else {
  console.log('✅ API Key encontrada');
  console.log(`   Inicio: ${apiKey.substring(0, 10)}...`);
  console.log(`   Longitud: ${apiKey.length} caracteres`);
  
  // Verificar formato
  if (apiKey.startsWith('sk-')) {
    console.log('✅ Formato correcto (empieza con sk-)');
  } else {
    console.log('⚠️ Formato inusual, verifica que sea correcta');
  }
}

console.log('\n📝 Para actualizar tu API key:');
console.log('   echo "OPENAI_API_KEY=tu-nueva-key" > .env.local');
