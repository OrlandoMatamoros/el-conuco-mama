export const processRealSalesData = (csvText: string) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  let totalSales = 0;
  let transactionCount = 0;
  const departmentSales: Record<string, number> = {};
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const sales = parseFloat(values[6]?.replace('$', '').replace(',', '') || '0');
    const department = values[1] || 'Other';
    
    totalSales += sales;
    transactionCount++;
    
    if (!departmentSales[department]) {
      departmentSales[department] = 0;
    }
    departmentSales[department] += sales;
  }
  
  return {
    totalSales,
    transactionCount,
    avgTicket: totalSales / transactionCount,
    departmentSales,
    topDepartment: Object.entries(departmentSales).sort((a, b) => b[1] - a[1])[0]
  };
};

export const processInventoryData = (csvText: string) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  let totalValue = 0;
  let itemCount = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const quantity = parseFloat(values[3] || '0');
    const cost = parseFloat(values[4]?.replace('$', '').replace(',', '') || '0');
    
    totalValue += quantity * cost;
    itemCount++;
  }
  
  return {
    totalValue,
    itemCount
  };
};

export const processPayrollData = (csvText: string) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  let totalPayroll = 0;
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';'); // Payroll usa punto y coma
    const sueldo = parseFloat(values[4]?.replace('$', '').replace(',', '') || '0');
    totalPayroll += sueldo;
  }
  
  return { totalPayroll };
};
