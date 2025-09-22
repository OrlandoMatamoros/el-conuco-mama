const fs = require('fs');
const path = require('path');

const realMetrics = {
  ventas: 525342.54,
  costos: 351924.59,
  gastos: 62383.00,
  payroll: 95738.54,
  totalEgresos: 510046.13,
  utilidad: 15296.41,
  margenBruto: "33.00",
  margenNeto: "2.91",
  timestamp: new Date().toISOString(),
  source: "Dashboard Excel"
};

const cachePath = path.join(process.cwd(), 'data', 'metrics-cache.json');
fs.writeFileSync(cachePath, JSON.stringify(realMetrics, null, 2));

console.log('✅ Cache actualizado con datos reales:');
console.log('   Ventas: RD$' + realMetrics.ventas);
console.log('   Margen: ' + realMetrics.margenNeto + '%');
