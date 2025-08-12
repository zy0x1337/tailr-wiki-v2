// components/ui/FilteredPetGrid.tsx - Korrigiert: ALLE Hunde werden angezeigt

'use client'

import { useEffect, useMemo } from 'react'
import PetCard from './PetCard'
import { useFilters } from '@/components/providers/FilterProvider'
import { usePetProperties } from '@/components/providers/PetPropertiesProvider'
import { Search, Filter } from 'lucide-react'

interface Pet {
  id: number
  name: string
  breed?: string | null
  slug: string
  species: string
  primaryImage?: string | null
  description: string
  size?: string | null | undefined
  temperament?: string[] | null
  careLevel?: string | null
  ratings?: any | null
  origin?: string | null | undefined
  lifeExpectancy?: string | null | undefined
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

  // Helper function to count property matches
  function countPropertyMatches(pet: Pet, selectedProps: string[]): number {
    const petProperties = pet.properties || mapTemperamentToProperties(pet.temperament)
    return selectedProps.filter(prop => petProperties.includes(prop)).length
  }

  // ✅ NORMALISIERTE GRÖSSEN-FUNKTION
  const normalizeSize = (rawSize: string | null | undefined): string | null => {
    if (!rawSize || rawSize === undefined || rawSize === null) return null
    
    const size = rawSize.toLowerCase()
    
    if (size.includes('sehr klein')) return 'Sehr klein'
    if (size.includes('klein') && !size.includes('mittel') && !size.includes('groß')) return 'Klein'
    if (size.includes('klein-mittel')) return 'Klein-Mittel'
    if (size.includes('mittel') && !size.includes('groß') && !size.includes('klein')) return 'Mittel'
    if (size.includes('mittel-groß')) return 'Mittel-Groß'
    if (size.includes('groß') && !size.includes('sehr')) return 'Groß'
    if (size.includes('sehr groß')) return 'Sehr groß'
    if (size.includes('variabel')) return 'Variabel'
    
    // Fallback für cm-Angaben
    const cmMatch = rawSize.match(/(\d+)[-–](\d+)\s*cm/)
    if (cmMatch) {
      const avgSize = (parseInt(cmMatch[1]) + parseInt(cmMatch[2])) / 2
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

  // ✅ HELPER FUNCTIONS FÜR SICHERE SORTIERUNG
  const parseLifespan = (lifespan: string | null | undefined): number => {
    if (!lifespan) return 0
    const match = lifespan.match(/(\d+)/)
    return match ? parseInt(match[1]) : 0
  }

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

  const filteredAndSortedPets = useMemo(() => {
    // ✅ DEBUG: Log initial count
    console.log(`🔍 Starting with ${pets.length} pets`)
    
    let filtered = pets.filter(pet => {
      // ✅ KORRIGIERT: Search filter - NUR wenn aktiv
      if (filters.search && filters.search.trim().length > 0) {
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

      // ✅ KORRIGIERT: Size filter - NUR wenn Filter aktiv UND Pet hat Größe
      if (filters.size.length > 0) {
        if (pet.size) {
          const normalizedSize = normalizeSize(pet.size)
          if (normalizedSize && !filters.size.includes(normalizedSize)) {
            return false
          }
        }
        // ✅ WICHTIG: Pets OHNE Größe werden NICHT ausgefiltert!
      }

      // ✅ KORRIGIERT: Care level filter - NUR wenn Filter aktiv UND Pet hat careLevel
      if (filters.careLevel.length > 0) {
        if (pet.careLevel && !filters.careLevel.includes(pet.careLevel)) {
          return false
        }
        // ✅ WICHTIG: Pets OHNE careLevel werden NICHT ausgefiltert!
      }

      // ✅ KORRIGIERT: Temperament filter - NUR wenn Filter aktiv UND Pet hat temperament
      if (filters.temperament.length > 0) {
        if (pet.temperament && pet.temperament.length > 0) {
          const hasMatchingTrait = filters.temperament.some(trait => 
            pet.temperament?.includes(trait)
          )
          if (!hasMatchingTrait) return false
        }
        // ✅ WICHTIG: Pets OHNE temperament werden NICHT ausgefiltert!
      }

      // Properties filter - nur wenn aktiv
      if (selectedProperties.length > 0) {
        const petProperties = pet.properties || mapTemperamentToProperties(pet.temperament)
        const hasMatchingProperties = selectedProperties.some(propId => 
          petProperties.includes(propId)
        )
        if (!hasMatchingProperties) return false
      }

      return true
    })

    // ✅ DEBUG: Log after filtering
    console.log(`🔍 After filtering: ${filtered.length} pets`)

    // ✅ SORTIERUNG
    filtered.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
          
        case 'breed':
          const breedA = a.breed || 'Unbekannt'
          const breedB = b.breed || 'Unbekannt'
          comparison = breedA.localeCompare(breedB)
          break
          
        case 'origin':
          const originA = a.origin || 'Unbekannt'
          const originB = b.origin || 'Unbekannt'
          comparison = originA.localeCompare(originB)
          break
          
        case 'lifespan':
          comparison = parseLifespan(a.lifeExpectancy) - parseLifespan(b.lifeExpectancy)
          break
          
        case 'size':
          comparison = getSizeOrder(normalizeSize(a.size)) - getSizeOrder(normalizeSize(b.size))
          break
          
        case 'properties':
          const aMatches = countPropertyMatches(a, selectedProperties)
          const bMatches = countPropertyMatches(b, selectedProperties)
          comparison = bMatches - aMatches
          break
          
        default:
          comparison = 0
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison
    })

    console.log(`🔍 Final result: ${filtered.length} pets displayed`)
    return filtered
  }, [pets, filters, selectedProperties])

  // Update filtered count
  useEffect(() => {
    setFilteredCount(filteredAndSortedPets.length)
  }, [filteredAndSortedPets.length, setFilteredCount])

  if (filteredAndSortedPets.length === 0) {
    return (
      <div className="col-span-full">
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body text-center py-16">
            <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-base-content/50" />
            </div>
            
            <h3 className="text-xl font-bold mb-4">Keine Rassen gefunden</h3>
            
            <p className="text-base-content/70 mb-6 max-w-md mx-auto">
              Versuche andere Filter oder entferne einige Einstellungen.
            </p>
            
            {selectedProperties.length > 0 && (
              <div className="bg-info/10 rounded-lg p-4 max-w-md mx-auto">
                <div className="text-sm text-info">
                  Aktuell ausgewählt: <span className="font-semibold">{selectedProperties.length}</span> Eigenschaften
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {filteredAndSortedPets.map((pet) => (
        <PetCard
          key={pet.id}
          pet={pet}
          showPropertyMatch={countPropertyMatches(pet, selectedProperties) > 0}
        />
      ))}
    </>
  )
}
