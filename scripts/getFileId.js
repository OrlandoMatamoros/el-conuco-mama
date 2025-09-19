// Cargar las variables de entorno PRIMERO
require('dotenv').config({ path: '.env.local' });

console.log('�� Verificando configuración...');
console.log('Tenant:', process.env.AZURE_TENANT_ID ? '✅' : '❌');
console.log('Client:', process.env.AZURE_CLIENT_ID ? '✅' : '❌');
console.log('Secret:', process.env.AZURE_CLIENT_SECRET ? '✅' : '❌');
console.log('Email:', process.env.ONEDRIVE_USER_EMAIL || '❌ No configurado');

async function getExcelFileId() {
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;
  const tenantId = process.env.AZURE_TENANT_ID;
  const userEmail = process.env.ONEDRIVE_USER_EMAIL;
  
  if (!tenantId || !clientId || !clientSecret) {
    console.error('❌ Faltan credenciales en .env.local');
    return;
  }
  
  console.log('\n🔍 Buscando archivo Dashboard en OneDrive...');
  
  try {
    // Obtener token
    console.log('🔐 Obteniendo token de acceso...');
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials'
        })
      }
    );
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      console.error('❌ Error obteniendo token:', tokenData.error_description);
      return;
    }
    
    console.log('✅ Token obtenido');
    
    // Intentar buscar el archivo
    const searchUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}/drive/root/search(q='Dashboard')`;
    console.log('🔍 Buscando en:', userEmail);
    
    const searchResponse = await fetch(searchUrl, {
      headers: { 
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const searchData = await searchResponse.json();
    
    if (searchData.error) {
      console.error('❌ Error buscando archivo:', searchData.error.message);
      
      if (searchData.error.code === 'Request_ResourceNotFound') {
        console.log('\n💡 El usuario no se encontró o no tiene acceso.');
        console.log('Esto puede deberse a que necesitas permisos delegados.');
        console.log('\nAlternativa: Usa un link compartido del archivo.');
      }
      
      return;
    }
    
    if (searchData.value && searchData.value.length > 0) {
      console.log(`✅ Encontrados ${searchData.value.length} archivos`);
      
      searchData.value.forEach(file => {
        if (file.name.includes('Dashboard')) {
          console.log('\n🎯 Archivo encontrado:');
          console.log('Nombre:', file.name);
          console.log('ID:', file.id);
          console.log('\n📝 Agrega esto a .env.local:');
          console.log(`ONEDRIVE_FILE_ID=${file.id}`);
        }
      });
    } else {
      console.log('❌ No se encontraron archivos');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar
getExcelFileId();
