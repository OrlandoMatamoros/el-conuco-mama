const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function test() {
  console.log('🧪 Probando OpenAI directamente...\n');
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Eres un CFO' },
        { role: 'user', content: '¿Cuánto es 2+2?' }
      ],
      max_tokens: 50
    });
    
    console.log('✅ OpenAI funciona!');
    console.log('Respuesta:', completion.choices[0].message.content);
  } catch (error) {
    console.log('❌ Error con OpenAI:');
    console.log('   Mensaje:', error.message);
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Detalles:', error.response.data);
    }
  }
}

test();
