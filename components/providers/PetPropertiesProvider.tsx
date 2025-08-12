// components/providers/PetPropertiesProvider.tsx
'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface PetProperty {
  id: string
  name: string
  value: number // 1-5 Bewertung
  description: string
  icon: string
  category: 'temperament' | 'care' | 'physical' | 'social'
}

interface PetPropertiesContextType {
  properties: PetProperty[]
  selectedProperties: string[]
  toggleProperty: (propertyId: string) => void
  getPropertyByCategory: (category: string) => PetProperty[]
  resetProperties: () => void
  getAverageRating: (category?: string) => number
}

// Standard-Eigenschaften für Hunde (basierend auf deinem Script)
const defaultDogProperties: PetProperty[] = [
  // Temperament
  { id: 'intelligent', name: 'Intelligent', value: 0, description: 'Lernfähigkeit und Auffassungsgabe', icon: '🧠', category: 'temperament' },
  { id: 'loyal', name: 'Loyal', value: 0, description: 'Treue und Bindung zum Besitzer', icon: '❤️', category: 'temperament' },
  { id: 'playful', name: 'Verspielt', value: 0, description: 'Spieltrieb und Aktivität', icon: '🎾', category: 'temperament' },
  { id: 'calm', name: 'Ruhig', value: 0, description: 'Ausgeglichenes und ruhiges Wesen', icon: '😌', category: 'temperament' },
  { id: 'protective', name: 'Beschützend', value: 0, description: 'Wachsamkeit und Schutzinstinkt', icon: '🛡️', category: 'temperament' },
  { id: 'friendly', name: 'Freundlich', value: 0, description: 'Offenheit gegenüber Menschen', icon: '😊', category: 'temperament' },
  
  // Pflege
  { id: 'grooming_easy', name: 'Pflegeleicht', value: 0, description: 'Geringer Pflegeaufwand', icon: '✨', category: 'care' },
  { id: 'exercise_needs', name: 'Bewegungsbedarf', value: 0, description: 'Täglicher Auslaufbedarf', icon: '🏃', category: 'care' },
  { id: 'training_easy', name: 'Erziehung', value: 0, description: 'Trainierbarkeit und Gehorsam', icon: '🎓', category: 'care' },
  { id: 'health_robust', name: 'Robust', value: 0, description: 'Gesundheit und Widerstandsfähigkeit', icon: '💪', category: 'care' },
  
  // Physisch
  { id: 'size_small', name: 'Klein', value: 0, description: 'Körpergröße unter 35cm', icon: '🐕', category: 'physical' },
  { id: 'size_medium', name: 'Mittelgroß', value: 0, description: 'Körpergröße 35-60cm', icon: '🐕‍🦺', category: 'physical' },
  { id: 'size_large', name: 'Groß', value: 0, description: 'Körpergröße über 60cm', icon: '🐺', category: 'physical' },
  { id: 'shed_low', name: 'Wenig Haarverlust', value: 0, description: 'Geringer Haarverlust', icon: '🧹', category: 'physical' },
  
  // Sozial
  { id: 'good_with_kids', name: 'Kinderfreundlich', value: 0, description: 'Geeignet für Familien mit Kindern', icon: '👶', category: 'social' },
  { id: 'good_with_pets', name: 'Verträglich', value: 0, description: 'Kommt gut mit anderen Tieren aus', icon: '🐾', category: 'social' },
  { id: 'apartment_suitable', name: 'Wohnungshaltung', value: 0, description: 'Geeignet für Wohnungshaltung', icon: '🏠', category: 'social' },
  { id: 'first_time_owner', name: 'Anfänger geeignet', value: 0, description: 'Für Hundeanfänger geeignet', icon: '⭐', category: 'social' }
]

const PetPropertiesContext = createContext<PetPropertiesContextType | null>(null)

export function PetPropertiesProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<PetProperty[]>(defaultDogProperties)
  const [selectedProperties, setSelectedProperties] = useState<string[]>([])

  const toggleProperty = useCallback((propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }, [])

  const getPropertyByCategory = useCallback((category: string) => {
    return properties.filter(prop => prop.category === category)
  }, [properties])

  const resetProperties = useCallback(() => {
    setSelectedProperties([])
  }, [])

  const getAverageRating = useCallback((category?: string) => {
    const relevantProps = category 
      ? properties.filter(p => p.category === category)
      : properties
    
    const totalRating = relevantProps.reduce((sum, prop) => sum + prop.value, 0)
    return relevantProps.length > 0 ? totalRating / relevantProps.length : 0
  }, [properties])

  return (
    <PetPropertiesContext.Provider value={{
      properties,
      selectedProperties,
      toggleProperty,
      getPropertyByCategory,
      resetProperties,
      getAverageRating
    }}>
      {children}
    </PetPropertiesContext.Provider>
  )
}

export function usePetProperties() {
  const context = useContext(PetPropertiesContext)
  if (!context) {
    throw new Error('usePetProperties must be used within PetPropertiesProvider')
  }
  return context
}
