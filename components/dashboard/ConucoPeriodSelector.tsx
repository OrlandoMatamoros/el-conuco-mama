'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Calendar, ChevronDown, TrendingUp, TrendingDown, DollarSign, Package, Clock, Filter } from 'lucide-react';

interface ConucoPeriodSelectorProps {
  onDataFilter: (filters: any) => void;
  departments?: string[];
  showTotals?: boolean;
  currency?: 'USD' | 'EUR' | 'GBP';
  data?: any[];
}

const ConucoPeriodSelector: React.FC<ConucoPeriodSelectorProps> = ({ 
  onDataFilter, 
  departments = [], 
  showTotals = true,
  currency = 'USD',
  data = []
}) => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [comparisonType, setComparisonType] = useState('MoM');
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  // Quick date navigation functions
  const quickDateOptions = {
    today: {
      label: 'Hoy',
      icon: Clock,
      action: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date();
        setDateRange({ start: today, end });
      }
    },
    yesterday: {
      label: 'Ayer',
      icon: Clock,
      action: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const end = new Date(yesterday);
        end.setHours(23, 59, 59, 999);
        setDateRange({ start: yesterday, end });
      }
    },
    thisWeek: {
      label: 'Esta Semana',
      icon: Calendar,
      action: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const start = new Date(today);
        start.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
        start.setHours(0, 0, 0, 0);
        setDateRange({ start, end: new Date() });
      }
    },
    thisMonth: {
      label: 'Este Mes',
      icon: Calendar,
      action: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        setDateRange({ start, end: new Date() });
      }
    },
    lastMonth: {
      label: 'Mes Pasado',
      icon: Calendar,
      action: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        setDateRange({ start, end });
      }
    }
  };

  // Calculate comparison periods
  const getComparisonPeriod = useCallback(() => {
    const days = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    let compareStart, compareEnd;

    switch (comparisonType) {
      case 'WoW':
        compareStart = new Date(dateRange.start);
        compareStart.setDate(compareStart.getDate() - 7);
        compareEnd = new Date(dateRange.end);
        compareEnd.setDate(compareEnd.getDate() - 7);
        break;
      case 'MoM':
        compareStart = new Date(dateRange.start);
        compareStart.setMonth(compareStart.getMonth() - 1);
        compareEnd = new Date(dateRange.end);
        compareEnd.setMonth(compareEnd.getMonth() - 1);
        break;
      case 'YoY':
        compareStart = new Date(dateRange.start);
        compareStart.setFullYear(compareStart.getFullYear() - 1);
        compareEnd = new Date(dateRange.end);
        compareEnd.setFullYear(compareEnd.getFullYear() - 1);
        break;
      default:
        compareStart = new Date(dateRange.start);
        compareStart.setDate(compareStart.getDate() - days);
        compareEnd = new Date(dateRange.start);
        compareEnd.setDate(compareEnd.getDate() - 1);
    }

    return { start: compareStart, end: compareEnd };
  }, [dateRange, comparisonType]);

  // Calculate metrics for a period
  const calculateMetrics = useCallback((startDate: Date, endDate: Date, dept = 'all') => {
    const filteredData = data.filter(item => {
      const itemDate = new Date(item.date);
      const inDateRange = itemDate >= startDate && itemDate <= endDate;
      const inDept = dept === 'all' || item.department === dept;
      return inDateRange && inDept;
    });

    const totalSales = filteredData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const transactionCount = filteredData.length;
    const avgTransaction = transactionCount > 0 ? totalSales / transactionCount : 0;
    const uniqueProducts = new Set(filteredData.map(item => item.product)).size;

    return {
      totalSales,
      transactionCount,
      avgTransaction,
      uniqueProducts
    };
  }, [data]);

  // Current and comparison metrics
  const currentMetrics = useMemo(() => 
    calculateMetrics(dateRange.start, dateRange.end, selectedDepartment),
    [dateRange, selectedDepartment, calculateMetrics]
  );

  const comparisonPeriod = useMemo(() => getComparisonPeriod(), [getComparisonPeriod]);
  const previousMetrics = useMemo(() => 
    calculateMetrics(comparisonPeriod.start, comparisonPeriod.end, selectedDepartment),
    [comparisonPeriod, selectedDepartment, calculateMetrics]
  );

  // Calculate percentage changes
  const changes = useMemo(() => ({
    sales: previousMetrics.totalSales > 0 
      ? ((currentMetrics.totalSales - previousMetrics.totalSales) / previousMetrics.totalSales) * 100 
      : 0,
    transactions: previousMetrics.transactionCount > 0 
      ? ((currentMetrics.transactionCount - previousMetrics.transactionCount) / previousMetrics.transactionCount) * 100 
      : 0,
    avgTransaction: previousMetrics.avgTransaction > 0 
      ? ((currentMetrics.avgTransaction - previousMetrics.avgTransaction) / previousMetrics.avgTransaction) * 100 
      : 0
  }), [currentMetrics, previousMetrics]);

  // Notify parent component of filter changes
  useEffect(() => {
    if (onDataFilter) {
      onDataFilter({
        dateRange,
        department: selectedDepartment,
        comparisonType,
        comparisonPeriod,
        metrics: {
          current: currentMetrics,
          previous: previousMetrics,
          changes
        }
      });
    }
  }, [dateRange, selectedDepartment, comparisonType, currentMetrics, previousMetrics, changes, onDataFilter, comparisonPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Selector de Período
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Comparación:</span>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {['WoW', 'MoM', 'YoY'].map(type => (
              <button
                key={type}
                onClick={() => setComparisonType(type)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  comparisonType === type 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(quickDateOptions).map(([key, option]) => {
          const IconComponent = option.icon;
          return (
            <button
              key={key}
              onClick={option.action}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-all border border-gray-200 hover:border-blue-300"
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Date Range and Department Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Fecha Inicio</label>
          <input
            type="date"
            value={formatDateInput(dateRange.start)}
            onChange={(e) => setDateRange(prev => ({ 
              ...prev, 
              start: new Date(e.target.value) 
            }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Fecha Fin</label>
          <input
            type="date"
            value={formatDateInput(dateRange.end)}
            onChange={(e) => setDateRange(prev => ({ 
              ...prev, 
              end: new Date(e.target.value) 
            }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Departamento</label>
          <div className="relative">
            <button
              onClick={() => setShowDeptDropdown(!showDeptDropdown)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between bg-white"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                {selectedDepartment === 'all' ? 'Todos los Departamentos' : selectedDepartment}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDeptDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showDeptDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  onClick={() => {
                    setSelectedDepartment('all');
                    setShowDeptDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                >
                  Todos los Departamentos
                </button>
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setShowDeptDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 transition-colors border-t border-gray-100"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Period Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Período Seleccionado</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Comparando con ({comparisonType})</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatDate(comparisonPeriod.start)} - {formatDate(comparisonPeriod.end)}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Display */}
      {showTotals && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className={`text-sm font-medium flex items-center gap-1 ${
                changes.sales >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {changes.sales >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(changes.sales).toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(currentMetrics.totalSales)}</p>
            <p className="text-sm text-gray-600 mt-1">Ventas Totales</p>
            <p className="text-xs text-gray-500 mt-1">Anterior: {formatCurrency(previousMetrics.totalSales)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span className={`text-sm font-medium flex items-center gap-1 ${
                changes.transactions >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {changes.transactions >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(changes.transactions).toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{currentMetrics.transactionCount}</p>
            <p className="text-sm text-gray-600 mt-1">Transacciones</p>
            <p className="text-xs text-gray-500 mt-1">Anterior: {previousMetrics.transactionCount}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span className={`text-sm font-medium flex items-center gap-1 ${
                changes.avgTransaction >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {changes.avgTransaction >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(changes.avgTransaction).toFixed(1)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(currentMetrics.avgTransaction)}</p>
            <p className="text-sm text-gray-600 mt-1">Ticket Promedio</p>
            <p className="text-xs text-gray-500 mt-1">Anterior: {formatCurrency(previousMetrics.avgTransaction)}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <Filter className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{currentMetrics.uniqueProducts}</p>
            <p className="text-sm text-gray-600 mt-1">Productos Únicos</p>
            <p className="text-xs text-gray-500 mt-1">En período actual</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConucoPeriodSelector;
