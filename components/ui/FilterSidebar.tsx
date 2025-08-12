'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, Filter, X, ChevronDown, RotateCcw, Check } from 'lucide-react'
import { useFilters } from '@/components/providers/FilterProvider'

interface CompactFilterBarProps {
  pets: Array<{
    temperament?: string[] | null
    size?: string | null | undefined
    careLevel?: string | null
  }>
}

export default function CompactFilterBar({ pets }: CompactFilterBarProps) {
  const { filters, updateFilter, resetFilters, filteredCount } = useFilters()
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const setDropdownRef = (key: string) => (el: HTMLDivElement | null) => {
    dropdownRefs.current[key] = el
  }

  // ✅ KORRIGIERT: Erweiterte normalizeSize mit getSizeOrder für Sortierung
  const normalizeSize = (rawSize: string | null | undefined): string | null => {
    if (!rawSize || rawSize === undefined) return null
    
    const size = rawSize.toLowerCase()
    
    // Kategorisierung basierend auf Schlüsselworten
    if (size.includes('sehr klein') || size.includes('12-15') || size.includes('15-23') || size.includes('18-23')) {
      return 'Sehr klein'
    }
    if (size.includes('klein') && !size.includes('mittel') && !size.includes('groß')) {
      return 'Klein'
    }
    if (size.includes('klein-mittel') || (size.includes('klein') && size.includes('mittel'))) {
      return 'Klein-Mittel'
    }
    if (size.includes('mittel') && !size.includes('groß') && !size.includes('klein')) {
      return 'Mittel'
    }
    if (size.includes('mittel-groß') || (size.includes('mittel') && size.includes('groß'))) {
      return 'Mittel-Groß'
    }
    if (size.includes('groß') && !size.includes('sehr') && !size.includes('mittel')) {
      return 'Groß'
    }
    if (size.includes('sehr groß')) {
      return 'Sehr groß'
    }
    if (size.includes('variabel')) {
      return 'Variabel'
    }
    
    // Fallback für cm-Angaben ohne Kategorie
    const cmMatch = rawSize.match(/(\d+)[-–](\d+)\s*cm/)
    if (cmMatch) {
      const minSize = parseInt(cmMatch[1])
      const maxSize = parseInt(cmMatch[2])
      const avgSize = (minSize + maxSize) / 2
      
      if (avgSize <= 23) return 'Sehr klein'
      if (avgSize <= 40) return 'Klein'
      if (avgSize <= 50) return 'Klein-Mittel'
      if (avgSize <= 60) return 'Mittel'
      if (avgSize <= 70) return 'Mittel-Groß'
      if (avgSize <= 80) return 'Groß'
      return 'Sehr groß'
    }
    
    return rawSize
  }

  // ✅ NEU: Helper-Funktion für Größen-Sortierung
  const getSizeOrder = (size: string | null): number => {
    const sizeOrder: Record<string, number> = {
      'Sehr klein': 1,
      'Klein': 2,
      'Klein-Mittel': 3,
      'Mittel': 4,
      'Mittel-Groß': 5,
      'Groß': 6,
      'Sehr groß': 7,
      'Variabel': 8
    }
    return sizeOrder[size || ''] || 999
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && dropdownRefs.current[openDropdown]) {
        const dropdownElement = dropdownRefs.current[openDropdown]
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [openDropdown])

  // ESC key to close dropdown
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openDropdown) {
        setOpenDropdown(null)
      }
    }

    if (openDropdown) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [openDropdown])

  const availableOptions = {
    sizes: [...new Set(
      pets
        .map(p => normalizeSize(p.size))
        .filter((size): size is string => size !== null && size !== undefined)
    )].sort((a, b) => getSizeOrder(a) - getSizeOrder(b)),
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
    return filters.size.length + filters.careLevel.length + filters.temperament.length
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
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" />
        <input
          type="text"
          placeholder="Nach Rassen suchen..."
          className="input input-bordered w-full pl-12 pr-12 py-3 text-base rounded-xl"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/50 hover:text-base-content transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Indicator */}
      {hasActiveSearch && (
        <div className="bg-info/10 rounded-lg p-3">
          <div className="text-sm font-medium text-info">
            Suche nach "{filters.search}"
          </div>
          {filteredCount > 0 && (
            <div className="text-xs text-info/80">
              {filteredCount} gefunden
            </div>
          )}
        </div>
      )}

      {/* Filter-Leiste */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Label */}
        <div className="flex items-center gap-2 text-sm font-medium text-base-content/70">
          <Filter className="w-4 h-4" />
          Filter:
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {/* Size Filter */}
          {availableOptions.sizes.length > 0 && (
            <div 
              className="relative"
              ref={setDropdownRef('size')}
            >
              <button
                onClick={() => toggleDropdown('size')}
                className={`btn btn-sm ${
                  filters.size.length > 0 ? 'btn-primary' : 'btn-outline'
                } gap-2`}
              >
                {getFilterButtonText('size', filters.size)}
                {filters.size.length > 0 && (
                  <span className="badge badge-sm badge-primary-content">
                    {filters.size.length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  openDropdown === 'size' ? 'rotate-180' : ''
                }`} />
              </button>
              
              {openDropdown === 'size' && (
                <>
                  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
                  
                  <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-xl shadow-2xl z-50 min-w-64 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-base-300 flex items-center justify-between">
                      <div className="text-sm font-semibold text-base-content">Größe auswählen</div>
                      <button
                        onClick={() => setOpenDropdown(null)}
                        className="btn btn-ghost btn-xs rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-2">
                      {availableOptions.sizes.map(size => {
                        const sizeEmojis: Record<string, string> = {
                          'Sehr klein': '🐭',
                          'Klein': '🐶',
                          'Klein-Mittel': '🐕',
                          'Mittel': '🦮',
                          'Mittel-Groß': '🐕‍🦺',
                          'Groß': '🐺',
                          'Sehr groß': '🐕‍🦺',
                          'Variabel': '📏'
                        }
                        
                        return (
                          <label key={size} className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm checkbox-primary"
                              checked={filters.size.includes(size)}
                              onChange={() => handleMultiSelectChange('size', size)}
                            />
                            <span className="text-lg">{sizeEmojis[size] || '📐'}</span>
                            <span className="text-sm font-medium flex-1">{size}</span>
                            {filters.size.includes(size) && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Care Level Filter */}
          {availableOptions.careLevels.length > 0 && (
            <div 
              className="relative"
              ref={setDropdownRef('careLevel')}
            >
              <button
                onClick={() => toggleDropdown('careLevel')}
                className={`btn btn-sm ${
                  filters.careLevel.length > 0 ? 'btn-secondary' : 'btn-outline'
                } gap-2`}
              >
                {getFilterButtonText('careLevel', filters.careLevel)}
                {filters.careLevel.length > 0 && (
                  <span className="badge badge-sm badge-secondary-content">
                    {filters.careLevel.length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  openDropdown === 'careLevel' ? 'rotate-180' : ''
                }`} />
              </button>
              
              {openDropdown === 'careLevel' && (
                <>
                  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-xl shadow-2xl z-50 min-w-64 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-base-300 flex items-center justify-between">
                      <div className="text-sm font-semibold text-base-content">Pflegeaufwand</div>
                      <button
                        onClick={() => setOpenDropdown(null)}
                        className="btn btn-ghost btn-xs rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-2">
                      {availableOptions.careLevels.map(level => (
                        <label key={level} className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm checkbox-secondary"
                            checked={filters.careLevel.includes(level)}
                            onChange={() => handleMultiSelectChange('careLevel', level)}
                          />
                          <span className="text-sm font-medium">{level}</span>
                          {filters.careLevel.includes(level) && (
                            <Check className="w-4 h-4 text-secondary ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Temperament Filter */}
          {availableOptions.temperaments.length > 0 && (
            <div 
              className="relative"
              ref={setDropdownRef('temperament')}
            >
              <button
                onClick={() => toggleDropdown('temperament')}
                className={`btn btn-sm ${
                  filters.temperament.length > 0 ? 'btn-accent' : 'btn-outline'
                } gap-2`}
              >
                {getFilterButtonText('temperament', filters.temperament)}
                {filters.temperament.length > 0 && (
                  <span className="badge badge-sm badge-accent-content">
                    {filters.temperament.length}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  openDropdown === 'temperament' ? 'rotate-180' : ''
                }`} />
              </button>
              
              {openDropdown === 'temperament' && (
                <>
                  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-xl shadow-2xl z-50 min-w-64 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-base-300 flex items-center justify-between">
                      <div className="text-sm font-semibold text-base-content">Charaktereigenschaften</div>
                      <button
                        onClick={() => setOpenDropdown(null)}
                        className="btn btn-ghost btn-xs rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-2">
                      {availableOptions.temperaments.slice(0, 12).map(trait => (
                        <label key={trait} className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm checkbox-accent"
                            checked={filters.temperament.includes(trait)}
                            onChange={() => handleMultiSelectChange('temperament', trait)}
                          />
                          <span className="text-sm font-medium">{trait}</span>
                          {filters.temperament.includes(trait) && (
                            <Check className="w-4 h-4 text-accent ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ✅ KORRIGIERTER Sort Dropdown - Ohne Pflege-Sortierung */}
          <div 
            className="relative"
            ref={setDropdownRef('sort')}
          >
            <button
              onClick={() => toggleDropdown('sort')}
              className="btn btn-sm btn-outline gap-2"
            >
              Sortieren
              <ChevronDown className={`w-4 h-4 transition-transform ${
                openDropdown === 'sort' ? 'rotate-180' : ''
              }`} />
            </button>
            
            {openDropdown === 'sort' && (
  <>
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
    <div className="absolute top-full right-0 mt-2 bg-base-100 border border-base-300 rounded-xl shadow-2xl z-50 min-w-52 max-h-80 overflow-hidden">
      <div className="p-3 border-b border-base-300 flex items-center justify-between">
        <div className="text-sm font-semibold text-base-content">Sortierung</div>
        <button
          onClick={() => setOpenDropdown(null)}
          className="btn btn-ghost btn-xs rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* ✅ SCROLLABLE CONTENT CONTAINER */}
      <div className="max-h-64 overflow-y-auto p-2 sort-scroll">
        {[
          // Alphabetische Sortierung
          { value: 'name-asc', label: 'Name A-Z', icon: '🔤', category: 'Alphabetisch' },
          { value: 'name-desc', label: 'Name Z-A', icon: '🔤', category: 'Alphabetisch' },
          
          // Physische Eigenschaften
          { value: 'size-asc', label: 'Klein → Groß', icon: '📏', category: 'Größe' },
          { value: 'size-desc', label: 'Groß → Klein', icon: '📏', category: 'Größe' },
          
          // Herkunft & Geografie
          { value: 'origin-asc', label: 'Herkunft A-Z', icon: '🌍', category: 'Herkunft' },
          { value: 'origin-desc', label: 'Herkunft Z-A', icon: '🌍', category: 'Herkunft' },
          
          // Lebensdauer
          { value: 'lifespan-asc', label: 'Kurze → Lange Lebensdauer', icon: '⏱️', category: 'Lebensdauer' },
          { value: 'lifespan-desc', label: 'Lange → Kurze Lebensdauer', icon: '⏱️', category: 'Lebensdauer' },
          
          // Rasse
          { value: 'breed-asc', label: 'Rasse A-Z', icon: '🐕', category: 'Rasse' },
          { value: 'breed-desc', label: 'Rasse Z-A', icon: '🐕', category: 'Rasse' }
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
              className={`w-full text-left p-3 hover:bg-base-200 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                isActive ? 'bg-primary text-primary-content' : ''
              }`}
            >
              <span>{option.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-xs opacity-70">{option.category}</div>
              </div>
              {isActive && <Check className="w-4 h-4" />}
            </button>
          )
        })}
      </div>
    </div>
  </>
)}
          </div>
        </div>

        {/* Right Side: Results + Reset */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Results Counter */}
          {filteredCount > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="font-semibold text-primary">{filteredCount}</span>
              <span className="text-base-content/70">Rassen gefunden</span>
              <div className="badge badge-ghost badge-sm">Ergebnisse</div>
            </div>
          )}

          {/* Reset Button */}
          {(activeFilterCount > 0 || hasActiveSearch) && (
            <button
              onClick={resetFilters}
              className="btn btn-ghost btn-sm gap-2 hover:btn-error"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(activeFilterCount > 0 || hasActiveSearch) && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <div className="badge badge-primary gap-1">
              🔍 "{filters.search}"
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
  )
}
