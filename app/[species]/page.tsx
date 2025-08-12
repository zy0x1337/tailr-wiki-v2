import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  TrendingUp, 
  Grid3X3, 
  MapPin,
  Heart,
  Activity,
  Award,
  Users,
  ChevronDown,
  Eye,
  Home,
  ChevronRight,
  Settings
} from 'lucide-react'
import { FilterProvider } from '@/components/providers/FilterProvider'
import { PetPropertiesProvider } from '@/components/providers/PetPropertiesProvider'
import PropertiesFilter from '@/components/ui/PropertiesFilter'
import FilteredPetGrid from '@/components/ui/FilteredPetGrid'
import FilterSidebar from '@/components/ui/FilterSidebar'

// ✅ Enhanced Type Definitions
interface PetWithParsedData {
  id: number
  name: string
  breed: string | null
  slug: string
  species: string
  primaryImage: string | null
  description: string
  size: string | null
  temperament: string[] | null
  careLevel: string | null
  ratings: Record<string, number> | null
  origin: string | null
  lifeExpectancy: string | null
  weight: string | null
  createdAt: Date
}

interface PageProps {
  params: Promise<{ species: string }>
}

// ✅ Type-safe JSON parsing
function parseJsonField<T>(field: string | null): T | null {
  if (!field) return null
  try {
    return JSON.parse(field) as T
  } catch {
    return null
  }
}

const validSpecies = ['dogs', 'cats', 'birds', 'fish', 'rodents', 'reptiles']

// ✅ Kompakte Species Configuration
const speciesConfig = {
  dogs: { 
    name: 'Hunde', 
    color: 'from-blue-500 via-indigo-500 to-purple-600',
    bgPattern: 'from-blue-50 to-indigo-50',
    description: 'Treue Begleiter für jede Lebenssituation',
    heroImage: '/images/categories/dogs-hero.webp'
  },
  cats: { 
    name: 'Katzen', 
    color: 'from-pink-500 via-rose-500 to-orange-500',
    bgPattern: 'from-pink-50 to-rose-50',
    description: 'Elegante und unabhängige Samtpfoten',
    heroImage: '/images/categories/cats-hero.webp'
  },
  birds: { 
    name: 'Vögel', 
    color: 'from-green-500 via-emerald-500 to-teal-500',
    bgPattern: 'from-green-50 to-emerald-50',
    description: 'Farbenfrohe und intelligente Gefährten',
    heroImage: '/images/categories/birds-hero.webp'
  },
  fish: { 
    name: 'Fische', 
    color: 'from-cyan-500 via-blue-500 to-indigo-500',
    bgPattern: 'from-cyan-50 to-blue-50',
    description: 'Friedliche Unterwasserwelt für Zuhause',
    heroImage: '/images/categories/fish-hero.webp'
  },
  rodents: { 
    name: 'Kleintiere', 
    color: 'from-yellow-500 via-amber-500 to-orange-500',
    bgPattern: 'from-yellow-50 to-amber-50',
    description: 'Kleine Freunde mit großer Persönlichkeit',
    heroImage: '/images/categories/rodents-hero.webp'
  },
  reptiles: { 
    name: 'Reptilien', 
    color: 'from-emerald-500 via-green-600 to-lime-500',
    bgPattern: 'from-emerald-50 to-green-50',
    description: 'Faszinierende exotische Begleiter',
    heroImage: '/images/categories/reptiles-hero.webp'
  }
}

// ✅ Enhanced Metadata Generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  
  const [category, petCount] = await Promise.all([
    prisma.category.findUnique({
      where: { id: resolvedParams.species }
    }),
    prisma.pet.count({
      where: { species: resolvedParams.species }
    })
  ])

  const config = speciesConfig[resolvedParams.species as keyof typeof speciesConfig]

  if (!category) {
    return { 
      title: 'Kategorie nicht gefunden | tailr.wiki',
      description: 'Die gesuchte Tierkategorie wurde nicht gefunden.'
    }
  }

  return {
    title: `${category.name} - Alle Rassen & Arten | tailr.wiki`,
    description: `Entdecken Sie ${petCount} ${category.name.toLowerCase()}-Rassen mit detaillierten Profilen, Pflegetipps und Charaktereigenschaften.`,
    keywords: `${category.name}, Haustiere, Rassen, Pflege, Charakter, tailr.wiki`,
    openGraph: {
      title: `${category.name} Ratgeber | tailr.wiki`,
      description: config?.description || category.description,
      type: 'website',
      images: [{
        url: config?.heroImage || category.image || '/images/default-category.jpg',
        width: 1200,
        height: 630,
        alt: `${category.name} Übersicht`
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Ratgeber | tailr.wiki`,
      description: config?.description || category.description,
      images: [config?.heroImage || category.image || '/images/default-category.jpg']
    }
  }
}

export async function generateStaticParams() {
  return validSpecies.map((species) => ({
    species: species,
  }))
}

// ✅ Kompakter Hero Section
function CompactHeroSection({ 
  category, 
  config, 
  petCount 
}: { 
  category: { name: string; description: string; image: string | null }, 
  config: typeof speciesConfig[keyof typeof speciesConfig],
  petCount: number 
}) {
  return (
    <section className="relative py-12 overflow-hidden">
      {/* Subtiler Background Pattern */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config?.bgPattern || 'from-base-100 to-base-200'} opacity-40`}></div>
      <div className={`absolute inset-0 bg-gradient-to-r ${config?.color || 'from-primary to-secondary'} opacity-5`}></div>
      
      {/* Dezente Decorative Shapes */}
      <div className="absolute top-6 right-8 w-20 h-20 bg-primary/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-6 left-12 w-24 h-24 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Kompakter Titel */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            <span className={`bg-gradient-to-r ${config?.color || 'from-primary to-secondary'} bg-clip-text text-transparent`}>
              {category.name}
            </span>
          </h1>
          
          {/* Kompakte Statistics Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <div className="badge badge-primary badge-md px-3 py-2 text-sm font-semibold gap-2">
              <TrendingUp className="w-4 h-4" />
              {petCount} Rassen
            </div>
            <div className="badge badge-secondary badge-md px-3 py-2 text-sm font-semibold gap-2">
              <Award className="w-4 h-4" />
              Vollständige Profile
            </div>
            <div className="badge badge-accent badge-md px-3 py-2 text-sm font-semibold gap-2">
              <Heart className="w-4 h-4" />
              Expertenwissen
            </div>
          </div>
          
          {/* Kompakte Description */}
          <p className="text-base sm:text-lg text-base-content/80 max-w-2xl mx-auto leading-relaxed">
            {config?.description || category.description}
          </p>
        </div>
      </div>
    </section>
  )
}

// ✅ Kompakte Statistics Section
function CompactStatisticsSection({ pets }: { pets: PetWithParsedData[] }) {
  const stats = [
    {
      label: 'Rassen',
      value: pets.length,
      icon: <Grid3X3 className="w-4 h-4" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Größen',
      value: new Set(pets.map(p => p.size).filter(Boolean)).size,
      icon: <Activity className="w-4 h-4" />,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      label: 'Pflegestufen',
      value: new Set(pets.map(p => p.careLevel).filter(Boolean)).size,
      icon: <Heart className="w-4 h-4" />,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Länder',
      value: new Set(pets.map(p => p.origin).filter(Boolean)).size,
      icon: <MapPin className="w-4 h-4" />,
      color: 'text-info',
      bgColor: 'bg-info/10'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="card-body items-center text-center p-4">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
              <div className={stat.color}>
                {stat.icon}
              </div>
            </div>
            <div className="text-xl font-bold mb-1 text-base-content group-hover:text-primary transition-colors">
              {stat.value}
            </div>
            <div className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ✅ Empty State Component
function EmptyState({ species }: { species: string }) {
  const config = speciesConfig[species as keyof typeof speciesConfig]
  
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl border border-base-300 max-w-lg mx-auto">
        <div className="card-body text-center py-12 px-8">
          <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <Eye className="w-10 h-10 text-base-content/50" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-base-content">
            Noch keine {config?.name} verfügbar
          </h3>
          <p className="text-base-content/70 mb-8 leading-relaxed">
            Wir arbeiten daran, diese Kategorie mit detaillierten Profilen zu füllen. 
            Schaue bald wieder vorbei oder entdecke andere Kategorien!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn btn-primary gap-2">
              <Home className="w-4 h-4" />
              Zur Startseite
            </Link>
            <Link href="/dogs" className="btn btn-outline gap-2">
              <Eye className="w-4 h-4" />
              Hunde entdecken
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

async function CategoryPets({ species }: { species: string }) {
  const rawPets = await prisma.pet.findMany({
    where: { species },
    orderBy: { name: 'asc' },
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
      origin: true,
      lifeExpectancy: true,
      weight: true,
      createdAt: true
    }
  })

  const pets: PetWithParsedData[] = rawPets.map(pet => ({
    ...pet,
    temperament: parseJsonField<string[]>(pet.temperament),
    ratings: parseJsonField<Record<string, number>>(pet.ratings)
  }))

  if (pets.length === 0) {
    return <EmptyState species={species} />
  }

  return (
    <FilterProvider>
      <PetPropertiesProvider>
        <div className="space-y-6">
          {/* Kompakte Statistics Section */}
          <CompactStatisticsSection pets={pets} />
          
          <div className="space-y-6">
            {/* Haupt-Filter-Leiste - Prominent oben */}
            <div className="bg-base-100 rounded-xl shadow-lg border border-base-300 p-4">
              <FilterSidebar pets={pets} />
            </div>
            
            {/* Content Layout */}
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Erweiterte Filter - Nur für Hunde, in Sidebar */}
              {species === 'dogs' && (
                <div className="lg:col-span-1">
                  <div className="card bg-base-100 shadow-lg border border-base-300 rounded-xl overflow-hidden sticky top-20">
                    <div className="card-header bg-gradient-to-r from-accent/5 to-info/5 p-4 border-b border-base-300">
                      <h3 className="font-semibold text-base flex items-center gap-2">
                        <Settings className="w-4 h-4 text-accent" />
                        Erweiterte Filter
                      </h3>
                    </div>
                    <div className="card-body p-4">
                      <PropertiesFilter />
                    </div>
                  </div>
                </div>
              )}

              {/* Pet Grid - Responsive basierend auf Sidebar */}
              <div className={species === 'dogs' ? 'lg:col-span-4' : 'lg:col-span-5'}>
                <div className="space-y-6">
                  {/* Pet Grid */}
                  <div className={`grid gap-6 ${
                    species === 'dogs' 
                      ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                  }`}>
                    <FilteredPetGrid pets={pets} />
                  </div>
                  
                  {/* Kompakte Popular Breeds Section */}
                  <div className="card bg-gradient-to-r from-base-100 to-base-200 shadow-lg border border-base-300 rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Beliebte Rassen
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                      {pets.slice(0, 12).map((pet) => (
                        <Link
                          key={pet.id}
                          href={`/${pet.species}/${pet.slug}`}
                          className="group flex items-center gap-2 p-3 rounded-lg hover:bg-base-100 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                            {pet.primaryImage ? (
                              <Image
                                src={pet.primaryImage.startsWith('/') ? pet.primaryImage : `/${pet.primaryImage}`}
                                alt={pet.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs">
                                🐾
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-xs truncate group-hover:text-primary transition-colors">
                              {pet.name}
                            </div>
                            {pet.size && (
                              <div className="text-xs text-base-content/60">
                                {pet.size}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PetPropertiesProvider>
    </FilterProvider>
  )
}

// ✅ Kompakte Loading Skeleton
function CompactLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
            <div className="card-body items-center text-center p-4">
              <div className="w-10 h-10 bg-base-300 rounded-lg mb-2"></div>
              <div className="h-5 w-10 bg-base-300 rounded mb-1"></div>
              <div className="h-3 w-12 bg-base-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Filter Bar Skeleton */}
      <div className="bg-base-100 rounded-xl shadow-lg p-4">
        <div className="space-y-4">
          <div className="h-10 bg-base-300 rounded-lg animate-pulse"></div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-base-300 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Layout Skeleton */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Sidebar Skeleton - nur ein kleiner Bereich */}
        <div className="lg:col-span-1">
          <div className="bg-base-100 rounded-xl shadow-lg p-4 animate-pulse">
            <div className="h-6 bg-base-300 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-base-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
                <div className="h-40 bg-base-300"></div>
                <div className="card-body">
                  <div className="h-5 bg-base-300 rounded mb-2"></div>
                  <div className="h-3 bg-base-300 rounded mb-4 w-3/4"></div>
                  <div className="flex gap-2">
                    <div className="h-5 w-10 bg-base-300 rounded"></div>
                    <div className="h-5 w-12 bg-base-300 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Main Page Component
export default async function SpeciesPage({ params }: PageProps) {
  const resolvedParams = await params

  if (!validSpecies.includes(resolvedParams.species)) {
    notFound()
  }

  const [category, petCount] = await Promise.all([
    prisma.category.findUnique({
      where: { id: resolvedParams.species }
    }),
    prisma.pet.count({
      where: { species: resolvedParams.species }
    })
  ])

  if (!category) {
    notFound()
  }

  const config = speciesConfig[resolvedParams.species as keyof typeof speciesConfig]

  return (
    <main className="min-h-screen">
      {/* Kompakte Breadcrumb Navigation */}
      <nav className="bg-base-100/95 backdrop-blur-sm border-b border-base-300 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="breadcrumbs text-sm">
            <ul className="flex items-center gap-2">
              <li>
                <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-base-content/50" />
              <li className="text-base-content/60">{category.name}</li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Kompakter Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link 
          href="/" 
          className="btn btn-ghost btn-sm gap-2 hover:bg-primary/10 transition-all duration-300 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Link>
      </div>
      
      {/* Kompakter Hero Section */}
      <CompactHeroSection 
        category={category} 
        config={config} 
        petCount={petCount} 
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<CompactLoadingSkeleton />}>
          <CategoryPets species={resolvedParams.species} />
        </Suspense>
      </div>

      {/* Enhanced Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${category.name} - Alle Rassen & Arten`,
            "description": config?.description || category.description,
            "url": `https://tailr.wiki/${resolvedParams.species}`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": petCount,
              "itemListElement": []
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://tailr.wiki"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": category.name,
                  "item": `https://tailr.wiki/${resolvedParams.species}`
                }
              ]
            }
          })
        }}
      />
    </main>
  )
}
