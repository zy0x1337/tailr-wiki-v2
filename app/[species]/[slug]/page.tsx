// app/[species]/[slug]/page.tsx - ✅ SERVER COMPONENT (ohne "use client")

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
  Clock,
  Award,
  Shield,
  TrendingUp,
  BookOpen
} from 'lucide-react'
import CategoryImage from '@/components/ui/CategoryImage'
import { InteractiveImageGallery } from '@/components/ui/InteractiveImageGallery'
import { ScientificContentCards } from '@/components/ui/ScientificContentCards'

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

// ✅ Helper Functions (Server-side)
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

// ✅ SCIENTIFIC METADATA GENERATION - Server Component
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const pet = await prisma.pet.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true }
  })

  if (!pet) {
    return {
      title: 'Tier nicht gefunden | TAILR.WIKI',
      description: 'Das gesuchte Tier konnte nicht gefunden werden.'
    }
  }

  return {
    title: `${pet.name} - Wissenschaftlich fundierter Ratgeber | TAILR.WIKI`,
    description: `Expertenwissen über ${pet.name}: ${pet.description.slice(0, 150)}...`,
    keywords: `${pet.name}, ${pet.breed}, ${pet.category.name}, wissenschaftlicher Ratgeber, Tierpflege`,
    openGraph: {
      title: `${pet.name} - Wissenschaftlich fundierter Ratgeber`,
      description: pet.description,
      type: 'article',
      images: [{
        url: getImageSrc(pet.primaryImage),
        width: 1200,
        height: 630,
        alt: `${pet.name} - Wissenschaftlich dokumentiert`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pet.name} - Wissenschaftlich fundierter Ratgeber`,
      description: pet.description,
      images: [getImageSrc(pet.primaryImage)]
    }
  }
}

// ✅ SCIENTIFIC HERO SECTION - Server Component
// ✅ KOMPAKTE SCIENTIFIC HERO SECTION - Theme-synchronized + 5:7 Grid Balance

function ScientificHeroSection({ pet, ratings }: { 
  pet: PetWithCategory, 
  ratings: PetRatings | null 
}) {
  const averageRating = ratings ? calculateAverageRating(ratings) : null
  const gallery = parseJsonField<string[]>(pet.gallery) || []
  
  return (
    <section className="relative min-h-screen bg-base-100 overflow-hidden">
      {/* ✅ THEME-AWARE SCIENTIFIC BACKGROUND PATTERN */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(96,165,250,0.05),transparent_70%)]" />
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-32 w-52 h-52 bg-gradient-to-br from-secondary/8 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container-scientific relative z-10 pt-20 pb-16">
        
        {/* ✅ THEME-AWARE SCIENTIFIC BREADCRUMB */}
        <nav className="flex items-center gap-2 text-sm mb-8 animate-trust-entrance">
          <Link href="/" className="text-base-content/60 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-4 h-4 text-base-content/40" />
          <Link 
            href={`/${pet.species}`}
            className="text-base-content/60 hover:text-primary transition-colors"
          >
            {pet.category.name}
          </Link>
          <ChevronRight className="w-4 h-4 text-base-content/40" />
          <span className="text-base-content font-medium">{pet.name}</span>
        </nav>

        {/* ✅ KOMPAKTE GRID LAYOUT - 5:7 Verhältnis für bessere Info-Balance */}
        <div className="grid xl:grid-cols-12 gap-12 items-start">
          
          {/* ✅ KOMPAKTE IMAGE GALLERY - 5 Spalten (reduziert von 7) */}
          <div className="xl:col-span-5">
            <div className="sticky top-24">
              <div className="bg-base-200/50 dark:bg-base-200/20 backdrop-blur-xl border border-base-300/50 dark:border-base-300/20 rounded-3xl p-6 animate-trust-entrance shadow-lg dark:shadow-primary/5">
                
                {/* ✅ THEME-AWARE SCIENTIFIC CATEGORY BADGE - Kompakter */}
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-success to-success/90 text-white dark:text-slate-900 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg dark:shadow-success/25">
                    <CategoryImage 
                      src={pet.category.image}
                      alt={pet.category.name}
                      className="w-4 h-4"
                    />
                    <span>Wissenschaftlich verifiziert</span>
                  </div>
                  {averageRating && (
                    <div className="flex items-center gap-1 text-warning bg-warning/10 dark:bg-warning/20 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* ✅ CLIENT COMPONENT für Interaktivität - Kompaktere Container */}
                <InteractiveImageGallery 
                  pet={pet} 
                  gallery={gallery} 
                  averageRating={averageRating}
                />
              </div>
            </div>
          </div>

          {/* ✅ ERWEITERTE SCIENTIFIC INFO PANEL - 7 Spalten (erweitert von 5) */}
          <div className="xl:col-span-7">
            
            <div className="space-y-6">
              
              {/* ✅ THEME-AWARE HEADER MIT TRUST INDICATOR */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-base-content tracking-tight">
                  {pet.name}
                </h1>
                
                {pet.breed && pet.breed !== pet.name && (
                  <p className="text-xl text-base-content/70 font-medium">
                    {pet.breed}
                  </p>
                )}

                {/* ✅ THEME-SYNCHRONIZED TRUST INDICATOR mit Credibility Shine */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border border-primary/20 dark:border-primary/30 rounded-lg p-6">
                  <p className="text-base-content/80 text-lg leading-relaxed">
                    {pet.description}
                  </p>
                </div>
              </div>

              {/* ✅ KOMPAKTE SCIENTIFIC QUICK FACTS - 2x2 Grid mit daisyUI Colors */}
              <div className="grid grid-cols-2 gap-4">
                {pet.size && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border border-primary/20 dark:border-primary/30 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-primary/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <Scale className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-sm text-base-content/60">Größe</div>
                        <div className="font-semibold text-base-content">{pet.size}</div>
                      </div>
                    </div>
                  </div>
                )}

                {pet.careLevel && (
                  <div className="bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/5 border border-accent/20 dark:border-accent/30 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-accent/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-accent" />
                      <div>
                        <div className="text-sm text-base-content/60">Pflege</div>
                        <div className="font-semibold text-base-content">{pet.careLevel}</div>
                      </div>
                    </div>
                  </div>
                )}

                {pet.lifeExpectancy && (
                  <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 dark:from-secondary/10 dark:to-secondary/5 border border-secondary/20 dark:border-secondary/30 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-secondary/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-secondary" />
                      <div>
                        <div className="text-sm text-base-content/60">Lebensdauer</div>
                        <div className="font-semibold text-base-content">{pet.lifeExpectancy}</div>
                      </div>
                    </div>
                  </div>
                )}

                {pet.origin && (
                  <div className="bg-gradient-to-br from-info/5 to-info/10 dark:from-info/10 dark:to-info/5 border border-info/20 dark:border-info/30 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-info/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-info" />
                      <div>
                        <div className="text-sm text-base-content/60">Herkunft</div>
                        <div className="font-semibold text-base-content">{pet.origin}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ KOMPAKTE SCIENTIFIC CTA BUTTONS - Horizontal Layout mit daisyUI */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn btn-primary flex-1 flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                  Wissenschaftlicher Pflegeplan
                </button>
                <button className="btn btn-secondary flex-1 flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                  Gesundheits-Monitoring
                </button>
              </div>

              {/* ✅ ADDITIONAL QUICK ACCESS mit daisyUI Theme Colors */}
              <div className="grid grid-cols-3 gap-3">
                <button className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border border-primary/20 dark:border-primary/30 rounded-lg p-3 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/10">
                  <Camera className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium text-base-content">Galerie</div>
                </button>
                <button className="bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/5 border border-accent/20 dark:border-accent/30 rounded-lg p-3 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg dark:hover:shadow-accent/10">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <div className="text-sm font-medium text-base-content">Favorit</div>
                </button>
                <button className="bg-gradient-to-br from-secondary/5 to-secondary/10 dark:from-secondary/10 dark:to-secondary/5 border border-secondary/20 dark:border-secondary/30 rounded-lg p-3 text-center hover:scale-105 transition-all duration-300 hover:shadow-lg dark:hover:shadow-secondary/10">
                  <Share2 className="w-6 h-6 mx-auto mb-2 text-secondary" />
                  <div className="text-sm font-medium text-base-content">Teilen</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ✅ SCIENTIFIC TEMPERAMENT SECTION - Server Component
function ScientificTemperamentSection({ pet }: { pet: PetWithCategory }) {
  const temperament = parseJsonField<string[]>(pet.temperament) || []
  
  if (temperament.length === 0) return null

  const temperamentConfig = {
    'Intelligent': { icon: <Activity className="w-5 h-5" />, color: 'trust-tech' },
    'Loyal': { icon: <Heart className="w-5 h-5" />, color: 'trust-value' },
    'Active': { icon: <TrendingUp className="w-5 h-5" />, color: 'data-secondary' },
    'Calm': { icon: <Shield className="w-5 h-5" />, color: 'trust-security' },
    'Friendly': { icon: <Users className="w-5 h-5" />, color: 'excellence-comprehensive' },
    'Independent': { icon: <Star className="w-5 h-5" />, color: 'data-tertiary' },
    'Playful': { icon: <Sparkles className="w-5 h-5" />, color: 'excellence-research' },
    'Alert': { icon: <Eye className="w-5 h-5" />, color: 'data-primary' },
    'Gentle': { icon: <Heart className="w-5 h-5" />, color: 'excellence-reliable' },
  }

  return (
    <section className="py-20 bg-gradient-to-br from-base-100 via-base-100 to-base-200">
      <div className="container-scientific">
        <div className="text-center mb-16 animate-trust-entrance">
          <h2 className="text-scientific--heading text-4xl sm:text-5xl mb-6">
            Wissenschaftlich analysiertes <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text ">Temperament</span>
          </h2>
          <p className="text-scientific text-xl max-w-3xl mx-auto">
            Basierend auf verhaltensbiologischen Studien und Expertenbewertungen
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {temperament.map((trait, index) => {
            const config = temperamentConfig[trait as keyof typeof temperamentConfig] || 
                          { icon: <Sparkles className="w-5 h-5" />, color: 'primary' }
            
            return (
              <div
                key={trait}
                className="category-card-scientific group p-6 text-center animate-trust-entrance"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-${config.color}-100 dark:bg-${config.color}-900/20 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`text-${config.color}-600 dark:text-${config.color}-400`}>
                    {config.icon}
                  </div>
                </div>
                <h3 className="text-scientific--heading text-lg mb-2 group-hover:text-primary transition-colors">
                  {trait}
                </h3>
                <div className="credibility-shine w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ✅ SCIENTIFIC RELATED PETS - Server Component
async function ScientificRelatedPets({ currentPetId, species }: { currentPetId: number, species: string }) {
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
          name: true,
          image: true
        }
      }
    },
    take: 6
  })

  if (relatedPets.length === 0) return null

  return (
    <section className="py-20 bg-gradient-to-br from-base-100 to-base-200">
      <div className="container-scientific">
        <div className="text-center mb-16 animate-trust-entrance">
          <h2 className="text-scientific--heading text-4xl sm:text-5xl mb-6">
            Verwandte <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text ">Arten</span>
          </h2>
          <p className="text-scientific text-xl">
            Wissenschaftlich kuratierte Empfehlungen
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPets.map((pet, index) => (
            <Link
              key={pet.id}
              href={`/${pet.species}/${pet.slug}`}
              className="category-card-scientific group p-6 animate-trust-entrance"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  src={getImageSrc(pet.primaryImage)}
                  alt={pet.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <div className="text-center">
                <h3 className="text-scientific--heading text-xl mb-3 group-hover:text-primary transition-colors">
                  {pet.name}
                </h3>
                <div className="flex justify-center gap-2 mb-4">
                  {pet.size && (
                    <div className="authority-badge authority-badge--trusted text-xs">
                      {pet.size}
                    </div>
                  )}
                  {pet.careLevel && (
                    <div className="authority-badge authority-badge--verified text-xs">
                      {pet.careLevel}
                    </div>
                  )}
                </div>
                <div className="credibility-shine w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ✅ MAIN PAGE COMPONENT - SERVER COMPONENT
export default async function PetDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  
  // ✅ OPTIMIZED DATABASE QUERY - Server-side
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
      
      {/* ✅ SCIENTIFIC HERO SECTION */}
      <ScientificHeroSection pet={pet} ratings={ratings} />

      {/* ✅ SCIENTIFIC TEMPERAMENT SECTION */}
      <ScientificTemperamentSection pet={pet} />

      {/* ✅ SCIENTIFIC CONTENT GRID - Client Component */}
      <ScientificContentCards pet={pet} />

      {/* ✅ SCIENTIFIC RELATED PETS */}
      <Suspense fallback={
        <div className="py-20 bg-gradient-to-br from-base-100 to-base-200">
          <div className="container-scientific">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="trust-indicator-enhanced p-6">
                  <div className="aspect-square bg-base-300 rounded-2xl animate-pulse mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-6 bg-base-300 rounded animate-pulse"></div>
                    <div className="h-4 bg-base-300 rounded animate-pulse w-2/3 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }>
        <ScientificRelatedPets currentPetId={pet.id} species={pet.species} />
      </Suspense>

      {/* ✅ ENHANCED SCIENTIFIC SCHEMA.ORG */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": `${pet.name} - Wissenschaftlich fundierter Ratgeber`,
            "description": pet.description,
            "image": getImageSrc(pet.primaryImage),
            "author": {
              "@type": "Organization",
              "name": "TAILR.WIKI",
              "description": "Wissenschaftlich fundierte Haustier-Ratgeber"
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
            },
            "about": {
              "@type": "Animal",
              "name": pet.name,
              "description": pet.description
            }
          })
        }}
      />
    </main>
  )
}
