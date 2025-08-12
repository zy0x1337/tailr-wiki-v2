// components/providers/FilterProvider.tsx - Erweitert um Properties
'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface FilterState {
  search: string
  size: string[]
  careLevel: string[]
  temperament: string[]
  properties: string[]  // ✅ NEU: Properties hinzugefügt
  sortBy: 'name' | 'size' | 'care' | 'rating' | 'properties'  // ✅ Properties als Sort-Option
  sortOrder: 'asc' | 'desc'
}

interface FilterContextType {
  filters: FilterState
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
  filteredCount: number
  setFilteredCount: (count: number) => void
}

const defaultFilters: FilterState = {
  search: '',
  size: [],
  careLevel: [],
  temperament: [],
  properties: [],  // ✅ Default-Wert für Properties
  sortBy: 'name',
  sortOrder: 'asc'
}

const FilterContext = createContext<FilterContextType | null>(null)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [filteredCount, setFilteredCount] = useState(0)

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  return (
    <FilterContext.Provider value={{
      filters,
      updateFilter,
      resetFilters,
      filteredCount,
      setFilteredCount
    }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilters must be used within FilterProvider')
  }
  return context
}
