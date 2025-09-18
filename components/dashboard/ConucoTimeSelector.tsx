'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, ChevronDown } from 'lucide-react'

export interface TimeRange {
  start: Date
  end: Date
  label: string
  granularity: 'day' | 'week' | 'month' | 'quarter' | 'year'
  comparison?: {
    start: Date
    end: Date
    label: string
  }
}

interface ConucoTimeSelectorProps {
  onRangeChange: (range: TimeRange) => void
}

const ConucoTimeSelector: React.FC<ConucoTimeSelectorProps> = ({ onRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null)
  const [activeComparison, setActiveComparison] = useState<'WoW' | 'MoM' | 'YoY'>('MoM')

  const calculateRange = (type: string): TimeRange => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    switch(type) {
      case 'today':
        return {
          start: new Date(today.setHours(0, 0, 0, 0)),
          end: new Date(today.setHours(23, 59, 59, 999)),
          label: 'Hoy',
          granularity: 'day',
          comparison: {
            start: new Date(yesterday.setHours(0, 0, 0, 0)),
            end: new Date(yesterday.setHours(23, 59, 59, 999)),
            label: 'Ayer'
          }
        }
      
      case 'this_week': {
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        const lastWeekStart = new Date(startOfWeek)
        lastWeekStart.setDate(lastWeekStart.getDate() - 7)
        const lastWeekEnd = new Date(lastWeekStart)
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6)
        
        return {
          start: startOfWeek,
          end: endOfWeek,
          label: 'Esta Semana',
          granularity: 'week',
          comparison: {
            start: lastWeekStart,
            end: lastWeekEnd,
            label: 'Semana Pasada'
          }
        }
      }
      
      case 'this_month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
        
        return {
          start: startOfMonth,
          end: endOfMonth,
          label: 'Este Mes',
          granularity: 'month',
          comparison: {
            start: lastMonthStart,
            end: lastMonthEnd,
            label: 'Mes Pasado'
          }
        }
      }
      
      default:
        return calculateRange('this_month')
    }
  }

  const presetRanges = [
    { label: '📅 Hoy', value: 'today' },
    { label: '📆 Ayer', value: 'yesterday' },
    { label: '📊 Esta Semana', value: 'this_week' },
    { label: '📈 Este Mes', value: 'this_month' },
    { label: '📉 Mes Pasado', value: 'last_month' },
    { label: '⚙️ Personalizado', value: 'custom' }
  ]

  useEffect(() => {
    const defaultRange = calculateRange('this_month')
    setSelectedRange(defaultRange)
    onRangeChange(defaultRange)
  }, [])

  const handleRangeSelect = (value: string) => {
    const range = calculateRange(value)
    setSelectedRange(range)
    onRangeChange(range)
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Selector de Período
        </h3>
        
        {/* Botones de comparación */}
        <div className="flex gap-2">
          <span className="text-white/60 text-sm mr-2">Comparación:</span>
          {['WoW', 'MoM', 'YoY'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveComparison(type as any)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                activeComparison === type
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      {/* Botones de período principales */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {presetRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => handleRangeSelect(range.value)}
            className={`
              px-4 py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105
              ${selectedRange?.label.includes(range.label.slice(2))
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }
            `}
          >
            {range.label}
          </button>
        ))}
      </div>
      
      {/* Información del período seleccionado */}
      {selectedRange && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/30">
            <p className="text-amber-200/60 text-xs mb-1">Período Seleccionado</p>
            <p className="text-white font-bold text-lg">{selectedRange.label}</p>
            <p className="text-amber-200/80 text-sm mt-1">
              {selectedRange.start.toLocaleDateString()} - {selectedRange.end.toLocaleDateString()}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
            <p className="text-green-200/60 text-xs mb-1">Comparando con ({activeComparison})</p>
            <p className="text-white font-bold text-lg">{selectedRange.comparison?.label}</p>
            <p className="text-green-200/80 text-sm mt-1">
              {selectedRange.comparison?.start.toLocaleDateString()} - {selectedRange.comparison?.end.toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConucoTimeSelector
