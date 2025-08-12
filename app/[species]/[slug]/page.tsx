// app/[species]/[slug]/page.tsx - Vollständig optimiert mit 2025 UX Standards

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Scale,
  Activity,
  Star,
  Info,
  Camera,
  Sparkles,
  Eye,
  Home,
  ChevronRight,
  Users,
  Clock
} from 'lucide-react'

// ✅ Enhanced Type Definitions
interface PetWithCategory {
  id: number
  name: string
  slug: string
  breed: string | null
  species: string
  category: {
    id: string
    name: string
    image: string | null
  }
  subcategory: string | null
  description: string
  origin: string | null
  size: string | null
  weight: string | null
  lifeExpectancy: string | null
  careLevel: string | null
  primaryImage: string | null
  gallery: string | null
  temperament: string | null
  summary: string | null
  character: string | null
  health: string | null
  grooming: string | null
  activity: string | null
  suitability: string | null
  ratings: string | null
  createdAt: Date
  updatedAt: Date
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

interface PageProps {
  params: Promise<{
    species: string
    slug: string
  }>
}

// ✅ Enhanced Helper Functions
function parseJsonField<T>(field: string | null): T | null {
  if (!field) return null
  try {
    return JSON.parse(field) as T
  } catch {
    return null
  }
}

const getImageSrc = (image: string | null): string => {
  if (!image) return '/images/placeholder-pet.jpg'
  return image.startsWith('/') ? image : `/${image}`
}

function calculateAverageRating(ratings: PetRatings): number {
  const values = Object.values(ratings).filter((val): val is number => typeof val === 'number')
  return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
}

// ✅ Enhanced Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const pet = await prisma.pet.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true }
  })

  if (!pet) {
    return {
      title: 'Tier nicht gefunden | tailr.wiki',
      description: 'Das gesuchte Tier konnte nicht gefunden werden.'
    }
  }

  return {
    title: `${pet.name} - Charakter, Haltung & Pflege | tailr.wiki`,
    description: `Alles über ${pet.name}: ${pet.description.slice(0, 150)}...`,
    keywords: `${pet.name}, ${pet.breed}, ${pet.category.name}, Haustier, Pflege, Charakter`,
    openGraph: {
      title: `${pet.name} - Vollständiger Ratgeber`,
      description: pet.description,
      type: 'article',
      images: [{
        url: getImageSrc(pet.primaryImage),
        width: 1200,
        height: 630,
        alt: `${pet.name} Foto`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pet.name} - Vollständiger Ratgeber`,
      description: pet.description,
      images: [getImageSrc(pet.primaryImage)]
    }
  }
}

// ✅ Modern Hero Section Component
function ModernHeroSection({ pet, ratings }: { 
  pet: PetWithCategory, 
  ratings: PetRatings | null 
}) {
  const averageRating = ratings ? calculateAverageRating(ratings) : null
  const gallery = parseJsonField<string[]>(pet.gallery) || []
  
  return (
    <section className="hero min-h-[85vh] bg-gradient-to-br from-base-100 via-base-200 to-base-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
      </div>
      
      <div className="hero-content flex-col xl:flex-row-reverse max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Enhanced Image Section - 60% Width on Desktop */}
        <div className="flex-[0.6] w-full max-w-2xl">
          <div className="relative">
            {/* Main Pet Image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mb-6">
              <Image
                src={getImageSrc(pet.primaryImage)}
                alt={`${pet.name} - ${pet.breed || pet.category.name}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
                sizes="(max-width: 1280px) 100vw, 60vw"
              />
              
              {/* Floating Rating Badge */}
              {averageRating && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(averageRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Image Counter */}
              {gallery.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2 text-white">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">+{gallery.length}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Gallery Thumbnails - Touch Optimized */}
            {gallery.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                {gallery.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden snap-center cursor-pointer transition-transform hover:scale-105"
                  >
                    <Image
                      src={getImageSrc(image)}
                      alt={`${pet.name} Galerie ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
                {gallery.length > 4 && (
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-base-300 flex items-center justify-center snap-center cursor-pointer hover:bg-base-200 transition-colors">
                    <span className="text-xs font-semibold text-base-content/60">
                      +{gallery.length - 4}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Info Section - 40% Width */}
        <div className="flex-[0.4] text-center xl:text-left xl:pr-8 space-y-8">
          {/* Category Badge */}
          <div className="flex justify-center xl:justify-start">
            <div className="badge badge-primary badge-lg px-4 py-3 text-base font-semibold">
              {pet.category.name}
            </div>
          </div>
          
          {/* Pet Name - Bold Typography 2025 */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {pet.name}
              </span>
            </h1>
            
            {pet.breed && pet.breed !== pet.name && (
              <p className="text-xl sm:text-2xl text-base-content/80 font-medium">
                {pet.breed}
              </p>
            )}
          </div>

          {/* Key Facts Grid - Asymmetric Layout */}
          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto xl:mx-0">
            {pet.size && (
              <div className="text-center xl:text-left">
                <Scale className="w-6 h-6 text-primary mx-auto xl:mx-0 mb-2" />
                <div className="text-sm text-base-content/60 uppercase tracking-wide">Größe</div>
                <div className="font-semibold">{pet.size}</div>
              </div>
            )}
            {pet.careLevel && (
              <div className="text-center xl:text-left">
                <Heart className="w-6 h-6 text-secondary mx-auto xl:mx-0 mb-2" />
                <div className="text-sm text-base-content/60 uppercase tracking-wide">Pflege</div>
                <div className="font-semibold">{pet.careLevel}</div>
              </div>
            )}
            {pet.lifeExpectancy && (
              <div className="text-center xl:text-left">
                <Calendar className="w-6 h-6 text-accent mx-auto xl:mx-0 mb-2" />
                <div className="text-sm text-base-content/60 uppercase tracking-wide">Lebensdauer</div>
                <div className="font-semibold">{pet.lifeExpectancy}</div>
              </div>
            )}
            {pet.origin && (
              <div className="text-center xl:text-left">
                <MapPin className="w-6 h-6 text-info mx-auto xl:mx-0 mb-2" />
                <div className="text-sm text-base-content/60 uppercase tracking-wide">Herkunft</div>
                <div className="font-semibold">{pet.origin}</div>
              </div>
            )}
          </div>

          {/* CTA Buttons - Touch Optimized */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start pt-4">
            <button className="btn btn-primary btn-lg px-8 py-4 text-base font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Sparkles className="w-5 h-5 mr-2" />
              Pflegetipps anzeigen
            </button>
            <button className="btn btn-outline btn-lg px-8 py-4 text-base font-semibold rounded-2xl hover:shadow-lg transition-all duration-300">
              <Info className="w-5 h-5 mr-2" />
              Vollständiger Ratgeber
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ✅ Interactive Temperament Section
function InteractiveTemperamentSection({ pet }: { pet: PetWithCategory }) {
  const temperament = parseJsonField<string[]>(pet.temperament) || []
  
  if (temperament.length === 0) return null

  // Temperament-zu-Icon Mapping
  const temperamentIcons: Record<string, React.ReactNode> = {
    'Intelligent': <Activity className="w-5 h-5" />,
    'Loyal': <Heart className="w-5 h-5" />,
    'Active': <Activity className="w-5 h-5" />,
    'Calm': <Info className="w-5 h-5" />,
    'Friendly': <Heart className="w-5 h-5" />,
    'Independent': <Info className="w-5 h-5" />,
    'Playful': <Sparkles className="w-5 h-5" />,
    'Alert': <Eye className="w-5 h-5" />,
    'Gentle': <Heart className="w-5 h-5" />,
  }

  return (
    <section className="section-padding bg-gradient-to-r from-base-100 to-base-200">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Charakter & <span className="text-gradient">Temperament</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Entdecke die einzigartigen Persönlichkeitsmerkmale von {pet.name}
          </p>
        </div>

        {/* Interactive Temperament Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {temperament.map((trait, index) => (
            <div
              key={trait}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-base-300 hover:border-primary/30"
              style={{ 
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="card-body items-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  {temperamentIcons[trait] || <Sparkles className="w-5 h-5" />}
                </div>
                <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                  {trait}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ✅ Enhanced Ratings Section
function EnhancedRatingsSection({ pet }: { pet: PetWithCategory }) {
  const ratings = parseJsonField<PetRatings>(pet.ratings)
  
  if (!ratings || Object.keys(ratings).length === 0) return null

  const ratingCategories = [
    { key: 'intelligence', label: 'Intelligenz', icon: <Activity className="w-5 h-5" />, color: 'text-blue-500' },
    { key: 'friendliness', label: 'Freundlichkeit', icon: <Heart className="w-5 h-5" />, color: 'text-pink-500' },
    { key: 'energy', label: 'Energie-Level', icon: <Activity className="w-5 h-5" />, color: 'text-green-500' },
    { key: 'grooming', label: 'Pflegeaufwand', icon: <Sparkles className="w-5 h-5" />, color: 'text-purple-500' },
    { key: 'training', label: 'Trainierbarkeit', icon: <Users className="w-5 h-5" />, color: 'text-orange-500' },
    { key: 'health', label: 'Gesundheit', icon: <Heart className="w-5 h-5" />, color: 'text-red-500' },
  ]

  return (
    <section className="section-padding bg-base-100">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Bewertung & <span className="text-gradient">Eigenschaften</span>
          </h2>
          <p className="text-lg text-base-content/70">
            Basierend auf Expertenmeinungen und Erfahrungsberichten
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {ratingCategories.map(({ key, label, icon, color }) => {
            const rating = ratings[key as keyof PetRatings] || 0
            const percentage = (rating / 5) * 100

            if (rating === 0) return null

            return (
              <div
                key={key}
                className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="card-body p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`${color}`}>{icon}</div>
                      <h3 className="font-semibold text-lg">{label}</h3>
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {rating.toFixed(1)}
                    </div>
                  </div>

                  {/* Interactive Progress Bar */}
                  <div className="space-y-3">
                    <div className="w-full bg-base-300 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 transition-colors duration-300 ${
                              i < Math.round(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-base-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-base-content/60">
                        {rating === 5 ? 'Ausgezeichnet' : 
                         rating >= 4 ? 'Sehr gut' : 
                         rating >= 3 ? 'Gut' : 
                         rating >= 2 ? 'Durchschnittlich' : 'Niedrig'}
                      </span>
                    </div>
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

// ✅ Related Pets Component
async function RelatedPets({ currentPetId, species }: { currentPetId: number, species: string }) {
  const relatedPets = await prisma.pet.findMany({
    where: {
      species: species,
      id: { not: currentPetId }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      species: true,
      primaryImage: true,
      size: true,
      careLevel: true,
      category: {
        select: {
          name: true
        }
      }
    },
    take: 4
  })

  if (relatedPets.length === 0) return null

  return (
    <section className="section-padding bg-base-200">
      <div className="container-wide">
        <h2 className="text-3xl font-bold text-center mb-12">
          Ähnliche <span className="text-gradient">Rassen</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedPets.map((pet) => (
            <Link
              key={pet.id}
              href={`/${pet.species}/${pet.slug}`}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <figure className="relative aspect-square overflow-hidden">
                <Image
                  src={getImageSrc(pet.primaryImage)}
                  alt={pet.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-lg">{pet.name}</h3>
                <div className="flex justify-between text-sm text-base-content/60">
                  {pet.size && (
                    <span className="badge badge-outline badge-sm">{pet.size}</span>
                  )}
                  {pet.careLevel && (
                    <span className="badge badge-outline badge-sm">{pet.careLevel}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ✅ Content Section Component
function ContentSection({ title, content, icon }: { 
  title: string, 
  content: string, 
  icon: React.ReactNode 
}) {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300">
      <div className="card-body p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="prose max-w-none text-base-content/80 leading-relaxed">
          {content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ✅ Main Page Component
export default async function PetDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const pet = await prisma.pet.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      category: true
    }
  })

  if (!pet || pet.species !== resolvedParams.species) {
    notFound()
  }

  const temperament = parseJsonField<string[]>(pet.temperament)
  const ratings = parseJsonField<PetRatings>(pet.ratings)

  return (
    <main className="min-h-screen">
      {/* Enhanced Breadcrumb Navigation */}
      <nav className="bg-base-100 border-b border-base-300 sticky top-16 z-40 backdrop-blur-sm">
        <div className="container-wide py-4">
          <div className="breadcrumbs text-sm">
            <ul className="flex items-center gap-2">
              <li>
                <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-base-content/50" />
              <li>
                <Link 
                  href={`/${pet.species}`}
                  className="hover:text-primary transition-colors"
                >
                  {pet.category.name}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-base-content/50" />
              <li className="text-base-content/60">{pet.name}</li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="container-wide py-4">
        <Link
          href={`/${pet.species}`}
          className="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zu {pet.category.name}
        </Link>
      </div>

      {/* Modern Hero Section */}
      <ModernHeroSection pet={pet} ratings={ratings} />

      {/* Interactive Temperament Section */}
      <InteractiveTemperamentSection pet={pet} />

      {/* Content Sections Grid */}
      <section className="section-padding bg-base-100">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-8">
            {pet.character && (
              <ContentSection
                title="Charakter"
                content={pet.character}
                icon={<Heart className="w-5 h-5 text-primary" />}
              />
            )}

            {pet.health && (
              <ContentSection
                title="Gesundheit"
                content={pet.health}
                icon={<Activity className="w-5 h-5 text-secondary" />}
              />
            )}

            {pet.grooming && (
              <ContentSection
                title="Pflege"
                content={pet.grooming}
                icon={<Sparkles className="w-5 h-5 text-accent" />}
              />
            )}

            {pet.activity && (
              <ContentSection
                title="Aktivität"
                content={pet.activity}
                icon={<Clock className="w-5 h-5 text-info" />}
              />
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Ratings Section */}
      <EnhancedRatingsSection pet={pet} />

      {/* Related Pets */}
      <Suspense fallback={
        <div className="section-padding bg-base-200">
          <div className="container-wide">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card bg-base-100 shadow-lg">
                  <div className="aspect-square bg-base-300 animate-pulse"></div>
                  <div className="card-body p-4 space-y-2">
                    <div className="h-6 bg-base-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-base-300 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }>
        <RelatedPets currentPetId={pet.id} species={pet.species} />
      </Suspense>

      {/* Enhanced Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${pet.name} - Charakter, Haltung & Pflege`,
            "description": pet.description,
            "image": getImageSrc(pet.primaryImage),
            "author": {
              "@type": "Organization",
              "name": "TAILR.WIKI"
            },
            "publisher": {
              "@type": "Organization",
              "name": "TAILR.WIKI",
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png"
              }
            },
            "datePublished": pet.createdAt.toISOString(),
            "dateModified": pet.updatedAt.toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://tailr.wiki/${pet.species}/${pet.slug}`
            }
          })
        }}
      />
    </main>
  )
}
