// components/ui/PropertiesFilter.tsx - Korrigiert mit dynamischer Positioning

'use client'

import { useState, useRef, useEffect } from 'react'
import { usePetProperties } from '@/components/providers/PetPropertiesProvider'
import { useFilters } from '@/components/providers/FilterProvider'
import { ChevronDown, X, RotateCcw, Settings, Check } from 'lucide-react'

const categoryConfig = {
  temperament: { name: 'Charakter', icon: '🧠', color: 'primary' },
  care: { name: 'Pflege', icon: '✨', color: 'secondary' },
  physical: { name: 'Physisch', icon: '💪', color: 'accent' },
  social: { name: 'Sozial', icon: '👥', color: 'info' }
}

export default function PropertiesFilter() {
  const {
    properties,
    selectedProperties,
    toggleProperty,
    getPropertyByCategory,
    resetProperties
  } = usePetProperties()
  const { filters, updateFilter } = useFilters()
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom')
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ✅ Helper function für Ref-Zuweisung
  const setDropdownRef = (key: string) => (el: HTMLDivElement | null) => {
    dropdownRefs.current[key] = el
  }

  // ✅ Calculate optimal dropdown position
  const calculateDropdownPosition = (buttonElement: HTMLElement) => {
    const rect = buttonElement.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const dropdownHeight = 400 // max-h-96 = 384px + padding
    
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top
    
    // Wenn nicht genug Platz unten, aber genug oben -> nach oben öffnen
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      return 'top'
    }
    
    return 'bottom'
  }

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openCategory && dropdownRefs.current[openCategory]) {
        const dropdownElement = dropdownRefs.current[openCategory]
        if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
          setOpenCategory(null)
        }
      }
    }

    if (openCategory) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openCategory])

  // ✅ ESC key to close dropdown
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && openCategory) {
        setOpenCategory(null)
      }
    }

    if (openCategory) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [openCategory])

  const handlePropertyToggle = (propertyId: string) => {
    toggleProperty(propertyId)
    const updatedProperties = selectedProperties.includes(propertyId)
      ? selectedProperties.filter(id => id !== propertyId)
      : [...selectedProperties, propertyId]
    updateFilter('properties', updatedProperties)
  }

  const handleResetProperties = () => {
    resetProperties()
    updateFilter('properties', [])
  }

  const toggleCategory = (category: string) => {
    if (openCategory === category) {
      setOpenCategory(null)
    } else {
      // ✅ Calculate position before opening
      const buttonElement = dropdownRefs.current[category]?.querySelector('button') as HTMLElement
      if (buttonElement) {
        const position = calculateDropdownPosition(buttonElement)
        setDropdownPosition(position)
      }
      setOpenCategory(category)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Settings className="w-4 h-4 text-accent" />
          Erweitert
        </h3>
        {selectedProperties.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="badge badge-accent badge-sm">
              {selectedProperties.length}
            </span>
            <button
              onClick={handleResetProperties}
              className="btn btn-ghost btn-xs gap-1 hover:btn-error"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Category Buttons */}
      <div className="space-y-2">
        {Object.entries(categoryConfig).map(([category, config]) => {
          const categoryProps = getPropertyByCategory(category)
          const selectedInCategory = categoryProps.filter(prop =>
            selectedProperties.includes(prop.id)
          ).length

          return (
            <div 
              key={category} 
              className="relative"
              ref={setDropdownRef(category)}
            >
              <button
                onClick={() => toggleCategory(category)}
                className={`btn btn-sm w-full justify-between ${
                  openCategory === category ? `btn-${config.color}` : 'btn-outline'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{config.icon}</span>
                  <span>{config.name}</span>
                  {selectedInCategory > 0 && (
                    <span className={`badge badge-sm badge-${config.color}-content`}>
                      {selectedInCategory}
                    </span>
                  )}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  openCategory === category ? 'rotate-180' : ''
                }`} />
              </button>

              {/* ✅ KORRIGIERT: Portal-Style Dropdown mit dynamischer Position */}
              {openCategory === category && (
                <>
                  {/* Backdrop - Fixed Overlay */}
                  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />
                  
                  {/* ✅ KORRIGIERT: Fixed Positioned Dropdown für bessere Sichtbarkeit */}
                  <div 
                    className={`fixed bg-base-100 border border-base-300 rounded-xl shadow-2xl z-50 w-80 max-h-96 overflow-hidden properties-dropdown ${
                      dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                    }`}
                    style={{
                      left: dropdownRefs.current[category]?.getBoundingClientRect().left || 0,
                      [dropdownPosition === 'top' ? 'bottom' : 'top']: 
                        dropdownPosition === 'top' 
                          ? window.innerHeight - (dropdownRefs.current[category]?.getBoundingClientRect().top || 0) + 8
                          : (dropdownRefs.current[category]?.getBoundingClientRect().bottom || 0) + 8
                    }}
                  >
                    <div className="p-3 border-b border-base-300 flex items-center justify-between bg-base-50">
                      <div className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        <span className="text-sm font-semibold text-base-content">
                          {config.name}-Eigenschaften
                        </span>
                        <span className="badge badge-sm badge-outline">
                          {categoryProps.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setOpenCategory(null)}
                        className="btn btn-ghost btn-xs rounded-full hover:btn-error"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* ✅ Scrollable Content Container */}
                    <div className="max-h-80 overflow-y-auto p-2 properties-scroll">
                      {categoryProps.length === 0 ? (
                        <div className="p-6 text-center text-base-content/50">
                          <div className="text-4xl mb-2">{config.icon}</div>
                          <div className="text-sm">
                            Keine {config.name}-Eigenschaften verfügbar
                          </div>
                        </div>
                      ) : (
                        categoryProps.map((property) => {
                          const isSelected = selectedProperties.includes(property.id)
                          
                          return (
                            <label 
                              key={property.id}
                              className="flex items-start gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer transition-all duration-200 property-item"
                            >
                              <input
                                type="checkbox"
                                className={`checkbox checkbox-sm checkbox-${config.color} mt-1 flex-shrink-0`}
                                checked={isSelected}
                                onChange={() => handlePropertyToggle(property.id)}
                              />
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-lg flex-shrink-0">{property.icon}</span>
                                  <span className="text-sm font-medium leading-tight">{property.name}</span>
                                  {isSelected && (
                                    <Check className={`w-4 h-4 text-${config.color} ml-auto flex-shrink-0`} />
                                  )}
                                </div>
                                
                                <div className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                                  {property.description}
                                </div>
                                
                                {/* Rating Stars */}
                                {property.value > 0 && (
                                  <div className="flex gap-1 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                      <div
                                        key={i}
                                        className={`w-2 h-2 rounded-full transition-colors ${
                                          i < property.value 
                                            ? `bg-${config.color}` 
                                            : 'bg-base-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </label>
                          )
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected Properties Summary */}
      {selectedProperties.length > 0 && (
        <div className="bg-accent/10 rounded-lg p-3">
          <div className="text-xs font-semibold text-accent mb-2 uppercase tracking-wide">
            Ausgewählte Eigenschaften ({selectedProperties.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedProperties.map(propId => {
              const property = properties.find(p => p.id === propId)
              if (!property) return null

              return (
                <div key={propId} className="badge badge-accent badge-sm gap-1">
                  <span>{property.icon}</span>
                  <span className="text-xs">{property.name}</span>
                  <button
                    onClick={() => handlePropertyToggle(propId)}
                    className="ml-1 hover:text-accent-content/70 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
