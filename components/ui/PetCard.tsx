// components/ui/PetCard.tsx - Type-safe Image Handling
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Calendar, Scale, Activity } from 'lucide-react'

interface Pet {
  id: number
  name: string
  breed?: string | null
  slug: string
  species: string
  primaryImage?: string | null | undefined  // ✅ Erlaubt undefined
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

interface PetCardProps {
  pet: Pet
  showPropertyMatch?: boolean
  matchingProperties?: string[]
}

// ✅ KORRIGIERT: Akzeptiert auch undefined
const getImageSrc = (image: string | null | undefined): string => {
  if (!image) return '/images/placeholder-pet.jpg'
  return image.startsWith('/') ? image : `/${image}`
}

export default function PetCard({ pet, showPropertyMatch = false, matchingProperties = [] }: PetCardProps) {
  // Property Match Score berechnen
  const propertyMatchScore = showPropertyMatch && matchingProperties.length > 0
    ? Math.round((matchingProperties.length / Math.max(matchingProperties.length, 1)) * 100)
    : 0

  return (
    <Link href={`/${pet.species}/${pet.slug}`}>
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
        {/* Image Container */}
        <figure className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={getImageSrc(pet.primaryImage)}
            alt={pet.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Property Match Badge */}
          {showPropertyMatch && propertyMatchScore > 0 && (
            <div className="absolute top-3 right-3 badge badge-success gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-bold">{propertyMatchScore}%</span>
            </div>
          )}
          
          {/* Care Level Badge */}
          {pet.careLevel && (
            <div className="absolute top-3 left-3 badge badge-primary badge-sm shadow-lg">
              <Activity className="w-3 h-3 mr-1" />
              {pet.careLevel}
            </div>
          )}
        </figure>

        {/* Card Body */}
        <div className="card-body p-4">
          {/* Title */}
          <h3 className="card-title text-lg font-bold text-base-content group-hover:text-primary transition-colors line-clamp-2">
            {pet.name}
          </h3>
          
          {/* Breed (if different from name) */}
          {pet.breed && pet.breed !== pet.name && (
            <div className="text-sm text-primary font-medium mb-2">
              {pet.breed}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-base-content/70 line-clamp-3 mb-3">
            {pet.description}
          </p>

          {/* Quick Facts */}
          <div className="space-y-2 mb-4">
            {pet.size && (
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <Scale className="w-3 h-3" />
                <span>Größe: {pet.size}</span>
              </div>
            )}
            
            {pet.origin && (
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <MapPin className="w-3 h-3" />
                <span>Herkunft: {pet.origin}</span>
              </div>
            )}
            
            {pet.lifeExpectancy && (
              <div className="flex items-center gap-2 text-xs text-base-content/60">
                <Calendar className="w-3 h-3" />
                <span>{pet.lifeExpectancy}</span>
              </div>
            )}
          </div>

          {/* Temperament Tags */}
          {pet.temperament && pet.temperament.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {pet.temperament.slice(0, 3).map((trait) => (
                <div key={trait} className="badge badge-outline badge-xs">
                  {trait}
                </div>
              ))}
              {pet.temperament.length > 3 && (
                <div className="badge badge-ghost badge-xs">
                  +{pet.temperament.length - 3}
                </div>
              )}
            </div>
          )}

          {/* Property Matches */}
          {showPropertyMatch && matchingProperties.length > 0 && (
            <div className="border-t border-base-300 pt-3 mt-3">
              <div className="text-xs font-medium text-success mb-2 flex items-center gap-1">
                <Star className="w-3 h-3" />
                Passende Eigenschaften:
              </div>
              <div className="flex flex-wrap gap-1">
                {matchingProperties.slice(0, 3).map((propId) => (
                  <div key={propId} className="badge badge-success badge-xs">
                    {getPropertyDisplayName(propId)}
                  </div>
                ))}
                {matchingProperties.length > 3 && (
                  <div className="badge badge-success badge-xs opacity-70">
                    +{matchingProperties.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ratings */}
          {pet.ratings && (
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < (pet.ratings?.overall || 0) 
                      ? 'text-warning fill-current' 
                      : 'text-base-300'
                  }`}
                />
              ))}
              <span className="text-xs text-base-content/60 ml-1">
                ({pet.ratings?.overall || 0}/5)
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

// Helper function für Property Display Names
function getPropertyDisplayName(propertyId: string): string {
  const displayNames: { [key: string]: string } = {
    'intelligent': 'Intelligent',
    'loyal': 'Loyal',
    'playful': 'Verspielt',
    'calm': 'Ruhig',
    'protective': 'Beschützend',
    'friendly': 'Freundlich',
    'grooming_easy': 'Pflegeleicht',
    'exercise_needs': 'Aktiv',
    'training_easy': 'Lernwillig',
    'health_robust': 'Robust',
    'good_with_kids': 'Kinderlieb',
    'good_with_pets': 'Verträglich',
    'apartment_suitable': 'Wohnung OK',
    'first_time_owner': 'Anfänger'
  }
  
  return displayNames[propertyId] || propertyId
}
