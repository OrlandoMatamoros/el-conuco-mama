// Script simple para probar la conexión
require('dotenv').config({ path: '.env.local' });

console.log('🔧 Probando configuración...\n');

const config = {
  tenantId: process.env.AZURE_TENANT_ID,
  clientId: process.env.AZURE_CLIENT_ID,
  clientSecret: process.env.AZURE_CLIENT_SECRET ? '✅ Configurado' : '❌ Falta',
  userEmail: process.env.ONEDRIVE_USER_EMAIL
};

console.log('Tenant ID:', config.tenantId || '❌ No configurado');
console.log('Client ID:', config.clientId || '❌ No configurado');
console.log('Client Secret:', config.clientSecret);
console.log('User Email:', config.userEmail || '❌ No configurado');

if (!config.tenantId || !config.clientId || config.clientSecret === '❌ Falta') {
  console.log('\n⚠️ Faltan credenciales. Edita el archivo .env.local');
  process.exit(1);
}

console.log('\n✅ Configuración lista. Ahora probando token...');

// Probar obtener token
async function testToken() {
  try {
    const response = await fetch(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.AZURE_CLIENT_ID,
          client_secret: process.env.AZURE_CLIENT_SECRET,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials'
        })
      }
    );
    
    const data = await response.json();
    
    if (data.access_token) {
      console.log('✅ Token obtenido exitosamente!');
      console.log('Tipo de token:', data.token_type);
      console.log('Expira en:', data.expires_in, 'segundos');
    } else {
      console.log('❌ Error:', data.error_description || data.error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
  }
}

testToken();
