'use client'

import React from 'react'

const ConucoExpenseBreakdown: React.FC = () => {
  const data = [
    { name: 'Mercancía', value: 280000, percentage: 79.4, color: 'bg-amber-500' },
    { name: 'Nómina', value: 28000, percentage: 7.9, color: 'bg-orange-500' },
    { name: 'Renta', value: 15000, percentage: 4.3, color: 'bg-green-500' },
    { name: 'Utilities', value: 3000, percentage: 0.9, color: 'bg-emerald-500' },
    { name: 'Otros', value: 26739, percentage: 7.5, color: 'bg-yellow-500' }
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-gradient-to-br from-amber-900/20 to-green-900/20 backdrop-blur-xl 
                    rounded-2xl p-6 border border-amber-500/20">
      <h3 className="text-lg font-semibold text-white mb-4">
        Distribución de Costos
      </h3>
      
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${item.color}`} />
                <span className="text-sm text-white/80">{item.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-amber-400">
                  {item.percentage}%
                </span>
                <span className="text-xs text-amber-200/60">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${item.color} transition-all`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-amber-500/20">
        <div className="flex justify-between items-center">
          <span className="text-white/60">Total Costos</span>
          <span className="text-xl font-bold text-amber-400">
            ${total.toLocaleString()}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-xs text-green-400">
            Margen Neto: 3.63%
          </span>
        </div>
      </div>
    </div>
  )
}

export default ConucoExpenseBreakdown
