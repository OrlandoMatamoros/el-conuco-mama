import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Calculator,
  ShoppingCart,
  Percent,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Wallet,
  Target
} from 'lucide-react';

// Tipos para las métricas
interface KPIData {
  value: number;
  previousValue?: number;
  target?: number;
  trend?: number[];
}

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  trend?: number[];
  target?: number;
  loading?: boolean;
  gradient: string;
}

// Componente individual de KPI Card
const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  change,
  changeType = 'neutral',
  subtitle,
  trend = [],
  target,
  loading = false,
  gradient
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    if (change === undefined) return null;
    return change >= 0 ? (
      <ArrowUpRight className="w-4 h-4" />
    ) : (
      <ArrowDownRight className="w-4 h-4" />
    );
  };

  // Mini gráfico de tendencia
  const renderTrendChart = () => {
    if (trend.length === 0) return null;
    
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    
    return (
      <div className="absolute bottom-2 right-2 flex items-end space-x-1 opacity-20">
        {trend.map((value, index) => (
          <div
            key={index}
            className="w-1 bg-white rounded-t"
            style={{
              height: `${((value - min) / range) * 20 + 5}px`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } hover:scale-105 hover:shadow-xl`}
      style={{
        background: gradient,
      }}
    >
      {loading && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            {icon}
          </div>
          {target && (
            <div className="flex items-center text-white/80 text-xs">
              <Target className="w-3 h-3 mr-1" />
              <span>${target.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="text-white">
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className="text-2xl font-bold mb-2">{value}</p>
          
          {change !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="font-medium">
                {Math.abs(change).toFixed(1)}%
              </span>
              {subtitle && (
                <span className="text-white/60 ml-2">{subtitle}</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {renderTrendChart()}
      
      {/* Efecto de brillo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white to-transparent rotate-45" />
      </div>
    </div>
  );
};

// Componente principal con todas las KPIs
const ConucoKPICards: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState({
    ventas: 352739.92,
    ventasPrevias: 325000,
    costos: 340000,
    costosPrevios: 315000,
    inventario: 125000,
    gastosOperativos: 8500,
    payroll: 4200,
    utilidad: 12803.22,
    utilidadPrevia: 10000,
    margen: 3.63,
    margenPrevio: 3.08,
    ticketPromedio: 24.50,
    ticketPrevio: 22.00,
    transacciones: 14397
  });

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Calcular cambios porcentuales
  const calcularCambio = (actual: number, previo: number) => {
    return ((actual - previo) / previo) * 100;
  };

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Formatear porcentaje
  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Datos de tendencia simulados (últimos 7 días)
  const tendencias = {
    ventas: [45000, 48000, 47000, 52000, 51000, 53000, 50299],
    costos: [43000, 46000, 45500, 50000, 49000, 51000, 48571],
    utilidad: [1500, 1700, 1600, 1900, 1850, 1950, 1829],
    margen: [3.3, 3.5, 3.4, 3.7, 3.6, 3.8, 3.63]
  };

  const kpis = [
    {
      title: 'Ventas del Período',
      value: formatCurrency(kpiData.ventas),
      icon: <DollarSign className="w-6 h-6 text-white" />,
      change: calcularCambio(kpiData.ventas, kpiData.ventasPrevias),
      changeType: 'positive' as const,
      subtitle: 'vs período anterior',
      trend: tendencias.ventas,
      target: 380000,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Costo de Mercancía',
      value: formatCurrency(kpiData.costos),
      icon: <Package className="w-6 h-6 text-white" />,
      change: calcularCambio(kpiData.costos, kpiData.costosPrevios),
      changeType: 'negative' as const,
      subtitle: 'COGS',
      trend: tendencias.costos,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Valor del Inventario',
      value: formatCurrency(kpiData.inventario),
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      subtitle: 'Stock actual',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Gastos Operativos',
      value: formatCurrency(kpiData.gastosOperativos),
      icon: <Calculator className="w-6 h-6 text-white" />,
      change: -2.5,
      changeType: 'positive' as const,
      subtitle: 'Optimizado',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      title: 'Payroll',
      value: formatCurrency(kpiData.payroll),
      icon: <Users className="w-6 h-6 text-white" />,
      subtitle: 'Salarios y beneficios',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      title: 'Utilidad Neta',
      value: formatCurrency(kpiData.utilidad),
      icon: <Wallet className="w-6 h-6 text-white" />,
      change: calcularCambio(kpiData.utilidad, kpiData.utilidadPrevia),
      changeType: 'positive' as const,
      subtitle: 'Profit',
      trend: tendencias.utilidad,
      target: 15000,
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    },
    {
      title: 'Margen de Utilidad',
      value: formatPercent(kpiData.margen),
      icon: <Percent className="w-6 h-6 text-white" />,
      change: calcularCambio(kpiData.margen, kpiData.margenPrevio),
      changeType: kpiData.margen >= 4 ? 'positive' as const : 'negative' as const,
      subtitle: 'Net margin',
      trend: tendencias.margen,
      target: 5,
      gradient: kpiData.margen >= 4 
        ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
        : 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)'
    },
    {
      title: 'Ticket Promedio',
      value: formatCurrency(kpiData.ticketPromedio),
      icon: <Receipt className="w-6 h-6 text-white" />,
      change: calcularCambio(kpiData.ticketPromedio, kpiData.ticketPrevio),
      changeType: 'positive' as const,
      subtitle: `${kpiData.transacciones.toLocaleString()} transacciones`,
      gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            El Conuco de Mamá - Dashboard
          </h1>
          <p className="text-gray-600">
            Métricas de rendimiento en tiempo real
          </p>
        </div>

        {/* Alert para margen bajo */}
        {kpiData.margen < 4 && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Atención: Margen de utilidad por debajo del objetivo
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                El margen actual ({formatPercent(kpiData.margen)}) está por debajo del objetivo del 4%. 
                Considera revisar los costos operativos.
              </p>
            </div>
          </div>
        )}

        {/* Grid de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <KPICard
              key={index}
              {...kpi}
              loading={loading}
            />
          ))}
        </div>

        {/* Footer con última actualización */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Última actualización: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ConucoKPICards;
