// components/ui/FilteredPetGrid.tsx - Mit korrekten Props
'use client'

import { useEffect, useMemo } from 'react'
import PetCard from './PetCard'
import { useFilters } from '@/components/providers/FilterProvider'
import { usePetProperties } from '@/components/providers/PetPropertiesProvider'

interface Pet {
  id: number
  name: string
  breed?: string | null
  slug: string
  species: string
  primaryImage?: string | null
  description: string
  size?: string | null
  temperament?: string[] | null
  careLevel?: string | null
  ratings?: any | null
  origin?: string | null
  lifeExpectancy?: string | null
  weight?: string | null
  properties?: string[] | null
}

interface FilteredPetGridProps {
  pets: Pet[]
}

export default function FilteredPetGrid({ pets }: FilteredPetGridProps) {
  const { filters, setFilteredCount } = useFilters()
  const { selectedProperties } = usePetProperties()

  // Helper function to map temperament to properties
  function mapTemperamentToProperties(temperament?: string[] | null): string[] {
    if (!temperament) return []
    
    const mapping: { [key: string]: string[] } = {
      'Intelligent': ['intelligent'],
      'Loyal': ['loyal'],
      'Freundlich': ['friendly'],
      'Ruhig': ['calm'],
      'Verspielt': ['playful'],
      'Beschützend': ['protective'],
      'Kinderlieb': ['good_with_kids'],
      'Verträglich': ['good_with_pets'],
      'Pflegeleicht': ['grooming_easy'],
      'Robust': ['health_robust'],
      'Aktiv': ['exercise_needs'],
      'Lernwillig': ['training_easy']
    }
    
    return temperament.flatMap(trait => mapping[trait] || [])
  }

  // Helper function to get matching properties for a pet
  function getMatchingProperties(pet: Pet, selectedProps: string[]): string[] {
    const petProperties = pet.properties || mapTemperamentToProperties(pet.temperament)
    return selectedProps.filter(prop => petProperties.includes(prop))
  }

  // Helper function to count property matches
  function countPropertyMatches(pet: Pet, selectedProps: string[]): number {
    return getMatchingProperties(pet, selectedProps).length
  }

  const filteredAndSortedPets = useMemo(() => {
    let filtered = pets.filter(pet => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = pet.name.toLowerCase().includes(searchLower)
        const matchesBreed = pet.breed?.toLowerCase().includes(searchLower)
        const matchesTemperament = pet.temperament?.some(trait => 
          trait.toLowerCase().includes(searchLower)
        )
        if (!matchesName && !matchesBreed && !matchesTemperament) {
          return false
        }
      }

      // Size filter
      if (filters.size.length > 0 && pet.size) {
        if (!filters.size.includes(pet.size)) return false
      }

      // Care level filter
      if (filters.careLevel.length > 0 && pet.careLevel) {
        if (!filters.careLevel.includes(pet.careLevel)) return false
      }

      // Temperament filter
      if (filters.temperament.length > 0 && pet.temperament) {
        const hasMatchingTrait = filters.temperament.some(trait =>
          pet.temperament?.includes(trait)
        )
        if (!hasMatchingTrait) return false
      }

      // Properties filter
      if (selectedProperties.length > 0) {
        const petProperties = pet.properties || mapTemperamentToProperties(pet.temperament)
        const hasMatchingProperties = selectedProperties.some(propId =>
          petProperties.includes(propId)
        )
        if (!hasMatchingProperties) return false
      }

      return true
    })

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'size':
          const sizeOrder = { 'Klein': 1, 'Mittel': 2, 'Groß': 3, 'Sehr groß': 4 }
          const aSize = sizeOrder[a.size as keyof typeof sizeOrder] || 0
          const bSize = sizeOrder[b.size as keyof typeof sizeOrder] || 0
          comparison = aSize - bSize
          break
        case 'care':
          const careOrder = { 'Niedrig': 1, 'Mittel': 2, 'Hoch': 3, 'Anspruchsvoll': 4 }
          const aCare = careOrder[a.careLevel as keyof typeof careOrder] || 0
          const bCare = careOrder[b.careLevel as keyof typeof careOrder] || 0
          comparison = aCare - bCare
          break
        case 'properties':
          // Sort by property match count
          const aMatches = countPropertyMatches(a, selectedProperties)
          const bMatches = countPropertyMatches(b, selectedProperties)
          comparison = bMatches - aMatches
          break
        default:
          comparison = 0
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [pets, filters, selectedProperties])

  // Update filtered count
  useEffect(() => {
    setFilteredCount(filteredAndSortedPets.length)
  }, [filteredAndSortedPets.length, setFilteredCount])

  if (filteredAndSortedPets.length === 0) {
    return (
      <div className="col-span-full">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Keine passenden Hunde gefunden</h3>
            <p className="text-base-content/70 mb-4">
              Versuche andere Eigenschaften oder entferne einige Filter.
            </p>
            {selectedProperties.length > 0 && (
              <p className="text-sm text-base-content/50">
                Aktuell ausgewählt: {selectedProperties.length} Eigenschaften
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {filteredAndSortedPets.map((pet) => {
        const matchingProperties = getMatchingProperties(pet, selectedProperties)
        
        return (
          <PetCard 
            key={pet.id} 
            pet={pet} 
            showPropertyMatch={selectedProperties.length > 0}  // ✅ Korrekte Prop
            matchingProperties={matchingProperties}  // ✅ Passende Properties übergeben
          />
        )
      })}
    </>
  )
}
