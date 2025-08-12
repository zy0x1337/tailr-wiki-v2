// components/ui/PropertiesFilter.tsx - Korrigierte Version
'use client'

import { useState } from 'react'
import { usePetProperties } from '@/components/providers/PetPropertiesProvider'
import { useFilters } from '@/components/providers/FilterProvider'
import { ChevronDown, Star, X, RotateCcw } from 'lucide-react'

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
  
  const { filters, updateFilter } = useFilters()  // ✅ filters ist jetzt verfügbar
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const handlePropertyToggle = (propertyId: string) => {
    toggleProperty(propertyId)
    
    // ✅ KORRIGIERT: Properties sind jetzt im FilterState definiert
    const updatedProperties = selectedProperties.includes(propertyId)
      ? selectedProperties.filter(id => id !== propertyId)
      : [...selectedProperties, propertyId]
    
    updateFilter('properties', updatedProperties)  // ✅ Funktioniert jetzt
  }

  const handleResetProperties = () => {
    resetProperties()
    updateFilter('properties', [])  // ✅ Filter auch zurücksetzen
  }

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category)
  }

  return (
    <div className="bg-base-100 rounded-xl shadow-lg border border-base-300 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐕</span>
          <h3 className="font-bold text-lg">Hunde-Eigenschaften</h3>
          {selectedProperties.length > 0 && (
            <div className="badge badge-primary">{selectedProperties.length}</div>
          )}
        </div>
        {selectedProperties.length > 0 && (
          <button
            onClick={handleResetProperties}  // ✅ Korrigierte Funktion
            className="btn btn-ghost btn-sm gap-2 text-error"
            title="Eigenschaften zurücksetzen"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Kategorie-Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {Object.entries(categoryConfig).map(([category, config]) => {
          const categoryProps = getPropertyByCategory(category)
          const selectedInCategory = categoryProps.filter(prop => 
            selectedProperties.includes(prop.id)
          ).length
          
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`btn btn-sm ${
                openCategory === category ? `btn-${config.color}` : 'btn-outline'
              } gap-2 justify-between`}
            >
              <div className="flex items-center gap-2">
                <span>{config.icon}</span>
                <span className="hidden sm:inline">{config.name}</span>
              </div>
              <div className="flex items-center gap-1">
                {selectedInCategory > 0 && (
                  <div className="badge badge-xs">{selectedInCategory}</div>
                )}
                <ChevronDown className={`w-3 h-3 transition-transform ${
                  openCategory === category ? 'rotate-180' : ''
                }`} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Eigenschaften-Grid */}
      {openCategory && (
        <div className="space-y-3 p-4 bg-base-200 rounded-lg">
          <h4 className="font-semibold text-base flex items-center gap-2">
            <span>{categoryConfig[openCategory as keyof typeof categoryConfig].icon}</span>
            {categoryConfig[openCategory as keyof typeof categoryConfig].name}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getPropertyByCategory(openCategory).map((property) => {
              const isSelected = selectedProperties.includes(property.id)
              
              return (
                <label
                  key={property.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-primary text-primary-content shadow-md' 
                      : 'bg-base-100 hover:bg-base-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={isSelected}
                    onChange={() => handlePropertyToggle(property.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{property.icon}</span>
                      <span className="font-medium">{property.name}</span>
                    </div>
                    <div className={`text-xs mt-1 ${
                      isSelected ? 'text-primary-content/80' : 'text-base-content/70'
                    }`}>
                      {property.description}
                    </div>
                  </div>
                  
                  {/* Rating Stars */}
                  {property.value > 0 && (
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < property.value 
                              ? 'text-warning fill-current' 
                              : 'text-base-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Aktive Eigenschaften-Tags */}
      {selectedProperties.length > 0 && (
        <div className="mt-4 pt-4 border-t border-base-300">
          <div className="text-sm font-medium mb-2">Ausgewählte Eigenschaften:</div>
          <div className="flex flex-wrap gap-2">
            {selectedProperties.map(propId => {
              const property = properties.find(p => p.id === propId)
              if (!property) return null
              
              return (
                <div key={propId} className="badge badge-primary gap-1">
                  <span>{property.icon}</span>
                  <span>{property.name}</span>
                  <button
                    onClick={() => handlePropertyToggle(propId)}
                    className="ml-1 hover:text-primary-content/70"
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
