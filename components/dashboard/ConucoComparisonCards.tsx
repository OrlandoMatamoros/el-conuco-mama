'use client'

import React from 'react'
import { ArrowUp, ArrowDown, DollarSign, Users, Package, TrendingUp } from 'lucide-react'

interface ConucoComparisonCardsProps {
  currentPeriod: string
  previousPeriod: string
  data: any
}

const ConucoComparisonCards: React.FC<ConucoComparisonCardsProps> = ({
  currentPeriod,
  previousPeriod,
  data
}) => {
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, absolute: current }
    const percentage = ((current - previous) / previous) * 100
    const absolute = current - previous
    return { percentage, absolute }
  }

  const metrics = [
    {
      current: 352739.92,
      previous: 335000,
      label: 'Ventas Totales',
      icon: <DollarSign className="w-5 h-5" />,
      gradient: 'from-amber-500 to-orange-600',
      format: 'currency'
    },
    {
      current: 12813.36,
      previous: 11500,
      label: 'Utilidad Neta',
      icon: <TrendingUp className="w-5 h-5" />,
      gradient: 'from-green-500 to-emerald-600',
      format: 'currency'
    },
    {
      current: 1450,
      previous: 1380,
      label: 'Transacciones',
      icon: <Users className="w-5 h-5" />,
      gradient: 'from-orange-500 to-amber-600',
      format: 'number'
    },
    {
      current: 243.27,
      previous: 242.75,
      label: 'Ticket Promedio',
      icon: <Package className="w-5 h-5" />,
      gradient: 'from-emerald-500 to-green-600',
      format: 'currency'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const change = calculateChange(metric.current, metric.previous)
        const isPositive = change.percentage > 0
        
        return (
          <div
            key={index}
            className="bg-gradient-to-br from-amber-900/20 to-green-900/20 backdrop-blur-xl 
                     rounded-2xl p-6 border border-amber-500/20 hover:border-amber-500/40 transition-all
                     hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${metric.gradient}`}>
                <div className="text-white">
                  {metric.icon}
                </div>
              </div>
              <span className={`
                flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold
                ${isPositive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
                }
              `}>
                {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(change.percentage).toFixed(1)}%
              </span>
            </div>
            
            <div className="mb-4">
              <p className="text-amber-200/50 text-xs mb-1">{currentPeriod}</p>
              <p className="text-3xl font-bold text-white">
                {metric.format === 'currency' 
                  ? formatCurrency(metric.current)
                  : metric.current.toLocaleString()
                }
              </p>
              <p className="text-amber-200/70 text-sm mt-1">{metric.label}</p>
            </div>
            
            <div className="pt-4 border-t border-amber-500/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-200/50">Anterior</span>
                <span className="text-amber-200/80 font-medium">
                  {metric.format === 'currency' 
                    ? formatCurrency(metric.previous)
                    : metric.previous.toLocaleString()
                  }
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ConucoComparisonCards
