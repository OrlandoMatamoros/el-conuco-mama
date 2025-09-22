const fs = require('fs');
const FormData = require('form-data');

async function testSync() {
  const form = new FormData();
  form.append('excel', fs.createReadStream('./data/Dashboard_1_1.xlsx'));
  
  try {
    const response = await fetch('http://localhost:3000/api/sync/onedrive', {
      method: 'POST',
      body: form
    });
    
    const result = await response.json();
    console.log('Resultado:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSync();
