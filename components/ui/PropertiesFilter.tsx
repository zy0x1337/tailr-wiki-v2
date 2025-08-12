// components/ui/PropertiesFilter.tsx - Optimiert mit professioneller UX

'use client'

import { useState } from 'react'
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
    setOpenCategory(openCategory === category ? null : category)
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
            <div key={category} className="relative">
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

              {/* Professional Properties Dropdown */}
              {openCategory === category && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setOpenCategory(null)}
                  />
                  
                  {/* Dropdown Content */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-base-300">
                      <div className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        <span className="text-sm font-semibold text-base-content">
                          {config.name}-Eigenschaften
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      {getPropertyByCategory(category).map((property) => {
                        const isSelected = selectedProperties.includes(property.id)
                        
                        return (
                          <label 
                            key={property.id}
                            className="flex items-start gap-3 p-3 hover:bg-base-200 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              className={`checkbox checkbox-sm checkbox-${config.color} mt-1`}
                              checked={isSelected}
                              onChange={() => handlePropertyToggle(property.id)}
                            />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{property.icon}</span>
                                <span className="text-sm font-medium">{property.name}</span>
                                {isSelected && (
                                  <Check className={`w-4 h-4 text-${config.color} ml-auto`} />
                                )}
                              </div>
                              
                              <div className="text-xs text-base-content/70 line-clamp-2">
                                {property.description}
                              </div>
                              
                              {/* Rating Stars */}
                              {property.value > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
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
                      })}
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
            Ausgewählte Eigenschaften
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedProperties.map(propId => {
              const property = properties.find(p => p.id === propId)
              if (!property) return null

              return (
                <div key={propId} className="badge badge-accent badge-sm gap-1">
                  <span>{property.icon}</span>
                  <span>{property.name}</span>
                  <button
                    onClick={() => handlePropertyToggle(propId)}
                    className="ml-1 hover:text-accent-content/70"
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
