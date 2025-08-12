// components/ui/CompactFilterBar.tsx - Verbesserte Version mit prominenter Suche
'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Filter, X, ChevronDown, RotateCcw, Check } from 'lucide-react'
import { useFilters } from '@/components/providers/FilterProvider'

interface CompactFilterBarProps {
  pets: Array<{
    temperament?: string[] | null
    size?: string | null
    careLevel?: string | null
  }>
}

export default function CompactFilterBar({ pets }: CompactFilterBarProps) {
  const { filters, updateFilter, resetFilters, filteredCount } = useFilters()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (openDropdown && !target.closest(`[data-dropdown="${openDropdown}"]`)) {
        setOpenDropdown(null)
      }
    }

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openDropdown])

  // Extract available options
  const availableOptions = {
    sizes: [...new Set(
      pets
        .map(p => p.size)
        .filter((size): size is string => size !== null && size !== undefined)
    )].sort(),
    
    careLevels: [...new Set(
      pets
        .map(p => p.careLevel)
        .filter((level): level is string => level !== null && level !== undefined)
    )].sort(),
    
    temperaments: [...new Set(
      pets
        .flatMap(p => p.temperament || [])
        .filter((trait): trait is string => typeof trait === 'string')
    )].sort()
  }

  const handleMultiSelectChange = (filterKey: 'size' | 'careLevel' | 'temperament', value: string) => {
    const currentValues = filters[filterKey] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    updateFilter(filterKey, newValues)
  }

  const getActiveFilterCount = () => {
    return filters.size.length +
           filters.careLevel.length +
           filters.temperament.length
  }

  const activeFilterCount = getActiveFilterCount()
  const hasActiveSearch = filters.search.length > 0

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const getFilterButtonText = (filterKey: string, selectedItems: string[]) => {
    if (selectedItems.length === 0) return getFilterLabel(filterKey)
    if (selectedItems.length === 1) return selectedItems[0]
    return `${selectedItems.length} ausgewählt`
  }

  const getFilterLabel = (filterKey: string) => {
    switch (filterKey) {
      case 'size': return 'Größe'
      case 'careLevel': return 'Pflege'
      case 'temperament': return 'Charakter'
      default: return filterKey
    }
  }

  return (
    <div className="space-y-4">
      {/* PROMINENT: Suchleiste ganz oben */}
      <div className="bg-base-100 rounded-xl shadow-lg border border-base-300 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-base-content/50" />
          </div>
          <input
            type="text"
            placeholder="Nach Hunderasse suchen... (z.B. Golden Retriever, Schäferhund)"
            className={`input input-bordered w-full pl-12 pr-12 h-12 text-base ${
              hasActiveSearch ? 'input-primary border-primary' : ''
            }`}
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/50 hover:text-base-content transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {/* Search Results Indicator */}
        {hasActiveSearch && (
          <div className="mt-2 text-sm text-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Suche nach "{filters.search}"</span>
            {filteredCount > 0 && (
              <span className="badge badge-primary badge-sm">{filteredCount} gefunden</span>
            )}
          </div>
        )}
      </div>

      {/* Filter-Leiste */}
      <div className="bg-base-100 rounded-xl shadow-lg border border-base-300 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2 mr-2">
              <Filter className="w-4 h-4 text-base-content/70" />
              <span className="text-sm font-medium text-base-content/70">Filter:</span>
            </div>

            {/* Size Filter */}
            {availableOptions.sizes.length > 0 && (
              <div className="relative" data-dropdown="size">
                <button
                  onClick={() => toggleDropdown('size')}
                  className={`btn btn-sm ${
                    filters.size.length > 0 ? 'btn-primary' : 'btn-outline'
                  } gap-2`}
                >
                  <span>📏</span>
                  <span>{getFilterButtonText('size', filters.size)}</span>
                  {filters.size.length > 0 && (
                    <div className="badge badge-primary-content badge-xs">{filters.size.length}</div>
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${
                    openDropdown === 'size' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {openDropdown === 'size' && (
                  <div className="absolute top-full left-0 mt-1 bg-base-100 rounded-lg shadow-xl border border-base-300 p-2 z-50 min-w-[160px]">
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {availableOptions.sizes.map(size => (
                        <label
                          key={size}
                          className="flex items-center gap-2 p-2 hover:bg-base-200 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-xs"
                            checked={filters.size.includes(size)}
                            onChange={() => handleMultiSelectChange('size', size)}
                          />
                          <span className="text-sm">{size}</span>
                          {filters.size.includes(size) && (
                            <Check className="w-3 h-3 text-primary ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Care Level Filter */}
            {availableOptions.careLevels.length > 0 && (
              <div className="relative" data-dropdown="careLevel">
                <button
                  onClick={() => toggleDropdown('careLevel')}
                  className={`btn btn-sm ${
                    filters.careLevel.length > 0 ? 'btn-primary' : 'btn-outline'
                  } gap-2`}
                >
                  <span>⚡</span>
                  <span>{getFilterButtonText('careLevel', filters.careLevel)}</span>
                  {filters.careLevel.length > 0 && (
                    <div className="badge badge-primary-content badge-xs">{filters.careLevel.length}</div>
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${
                    openDropdown === 'careLevel' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {openDropdown === 'careLevel' && (
                  <div className="absolute top-full left-0 mt-1 bg-base-100 rounded-lg shadow-xl border border-base-300 p-2 z-50 min-w-[160px]">
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {availableOptions.careLevels.map(level => (
                        <label
                          key={level}
                          className="flex items-center gap-2 p-2 hover:bg-base-200 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-xs"
                            checked={filters.careLevel.includes(level)}
                            onChange={() => handleMultiSelectChange('careLevel', level)}
                          />
                          <span className="text-sm">{level}</span>
                          {filters.careLevel.includes(level) && (
                            <Check className="w-3 h-3 text-primary ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Temperament Filter */}
            {availableOptions.temperaments.length > 0 && (
              <div className="relative" data-dropdown="temperament">
                <button
                  onClick={() => toggleDropdown('temperament')}
                  className={`btn btn-sm ${
                    filters.temperament.length > 0 ? 'btn-primary' : 'btn-outline'
                  } gap-2`}
                >
                  <span>💭</span>
                  <span>{getFilterButtonText('temperament', filters.temperament)}</span>
                  {filters.temperament.length > 0 && (
                    <div className="badge badge-primary-content badge-xs">{filters.temperament.length}</div>
                  )}
                  <ChevronDown className={`w-3 h-3 transition-transform ${
                    openDropdown === 'temperament' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {openDropdown === 'temperament' && (
                  <div className="absolute top-full right-0 mt-1 bg-base-100 rounded-lg shadow-xl border border-base-300 p-2 z-50 min-w-[200px]">
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {availableOptions.temperaments.slice(0, 12).map(trait => (
                        <label
                          key={trait}
                          className="flex items-center gap-2 p-2 hover:bg-base-200 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-xs"
                            checked={filters.temperament.includes(trait)}
                            onChange={() => handleMultiSelectChange('temperament', trait)}
                          />
                          <span className="text-sm">{trait}</span>
                          {filters.temperament.includes(trait) && (
                            <Check className="w-3 h-3 text-primary ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="relative" data-dropdown="sort">
              <button
                onClick={() => toggleDropdown('sort')}
                className="btn btn-sm btn-outline gap-2"
              >
                <span>📊</span>
                <span className="hidden sm:inline">Sortieren</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${
                  openDropdown === 'sort' ? 'rotate-180' : ''
                }`} />
              </button>
              
              {openDropdown === 'sort' && (
                <div className="absolute top-full right-0 mt-1 bg-base-100 rounded-lg shadow-xl border border-base-300 p-1 z-50 min-w-[160px]">
                  {[
                    { value: 'name-asc', label: 'Name A-Z' },
                    { value: 'name-desc', label: 'Name Z-A' },
                    { value: 'size-asc', label: 'Klein → Groß' },
                    { value: 'size-desc', label: 'Groß → Klein' },
                    { value: 'care-asc', label: 'Pflegeleicht' },
                    { value: 'care-desc', label: 'Anspruchsvoll' },
                    { value: 'properties-desc', label: 'Beste Matches' }
                  ].map(option => {
                    const isActive = `${filters.sortBy}-${filters.sortOrder}` === option.value
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          const [sortBy, sortOrder] = option.value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder]
                          updateFilter('sortBy', sortBy)
                          updateFilter('sortOrder', sortOrder)
                          setOpenDropdown(null)
                        }}
                        className={`w-full text-left p-2 hover:bg-base-200 rounded text-sm ${
                          isActive ? 'bg-primary text-primary-content' : ''
                        }`}
                      >
                        {option.label}
                        {isActive && <Check className="w-3 h-3 inline ml-2" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Results + Reset */}
          <div className="flex items-center gap-3">
            {/* Results Counter */}
            {filteredCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <span className="font-medium">{filteredCount}</span>
                <span className="hidden sm:inline">Rassen gefunden</span>
                <span className="sm:hidden">Ergebnisse</span>
              </div>
            )}

            {/* Reset Button */}
            {(activeFilterCount > 0 || hasActiveSearch) && (
              <button
                onClick={resetFilters}
                className="btn btn-sm btn-ghost gap-2 text-error hover:bg-error/10"
                title="Alle Filter zurücksetzen"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {(activeFilterCount > 0 || hasActiveSearch) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-base-300">
            {filters.search && (
              <div className="badge badge-primary gap-1">
                <Search className="w-3 h-3" />
                "{filters.search}"
                <button
                  onClick={() => updateFilter('search', '')}
                  className="ml-1 hover:text-primary-content/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {filters.size.map(size => (
              <div key={size} className="badge badge-secondary gap-1">
                📏 {size}
                <button
                  onClick={() => handleMultiSelectChange('size', size)}
                  className="ml-1 hover:text-secondary-content/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {filters.careLevel.map(level => (
              <div key={level} className="badge badge-accent gap-1">
                ⚡ {level}
                <button
                  onClick={() => handleMultiSelectChange('careLevel', level)}
                  className="ml-1 hover:text-accent-content/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {filters.temperament.map(trait => (
              <div key={trait} className="badge badge-info gap-1">
                💭 {trait}
                <button
                  onClick={() => handleMultiSelectChange('temperament', trait)}
                  className="ml-1 hover:text-info-content/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
