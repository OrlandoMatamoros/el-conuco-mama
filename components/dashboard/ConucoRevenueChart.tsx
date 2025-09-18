'use client'

import React from 'react'

interface ConucoRevenueChartProps {
  period: string
}

const ConucoRevenueChart: React.FC<ConucoRevenueChartProps> = ({ period }) => {
  const getData = () => {
    switch(period) {
      case 'day':
        return [
          { name: '6am', value: 850 },
          { name: '9am', value: 3200 },
          { name: '12pm', value: 5800 },
          { name: '3pm', value: 4200 },
          { name: '6pm', value: 6600 },
          { name: '9pm', value: 3200 }
        ]
      case 'week':
        return [
          { name: 'Lun', value: 8200 },
          { name: 'Mar', value: 7800 },
          { name: 'Mié', value: 9100 },
          { name: 'Jue', value: 8700 },
          { name: 'Vie', value: 12200 },
          { name: 'Sáb', value: 15800 },
          { name: 'Dom', value: 14500 }
        ]
      default:
        return [
          { name: 'Semana 1', value: 78500 },
          { name: 'Semana 2', value: 82200 },
          { name: 'Semana 3', value: 91800 },
          { name: 'Semana 4', value: 100239 }
        ]
    }
  }

  const data = getData()
  const total = 352739.92
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="bg-gradient-to-br from-amber-900/20 to-green-900/20 backdrop-blur-xl 
                    rounded-2xl p-6 border border-amber-500/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          Tendencia de Ventas
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-400">
            ${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-amber-200/60">Total del período</p>
        </div>
      </div>
      
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-white/5 rounded-t-lg relative">
              <div 
                className="absolute bottom-0 w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg transition-all hover:from-amber-400 hover:to-orange-300"
                style={{ height: `${(item.value / maxValue) * 200}px` }}
              />
            </div>
            <p className="text-xs text-amber-200/60 mt-2">{item.name}</p>
            <p className="text-xs text-amber-400 font-bold">
              ${(item.value / 1000).toFixed(1)}k
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConucoRevenueChart
