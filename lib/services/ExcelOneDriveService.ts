import { Client } from '@microsoft/microsoft-graph-client';
import * as XLSX from 'xlsx';

export class ExcelOneDriveService {
  private graphClient: Client | null = null;
  private accessToken: string | null = null;
  
  async initialize() {
    try {
      // Obtener token de acceso
      const tokenResponse = await fetch(
        `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.AZURE_CLIENT_ID!,
            client_secret: process.env.AZURE_CLIENT_SECRET!,
            scope: 'https://graph.microsoft.com/.default',
            grant_type: 'client_credentials'
          })
        }
      );
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.access_token) {
        this.accessToken = tokenData.access_token;
        this.graphClient = Client.init({
          authProvider: (done) => {
            done(null, this.accessToken);
          }
        });
        console.log('✅ Conectado a Microsoft Graph');
      } else {
        throw new Error('No se pudo obtener token de acceso');
      }
    } catch (error) {
      console.error('Error inicializando:', error);
      throw error;
    }
  }
  
  async getExcelData() {
    if (!this.graphClient) {
      await this.initialize();
    }
    
    try {
      // Por ahora usar datos mock mientras configuramos
      console.log('📊 Obteniendo datos del Excel...');
      
      // Datos mock basados en tu Excel
      return {
        kpis: {
          ventasTotales: 2456789.50,
          gastosTotales: 1845678.25,
          margenBruto: 24.9
        },
        ventas: [],
        gastos: [],
        productos: []
      };
      
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error;
    }
  }
  
  async getDataByPeriod(startDate: Date, endDate: Date) {
    const data = await this.getExcelData();
    // Filtrar por fechas
    return data;
  }
  
  async refreshData() {
    return await this.getExcelData();
  }
}

export default ExcelOneDriveService;
