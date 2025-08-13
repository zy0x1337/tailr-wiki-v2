// components/ui/ScientificContentCards.tsx - ✅ CLIENT COMPONENT

"use client"

import { useState } from 'react'
import { Heart, Shield, Sparkles, TrendingUp, Star } from 'lucide-react'

interface PetWithCategory {
  id: number
  name: string
  character: string | null
  health: string | null
  grooming: string | null
  activity: string | null
  ratings: string | null
}

interface PetRatings {
  intelligence?: number
  friendliness?: number
  energy?: number
  grooming?: number
  training?: number
  health?: number
  [key: string]: number | undefined
}

interface ScientificContentCardsProps {
  pet: PetWithCategory
}

function parseJsonField<T>(field: string | null): T | null {
  if (!field) return null
  try {
    return JSON.parse(field) as T
  } catch {
    return null
  }
}

// ✅ SCIENTIFIC CONTENT SECTION
function ScientificContentSection({ title, content, icon, colorScheme }: { 
  title: string, 
  content: string, 
  icon: React.ReactNode
  colorScheme: 'trust' | 'expertise' | 'nature' | 'data'
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const previewLength = 200

  const colorClasses = {
    trust: 'feature-card--trust',
    expertise: 'feature-card--expertise', 
    nature: 'feature-card--nature',
    data: 'feature-card--trust'
  }

  const shouldShowToggle = content.length > previewLength
  const displayContent = isExpanded ? content : content.slice(0, previewLength) + (shouldShowToggle ? '...' : '')

  return (
    <div className={`${colorClasses[colorScheme]} p-8 animate-trust-entrance`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-scientific--heading text-2xl">{title}</h2>
      </div>
      <div className="text-scientific leading-relaxed space-y-4">
        {displayContent.split('\n').map((paragraph, index) => (
          <p key={index}>
            {paragraph}
          </p>
        ))}
        {shouldShowToggle && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-sm btn-primary mt-4 hover:scale-105 transition-transform"
          >
            {isExpanded ? 'Weniger anzeigen' : 'Mehr lesen'}
          </button>
        )}
      </div>
    </div>
  )
}

// ✅ SCIENTIFIC RATINGS SECTION
function ScientificRatingsSection({ pet }: { pet: PetWithCategory }) {
  const ratings = parseJsonField<PetRatings>(pet.ratings)
  
  if (!ratings || Object.keys(ratings).length === 0) return null

  const ratingCategories = [
    { key: 'intelligence', label: 'Intelligenz', icon: <TrendingUp className="w-6 h-6" />, color: 'trust-tech', gradient: 'from-trust-tech-500 to-trust-tech-600' },
    { key: 'friendliness', label: 'Freundlichkeit', icon: <Heart className="w-6 h-6" />, color: 'trust-value', gradient: 'from-trust-value-500 to-trust-value-600' },
    { key: 'energy', label: 'Energie-Level', icon: <TrendingUp className="w-6 h-6" />, color: 'data-secondary', gradient: 'from-data-secondary-500 to-data-secondary-600' },
    { key: 'grooming', label: 'Pflegeaufwand', icon: <Sparkles className="w-6 h-6" />, color: 'trust-security', gradient: 'from-trust-security-500 to-trust-security-600' },
    { key: 'training', label: 'Trainierbarkeit', icon: <TrendingUp className="w-6 h-6" />, color: 'excellence-comprehensive', gradient: 'from-excellence-comprehensive-500 to-excellence-comprehensive-600' },
    { key: 'health', label: 'Gesundheit', icon: <Shield className="w-6 h-6" />, color: 'excellence-reliable', gradient: 'from-excellence-reliable-500 to-excellence-reliable-600' },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="container-scientific">
        <div className="text-center mb-16 animate-trust-entrance">
          <h2 className="text-scientific--heading text-4xl sm:text-5xl mb-6">
            Wissenschaftliche <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text">Bewertung</span>
          </h2>
          <p className="text-scientific text-xl">
            Evidenzbasierte Analyse durch Veterinärexperten
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {ratingCategories.map(({ key, label, icon, color, gradient }, index) => {
            const rating = ratings[key as keyof PetRatings] || 0
            const percentage = (rating / 5) * 100

            if (rating === 0) return null

            return (
              <div
                key={key}
                className="trust-indicator-enhanced p-8 animate-trust-entrance"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${color}-100 dark:bg-${color}-900/20 flex items-center justify-center`}>
                      <div className={`text-${color}-600 dark:text-${color}-400`}>
                        {icon}
                      </div>
                    </div>
                    <h3 className="text-scientific--heading text-xl">{label}</h3>
                  </div>
                  <div className="authority-badge authority-badge--research">
                    {rating.toFixed(1)}
                  </div>
                </div>

                {/* ✅ SCIENTIFIC PROGRESS BAR */}
                <div className="space-y-4">
                  <div className="w-full bg-base-300 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1500 ease-out credibility-shine`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 transition-all duration-300 ${
                            i < Math.round(rating)
                              ? `fill-${color}-400 text-${color}-400`
                              : 'text-base-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-scientific--muted text-sm">
                      {rating === 5 ? 'Hervorragend' : 
                       rating >= 4 ? 'Sehr gut' : 
                       rating >= 3 ? 'Gut' : 
                       rating >= 2 ? 'Durchschnittlich' : 'Entwicklungsbedarf'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ScientificContentCards({ pet }: ScientificContentCardsProps) {
  return (
    <>
      {/* ✅ SCIENTIFIC CONTENT GRID */}
      <section className="py-20 bg-gradient-to-br from-base-100 to-base-200">
        <div className="container-scientific">
          <div className="grid lg:grid-cols-2 gap-8">
            {pet.character && (
              <ScientificContentSection
                title="Verhaltensanalyse"
                content={pet.character}
                icon={<Heart className="w-6 h-6 text-trust-value-500" />}
                colorScheme="nature"
              />
            )}

            {pet.health && (
              <ScientificContentSection
                title="Gesundheitsmanagement"
                content={pet.health}
                icon={<Shield className="w-6 h-6 text-trust-tech-500" />}
                colorScheme="trust"
              />
            )}

            {pet.grooming && (
              <ScientificContentSection
                title="Pflegeprotokoll"
                content={pet.grooming}
                icon={<Sparkles className="w-6 h-6 text-trust-security-500" />}
                colorScheme="expertise"
              />
            )}

            {pet.activity && (
              <ScientificContentSection
                title="Aktivitätsplan"
                content={pet.activity}
                icon={<TrendingUp className="w-6 h-6 text-data-secondary-500" />}
                colorScheme="data"
              />
            )}
          </div>
        </div>
      </section>

      {/* ✅ SCIENTIFIC RATINGS SECTION */}
      <ScientificRatingsSection pet={pet} />
    </>
  )
}
