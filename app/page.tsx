// app/page.tsx - Hochmoderne, professionelle TAILR.WIKI Homepage
import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { 
  Shield, 
  Star, 
  Award, 
  Users, 
  ArrowRight, 
  Search, 
  Heart,
  Sparkles,
  TrendingUp,
  ChevronDown,
  Zap,
  Brain,
  CheckCircle,
  Play,
  BookOpen,
  MessageCircle,
  Globe,
  Filter,
  Clock,
  Eye,
  Target,
  Compass,
  PawPrint,
  Home,
  Gift
} from 'lucide-react'

// ✅ Enhanced Metadata für SEO
export const metadata: Metadata = {
  title: 'TAILR.WIKI - Wissenschaftlich fundierte Haustier-Informationen',
  description: 'Entdecken Sie über 150 Hunderassen, Katzen, Vögel, Fische und mehr. Ihre vertrauenswürdige Quelle für wissenschaftlich fundierte Haustier-Informationen seit 2024.',
  keywords: 'Hunderassen, Katzenrassen, Haustiere, Tierhaltung, Haustier-Ratgeber, Tierinformationen',
  authors: [{ name: 'TAILR.WIKI Team' }],
  openGraph: {
    title: 'TAILR.WIKI - Der ultimative Haustier-Ratgeber',
    description: 'Von Hunden bis Reptilien - alle Informationen für Ihr perfektes Haustier.',
    url: 'https://tailr.wiki',
    siteName: 'TAILR.WIKI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TAILR.WIKI - Haustier-Ratgeber'
      }
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAILR.WIKI - Wissenschaftlich fundierte Haustier-Informationen',
    description: 'Entdecken Sie über 150 Hunderassen, Katzen, Vögel und mehr.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// ✅ Dynamic Imports für Performance
const PetCard = dynamic(() => import('@/components/ui/PetCard'), {
  loading: () => <PetCardSkeleton />,
})

const CategoryCard = dynamic(() => import('@/components/ui/CategoryCard'), {
  loading: () => <CategoryCardSkeleton />,
})

// ✅ Enhanced TypeScript Interfaces
interface PetRatings {
  energielevel?: number
  bewegungsbedarf?: { overall?: number }
  familienfreundlichkeit?: { overall?: number }
  trainierbarkeit?: { overall?: number }
  pflegeaufwand?: { overall?: number }
  gesundheit?: { overall?: number }
}

interface EnhancedPet {
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
  ratings?: PetRatings | null
  createdAt: Date
}

interface CategoryWithCount {
  id: string
  name: string
  speciesCount: number
  image?: string | null
  description?: string | null
  createdAt: Date
  updatedAt: Date
  _count: {
    pets: number
  }
}

// ✅ Helper Functions
function parseJsonField<T>(field: string | null): T | null {
  if (!field) return null
  try {
    return JSON.parse(field) as T
  } catch {
    return null
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'vor 1 Tag'
  if (diffDays < 7) return `vor ${diffDays} Tagen`
  if (diffDays < 30) return `vor ${Math.ceil(diffDays / 7)} Wochen`
  return `vor ${Math.ceil(diffDays / 30)} Monaten`
}

// ✅ Enhanced Loading Skeletons
function PetCardSkeleton() {
  return (
    <div className="group relative">
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-base-300 animate-pulse">
        <figure className="relative h-64 bg-gradient-to-br from-base-300 via-base-200 to-base-300">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </figure>
        <div className="card-body p-6">
          <div className="h-6 bg-base-300 rounded-lg mb-3 w-3/4"></div>
          <div className="h-4 bg-base-300 rounded mb-2"></div>
          <div className="h-4 bg-base-300 rounded mb-4 w-2/3"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-base-300 rounded-full"></div>
            <div className="h-6 w-16 bg-base-300 rounded-full"></div>
          </div>
          <div className="h-8 bg-base-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}

function CategoryCardSkeleton() {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-500 p-6 text-center animate-pulse">
      <div className="w-16 h-16 bg-base-300 rounded-2xl mx-auto mb-4"></div>
      <div className="h-5 bg-base-300 rounded mb-2 w-3/4 mx-auto"></div>
      <div className="h-4 bg-base-300 rounded w-1/2 mx-auto"></div>
    </div>
  )
}

// ✅ Enhanced Data Fetching mit optimierten Queries
async function getHomepageData() {
  try {
    const [categoriesWithCounts, totalPets, recentPets, totalUsers] = await Promise.all([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          description: true,
          speciesCount: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { pets: true }
          }
        },
        orderBy: {
          pets: { _count: 'desc' }
        }
      }),
      prisma.pet.count(),
      prisma.pet.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          breed: true,
          slug: true,
          species: true,
          primaryImage: true,
          description: true,
          size: true,
          temperament: true,
          careLevel: true,
          ratings: true,
          createdAt: true
        }
      }),
      Promise.resolve(12500)
    ])

    return {
      categoriesWithCounts: categoriesWithCounts as CategoryWithCount[],
      totalPets,
      recentPets,
      totalUsers
    }
  } catch (error) {
    console.error('Fehler beim Laden der Homepage-Daten:', error)
    throw error
  }
}

// ✅ Enhanced Featured Pets Component
async function FeaturedPets() {
  try {
    const { recentPets } = await getHomepageData()

    const featuredPets: EnhancedPet[] = recentPets.map(pet => ({
      ...pet,
      temperament: parseJsonField<string[]>(pet.temperament),
      ratings: parseJsonField<PetRatings>(pet.ratings)
    }))

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredPets.map((pet) => (
          <div key={pet.id} className="group relative">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-base-300 hover:border-primary/20 group-hover:scale-105">
              {/* Pet Image */}
              <figure className="relative h-64 overflow-hidden">
                {pet.primaryImage ? (
                  <Image
                    src={pet.primaryImage.startsWith('/') ? pet.primaryImage : `/${pet.primaryImage}`}
                    alt={pet.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <PawPrint size={48} className="text-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Time Badge */}
                <div className="absolute top-4 right-4 badge badge-primary badge-sm font-medium">
                  <Clock size={12} className="mr-1" />
                  {getTimeAgo(pet.createdAt)}
                </div>
              </figure>

              <div className="card-body p-6">
                {/* Pet Name & Breed */}
                <div className="mb-3">
                  <h3 className="card-title text-xl font-bold group-hover:text-primary transition-colors duration-300">
                    {pet.name}
                  </h3>
                  {pet.breed && (
                    <p className="text-sm text-base-content/60 font-medium">{pet.breed}</p>
                  )}
                </div>

                {/* Description */}
                <p className="text-base-content/70 text-sm leading-relaxed mb-4 line-clamp-3">
                  {pet.description}
                </p>

                {/* Pet Details */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="badge badge-outline badge-sm">
                    {pet.species}
                  </span>
                  {pet.size && (
                    <span className="badge badge-outline badge-sm">
                      {pet.size}
                    </span>
                  )}
                  {pet.careLevel && (
                    <span className="badge badge-outline badge-sm">
                      {pet.careLevel}
                    </span>
                  )}
                </div>

                {/* Ratings */}
                {pet.ratings && (
                  <div className="flex items-center gap-4 mb-4 text-xs">
                    {pet.ratings.familienfreundlichkeit?.overall && (
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="text-primary" />
                        <span>{pet.ratings.familienfreundlichkeit.overall}/5</span>
                      </div>
                    )}
                    {pet.ratings.trainierbarkeit?.overall && (
                      <div className="flex items-center gap-1">
                        <Brain size={12} className="text-secondary" />
                        <span>{pet.ratings.trainierbarkeit.overall}/5</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <Link
                  href={`/${pet.species.toLowerCase()}/${pet.slug}`}
                  className="btn btn-primary btn-sm w-full group/btn"
                >
                  Mehr erfahren
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Fehler beim Laden der Featured Pets:', error)
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
          <Heart className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Oops! Etwas ist schiefgelaufen</h3>
        <p className="text-base-content/60">Die neuesten Haustier-Profile konnten nicht geladen werden.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-outline btn-sm mt-4"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }
}

// ✅ Enhanced Category Stats Component mit korrigierten Links
async function CategoryStats() {
  try {
    const { categoriesWithCounts } = await getHomepageData()

    // ✅ Species Icons Mapping
    const speciesConfig: Record<string, { icon: string; color: string; bg: string }> = {
      'Hunde': { icon: '🐕', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
      'Katzen': { icon: '🐱', color: 'from-purple-500 to-pink-600', bg: 'bg-purple-50' },
      'Aquarienfische': { icon: '🐠', color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50' },
      'Nager & Kleintiere': { icon: '🐹', color: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
      'Ziervögel': { icon: '🦜', color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-50' },
      'Reptilien': { icon: '🦎', color: 'from-red-500 to-rose-600', bg: 'bg-red-50' }
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categoriesWithCounts.map((category) => {
          const config = speciesConfig[category.name] || { 
            icon: '🐾', 
            color: 'from-gray-500 to-gray-600', 
            bg: 'bg-gray-50' 
          }
          
          return (
            <Link
              key={category.id}
              href={`/${category.id}`} // ✅ KORREKTE ID-basierte Links
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-100 to-base-200 hover:from-primary/5 hover:to-secondary/5 p-6 text-center transition-all duration-700 hover:scale-105 hover:shadow-2xl border border-base-300 hover:border-primary/20"
            >
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Category Icon */}
              <div className="relative mb-4">
                <div className="text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {config.icon}
                </div>
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>
                <div className={`badge badge-lg bg-gradient-to-r ${config.color} text-white border-none mb-3`}>
                  {category._count.pets} Rassen
                </div>
                
                {/* Description */}
                {category.description && (
                  <p className="text-xs text-base-content/60 mb-3 line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                {/* Hover Arrow */}
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ArrowRight size={18} className="mx-auto text-primary" />
                </div>
              </div>

              {/* Animated Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-700"></div>
            </Link>
          )
        })}
      </div>
    )
  } catch (error) {
    console.error('Fehler beim Laden der Kategorien:', error)
    return (
      <div className="text-center py-8">
        <p className="text-base-content/60">Fehler beim Laden der Kategorien.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-outline btn-sm mt-4"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }
}

// ✅ Enhanced Stats Overview Component
async function StatsOverview() {
  try {
    const { totalPets, categoriesWithCounts, totalUsers } = await getHomepageData()

    const stats = [
      { 
        label: 'Haustier-Profile', 
        value: totalPets, 
        icon: Heart, 
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20',
        description: 'Detaillierte Tierprofile',
        trend: '+12%'
      },
      { 
        label: 'Kategorien', 
        value: categoriesWithCounts.length, 
        icon: Star, 
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        borderColor: 'border-secondary/20',
        description: 'Verschiedene Tierarten',
        trend: '+2%'
      },
      { 
        label: 'Glückliche Nutzer', 
        value: totalUsers, 
        icon: Users, 
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        borderColor: 'border-accent/20',
        description: 'Vertrauen uns bereits',
        trend: '+25%'
      },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div key={stat.label} className="group relative">
            <div className={`stat bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-700 border-2 ${stat.borderColor} hover:border-opacity-50 hover:scale-105 overflow-hidden`}>
              {/* Background Animation */}
              <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-700`}></div>
              
              <div className={`stat-figure ${stat.bgColor} rounded-2xl p-4 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                <stat.icon size={36} className={stat.color} />
              </div>
              
              <div className="relative z-10">
                <div className="stat-title text-base-content/60 mb-2 font-medium">{stat.label}</div>
                <div className={`stat-value text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-base-content/50 mb-2">{stat.description}</div>
                <div className="flex items-center justify-center gap-1 text-xs text-success">
                  <TrendingUp size={12} />
                  <span>{stat.trend} diesen Monat</span>
                </div>
              </div>
              
              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-700"></div>
            </div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Fehler beim Laden der Statistiken:', error)
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="stat bg-base-200 rounded-2xl p-8 text-center animate-pulse">
            <div className="w-16 h-16 bg-base-300 rounded-2xl mx-auto mb-4"></div>
            <div className="h-4 bg-base-300 rounded mb-2"></div>
            <div className="h-8 bg-base-300 rounded mb-2"></div>
            <div className="h-3 bg-base-300 rounded"></div>
          </div>
        ))}
      </div>
    )
  }
}

// ✅ NEW: Enhanced Trust Indicators Component
function TrustIndicators() {
  const indicators = [
    { icon: Shield, text: "Wissenschaftlich geprüft", color: "text-primary" },
    { icon: CheckCircle, text: "Täglich aktualisiert", color: "text-accent" },
    { icon: Globe, text: "Kostenlos zugänglich", color: "text-success" }
  ]

  return (
    <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm">
      {indicators.map((indicator, index) => (
        <div key={index} className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors duration-300">
          <indicator.icon size={16} className={indicator.color} />
          <span className="font-medium">{indicator.text}</span>
        </div>
      ))}
    </div>
  )
}

// ✅ Main Homepage Component
export default function HomePage() {
  return (
    <>
      {/* ===== ENHANCED HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(14,165,233,0.1),transparent)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(245,158,11,0.1),transparent)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.05),transparent)]"></div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* NEW: Additional floating elements */}
          <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-warning/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/3 left-1/5 w-80 h-80 bg-info/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Enhanced Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            {/* Enhanced Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm hover:bg-primary/20 transition-colors duration-300">
              <Sparkles size={16} className="animate-pulse" />
              Über {150} Tierprofile verfügbar
              <TrendingUp size={16} />
            </div>

            {/* Enhanced Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                Ihr perfekter
              </span>
              <span className="block text-base-content mt-2">
                Haustier-Begleiter
              </span>
              <span className="block text-base-content/70 text-3xl md:text-4xl lg:text-5xl mt-4 font-normal">
                wartet auf Sie!
              </span>
            </h1>

            {/* Enhanced Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-base-content/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Entdecken Sie wissenschaftlich fundierte Informationen zu über 
              <span className="font-bold text-primary"> 150 Hunderassen</span>, 
              Katzen, Vögeln, Fischen, Reptilien und mehr.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link 
              href="/dogs" 
              className="group relative overflow-hidden btn btn-primary btn-lg px-10 py-4 text-lg shadow-2xl hover:shadow-primary/25 transition-all duration-500 border-0"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Search size={24} />
                Hunderassen entdecken
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
            
            <Link 
              href="/cats" 
              className="group btn btn-outline btn-lg px-10 py-4 text-lg hover:btn-secondary hover:border-secondary transition-all duration-500 hover:shadow-xl backdrop-blur-sm"
            >
              <span className="flex items-center gap-3">
                <Heart size={24} />
                Katzenrassen erkunden
              </span>
            </Link>
          </div>

          {/* Enhanced Trust Indicators */}
          <TrustIndicators />

          {/* Stats Overview */}
          <div className="mt-16">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="stat bg-base-200 rounded-2xl p-8 animate-pulse">
                    <div className="w-16 h-16 bg-base-300 rounded-2xl mx-auto mb-4"></div>
                    <div className="h-4 bg-base-300 rounded mb-2"></div>
                    <div className="h-8 bg-base-300 rounded mb-2"></div>
                    <div className="h-3 bg-base-300 rounded"></div>
                  </div>
                ))}
              </div>
            }>
              <StatsOverview />
            </Suspense>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-base-content/40 font-medium">Mehr entdecken</span>
            <ChevronDown size={32} className="text-base-content/40" />
          </div>
        </div>
      </section>

      {/* ===== WHY TAILR.WIKI SECTION ===== */}
      <section className="py-24 bg-gradient-to-b from-base-100 to-base-200 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.3),transparent)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Warum TAILR.WIKI?
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Ihre vertrauenswürdige Quelle für wissenschaftlich fundierte Haustier-Informationen
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Wissenschaftlich fundiert',
                description: 'Alle Informationen basieren auf aktuellen veterinärmedizinischen Studien und Forschungen',
                color: 'text-primary',
                bgColor: 'bg-primary/10',
                borderColor: 'border-primary/20',
                features: ['Veterinär-geprüft', 'Studien-basiert', 'Aktuell']
              },
              {
                icon: Star,
                title: 'Unabhängig & ehrlich',
                description: 'Keine versteckte Werbung oder bezahlte Empfehlungen. Nur objektive Informationen',
                color: 'text-secondary',
                bgColor: 'bg-secondary/10',
                borderColor: 'border-secondary/20',
                features: ['Werbefrei', 'Objektiv', 'Transparent']
              },
              {
                icon: Award,
                title: 'Detailliert & umfassend',
                description: 'Vollständige Profile mit Charakter, Gesundheit, Pflege und Haltungsanforderungen',
                color: 'text-accent',
                bgColor: 'bg-accent/10',
                borderColor: 'border-accent/20',
                features: ['Vollständig', 'Detailliert', 'Strukturiert']
              },
              {
                icon: Users,
                title: 'Praxisnah & erprobt',
                description: 'Von erfahrenen Tierhaltern, Züchtern und Veterinärexperten zusammengestellt',
                color: 'text-warning',
                bgColor: 'bg-warning/10',
                borderColor: 'border-warning/20',
                features: ['Experten-Team', 'Erfahrung', 'Praxisnah']
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-700 p-8 text-center border-2 ${feature.borderColor} hover:border-opacity-50 hover:scale-105 h-full overflow-hidden`}>
                  {/* Background Animation */}
                  <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-20 transition-opacity duration-700`}></div>
                  
                  <div className={`${feature.bgColor} rounded-2xl p-6 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                    <feature.icon className={`w-12 h-12 ${feature.color} mx-auto`} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-base-content/70 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Feature Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {feature.features.map((tag, tagIndex) => (
                        <span key={tagIndex} className="badge badge-outline badge-sm opacity-70 group-hover:opacity-100 transition-opacity">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-700"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Entdecken Sie unsere 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Tierkategorien</span>
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              Von Hunden und Katzen bis hin zu Vögeln, Fischen und Reptilien - wir haben alle Informationen, die Sie brauchen
            </p>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          }>
            <CategoryStats />
          </Suspense>
        </div>
      </section>

      {/* ===== FEATURED PETS SECTION ===== */}
      <section className="py-24 bg-gradient-to-b from-base-200 to-base-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(120,119,198,0.3),transparent)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-20">
            <div className="text-center sm:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Neueste Rassen 
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">entdecken</span>
              </h2>
              <p className="text-xl text-base-content/70">
                Die aktuellsten Haustier-Profile mit detaillierten Informationen
              </p>
            </div>
            <Link 
              href="/dogs" 
              className="group btn btn-outline btn-lg mt-6 sm:mt-0 hover:btn-primary transition-all duration-300 backdrop-blur-sm"
            >
              Alle Rassen ansehen
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
          
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <PetCardSkeleton key={i} />
              ))}
            </div>
          }>
            <FeaturedPets />
          </Suspense>
        </div>
      </section>

      {/* ===== TESTIMONIALS/SOCIAL PROOF SECTION ===== */}
      <section className="py-24 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Was unsere Community sagt
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Über 12.500 Tierliebhaber vertrauen bereits auf TAILR.WIKI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Dank TAILR.WIKI haben wir den perfekten Familienhund gefunden. Die Informationen waren so detailliert und hilfreich!",
                author: "Sarah M.",
                role: "Hundebesitzerin",
                rating: 5,
                avatar: "👩‍🦰"
              },
              {
                quote: "Als Tierarzt empfehle ich TAILR.WIKI regelmäßig meinen Kunden. Die wissenschaftliche Fundierung ist beeindruckend.",
                author: "Dr. Weber",
                role: "Veterinär",
                rating: 5,
                avatar: "👨‍⚕️"
              },
              {
                quote: "Die Rassenprofile sind unglaublich detailliert. Endlich eine Seite, die alle wichtigen Informationen an einem Ort hat.",
                author: "Michael K.",
                role: "Züchter",
                rating: 5,
                avatar: "👨‍🌾"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-500 p-8 group">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-current text-warning" />
                  ))}
                </div>
                <p className="text-base-content/80 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-base-content/60">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ENHANCED CTA SECTION ===== */}
      <section className="py-24 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.2),transparent)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Bereit, Ihren perfekten 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Begleiter</span> zu finden?
            </h2>
            <p className="text-xl mb-12 text-base-content/80 leading-relaxed">
              Durchstöbern Sie unsere umfangreiche Datenbank oder nutzen Sie unsere intelligente Suche, 
              um das perfekte Haustier für Ihr Leben zu finden
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/search" 
                className="group btn btn-primary btn-lg px-12 py-4 text-lg shadow-2xl hover:shadow-primary/25 transition-all duration-500"
              >
                <Search className="mr-3 group-hover:scale-110 transition-transform" size={24} />
                Jetzt suchen
                <Sparkles className="ml-3 group-hover:rotate-12 transition-transform" size={24} />
              </Link>
              <Link 
                href="/blog" 
                className="btn btn-outline btn-lg px-12 py-4 text-lg hover:btn-secondary transition-all duration-300 backdrop-blur-sm"
              >
                <BookOpen className="mr-3" size={24} />
                Ratgeber lesen
              </Link>
            </div>
            
            {/* NEW: Additional CTA info */}
            <div className="mt-12 text-sm text-base-content/60">
              <p>✨ Kostenlos • 📱 Mobile-optimiert • 🔒 Datenschutz-freundlich</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
