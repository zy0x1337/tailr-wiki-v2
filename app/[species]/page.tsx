// app/[species]/page.tsx - Korrigiert mit deiner FilterSidebar
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Sparkles, TrendingUp, Filter } from 'lucide-react'
import { FilterProvider } from '@/components/providers/FilterProvider'
import { PetPropertiesProvider } from '@/components/providers/PetPropertiesProvider'
import FilterSidebar from '@/components/ui/FilterSidebar'  // ✅ KORRIGIERT: Deine bestehende Komponente
import PropertiesFilter from '@/components/ui/PropertiesFilter'
import FilteredPetGrid from '@/components/ui/FilteredPetGrid'

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

// ✅ Species display configuration
const speciesConfig = {
  dogs: { 
    name: 'Hunde', 
    emoji: '🐕', 
    color: 'from-blue-500 to-purple-600',
    description: 'Treue Begleiter für jede Lebenssituation'
  },
  cats: { 
    name: 'Katzen', 
    emoji: '🐱', 
    color: 'from-pink-500 to-orange-500',
    description: 'Elegante und unabhängige Samtpfoten'
  },
  birds: { 
    name: 'Vögel', 
    emoji: '🦅', 
    color: 'from-green-500 to-teal-500',
    description: 'Farbenfrohe und intelligente Gefährten'
  },
  fish: { 
    name: 'Fische', 
    emoji: '🐠', 
    color: 'from-cyan-500 to-blue-500',
    description: 'Friedliche Unterwasserwelt für Zuhause'
  },
  rodents: { 
    name: 'Kleintiere', 
    emoji: '🐹', 
    color: 'from-yellow-500 to-red-500',
    description: 'Kleine Freunde mit großer Persönlichkeit'
  },
  reptiles: { 
    name: 'Reptilien', 
    emoji: '🦎', 
    color: 'from-emerald-500 to-green-600',
    description: 'Faszinierende exotische Begleiter'
  }
}

interface PageProps {
  params: Promise<{ species: string }>
}

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
      images: [
        {
          url: category.image || '/images/default-category.jpg',
          width: 1200,
          height: 630,
          alt: `${category.name} Übersicht`
        }
      ]
    }
  }
}

export async function generateStaticParams() {
  return validSpecies.map((species) => ({
    species: species,
  }))
}

// ✅ Optimized pets loading
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

  const pets = rawPets.map(pet => ({
    ...pet,
    temperament: parseJsonField<string[]>(pet.temperament),
    ratings: parseJsonField(pet.ratings)
  }))

  if (pets.length === 0) {
    const config = speciesConfig[species as keyof typeof speciesConfig]
    
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="card bg-base-100 shadow-xl border border-base-300 max-w-md mx-auto">
          <div className="card-body text-center py-12">
            <div className="text-8xl mb-6 animate-bounce">
              {config?.emoji || '🐾'}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-base-content">
              Noch keine {config?.name} verfügbar
            </h3>
            <p className="text-base-content/70 mb-6 leading-relaxed">
              Wir arbeiten daran, diese Kategorie mit detaillierten Profilen zu füllen. 
              Schaue bald wieder vorbei!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/" className="btn btn-primary gap-2">
                <ArrowLeft className="w-4 h-4" />
                Zurück zur Startseite
              </Link>
              <Link href="/dogs" className="btn btn-outline gap-2">
                <Sparkles className="w-4 h-4" />
                Hunde entdecken
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ LAYOUT MIT SIDEBAR (wie ursprünglich geplant)
  return (
    <FilterProvider>
      <PetPropertiesProvider>
        <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Deine bestehende FilterSidebar */}
              <FilterSidebar pets={pets} />
              
              {/* Properties Filter - nur für Hunde */}
              {species === 'dogs' && (
                <PropertiesFilter />
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 xl:col-span-4">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{pets.length}</div>
                  <div className="text-xs text-base-content/70">Rassen</div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {new Set(pets.map(p => p.size).filter(Boolean)).size}
                  </div>
                  <div className="text-xs text-base-content/70">Größen</div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {new Set(pets.map(p => p.careLevel).filter(Boolean)).size}
                  </div>
                  <div className="text-xs text-base-content/70">Pflegestufen</div>
                </div>
              </div>
              <div className="card bg-base-100 shadow-lg border border-base-300">
                <div className="card-body p-4 text-center">
                  <div className="text-2xl font-bold text-info">
                    {new Set(pets.map(p => p.origin).filter(Boolean)).size}
                  </div>
                  <div className="text-xs text-base-content/70">Länder</div>
                </div>
              </div>
            </div>

            {/* Pet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              <FilteredPetGrid pets={pets} />
            </div>
          </div>
        </div>
      </PetPropertiesProvider>
    </FilterProvider>
  )
}

// ✅ Loading Skeleton für Sidebar-Layout
function LoadingSkeleton() {
  return (
    <div className="grid lg:grid-cols-4 xl:grid-cols-5 gap-8">
      {/* Sidebar Skeleton */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6 animate-pulse">
            <div className="h-8 bg-base-300 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-base-300 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6 animate-pulse">
            <div className="h-6 bg-base-300 rounded mb-4"></div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-base-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="lg:col-span-3 xl:col-span-4">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
              <div className="card-body p-4 text-center">
                <div className="h-8 bg-base-300 rounded mb-2"></div>
                <div className="h-3 bg-base-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
              <div className="h-48 bg-base-300"></div>
              <div className="card-body">
                <div className="h-6 bg-base-300 rounded mb-2"></div>
                <div className="h-4 bg-base-300 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-base-300 rounded"></div>
                  <div className="h-6 w-20 bg-base-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

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
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          {/* Breadcrumbs */}
          <div className="breadcrumbs text-sm mb-6">
            <ul>
              <li>
                <Link href="/" className="text-primary hover:text-primary-focus">
                  Home
                </Link>
              </li>
              <li>{category.name}</li>
            </ul>
          </div>

          {/* Back Button */}
          <Link 
            href="/" 
            className="btn btn-ghost gap-2 mb-6 hover:bg-primary/10 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>
          
          {/* Hero Section */}
          <div className="text-center relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${config?.color || 'from-primary to-secondary'} opacity-5 rounded-3xl`}></div>
            
            <div className="relative py-12 px-6">
              <div className="text-8xl mb-6 animate-bounce">
                {config?.emoji || '🐾'}
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {category.name}
              </h1>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="badge badge-primary badge-lg gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {petCount} Rassen
                </div>
                <div className="badge badge-secondary badge-lg">
                  Vollständige Profile
                </div>
              </div>
              
              <p className="text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed">
                {config?.description || category.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <Suspense fallback={<LoadingSkeleton />}>
          <CategoryPets species={resolvedParams.species} />
        </Suspense>
      </div>
    </div>
  )
}
