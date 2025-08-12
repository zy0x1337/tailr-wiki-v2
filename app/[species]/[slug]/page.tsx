// app/[species]/[slug]/page.tsx - Vollständig optimiert
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
  Sparkles
} from 'lucide-react'

interface PageProps {
  params: Promise<{
    species: string
    slug: string
  }>
}

// ✅ Helper functions
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const pet = await prisma.pet.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true }
  })

  if (!pet) {
    return {
      title: 'Tier nicht gefunden | tailr.wiki'
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
      images: [
        {
          url: getImageSrc(pet.primaryImage),
          width: 1200,
          height: 630,
          alt: `${pet.name} Foto`
        }
      ]
    }
  }
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
      careLevel: true
    },
    take: 4
  })

  if (relatedPets.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-base-300">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-2xl font-bold">Ähnliche Rassen</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedPets.map((pet) => (
          <Link
            key={pet.id}
            href={`/${pet.species}/${pet.slug}`}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <figure className="aspect-[4/3] relative overflow-hidden">
              <Image
                src={getImageSrc(pet.primaryImage)}
                alt={pet.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </figure>
            <div className="card-body p-4">
              <h4 className="card-title text-base">{pet.name}</h4>
              <div className="flex gap-2 mt-2">
                {pet.size && (
                  <div className="badge badge-outline badge-sm">{pet.size}</div>
                )}
                {pet.careLevel && (
                  <div className="badge badge-primary badge-sm">{pet.careLevel}</div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

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
  const ratings = parseJsonField<Record<string, number>>(pet.ratings)
  const gallery = parseJsonField<string[]>(pet.gallery) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Navigation */}
        <div className="breadcrumbs text-sm mb-6">
          <ul>
            <li>
              <Link href="/" className="text-primary hover:text-primary-focus">
                Home
              </Link>
            </li>
            <li>
              <Link 
                href={`/${pet.species}`} 
                className="text-primary hover:text-primary-focus"
              >
                {pet.category.name}
              </Link>
            </li>
            <li>{pet.name}</li>
          </ul>
        </div>

        {/* Back Button */}
        <Link 
          href={`/${pet.species}`}
          className="btn btn-ghost gap-2 mb-8 hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zu {pet.category.name}
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={getImageSrc(pet.primaryImage)}
                alt={pet.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="btn btn-circle btn-sm bg-base-100/90 backdrop-blur-sm hover:bg-base-100">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="btn btn-circle btn-sm bg-base-100/90 backdrop-blur-sm hover:bg-base-100">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Gallery Preview */}
            {gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {gallery.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={getImageSrc(image)}
                      alt={`${pet.name} ${index + 1}`}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 25vw, 12vw"
                    />
                    {index === 3 && gallery.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          +{gallery.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pet Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-base-content">
                {pet.name}
              </h1>
              {pet.breed && pet.breed !== pet.name && (
                <div className="text-xl text-primary font-semibold mb-4">
                  {pet.breed}
                </div>
              )}
              <p className="text-lg text-base-content/80 leading-relaxed">
                {pet.description}
              </p>
            </div>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-2 gap-4">
              {pet.size && (
                <div className="card bg-base-100 shadow-lg border border-base-300">
                  <div className="card-body p-4 text-center">
                    <Scale className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-sm text-base-content/70">Größe</div>
                    <div className="font-semibold">{pet.size}</div>
                  </div>
                </div>
              )}

              {pet.weight && (
                <div className="card bg-base-100 shadow-lg border border-base-300">
                  <div className="card-body p-4 text-center">
                    <Scale className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <div className="text-sm text-base-content/70">Gewicht</div>
                    <div className="font-semibold">{pet.weight}</div>
                  </div>
                </div>
              )}

              {pet.lifeExpectancy && (
                <div className="card bg-base-100 shadow-lg border border-base-300">
                  <div className="card-body p-4 text-center">
                    <Calendar className="w-6 h-6 text-accent mx-auto mb-2" />
                    <div className="text-sm text-base-content/70">Lebenserwartung</div>
                    <div className="font-semibold">{pet.lifeExpectancy}</div>
                  </div>
                </div>
              )}

              {pet.careLevel && (
                <div className="card bg-base-100 shadow-lg border border-base-300">
                  <div className="card-body p-4 text-center">
                    <Activity className="w-6 h-6 text-info mx-auto mb-2" />
                    <div className="text-sm text-base-content/70">Pflegeaufwand</div>
                    <div className="font-semibold">{pet.careLevel}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Temperament Tags */}
            {temperament && temperament.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Charakter & Temperament
                </h3>
                <div className="flex flex-wrap gap-2">
                  {temperament.map((trait) => (
                    <div 
                      key={trait} 
                      className="badge badge-primary badge-lg hover:scale-105 transition-transform"
                    >
                      {trait}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Origin */}
            {pet.origin && (
              <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
                <div className="card-body p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">Herkunft</span>
                  </div>
                  <div className="text-base-content/80">{pet.origin}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Information Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {pet.character && (
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Charakter
                </h3>
                <p className="text-base-content/80 leading-relaxed">
                  {pet.character}
                </p>
              </div>
            </div>
          )}

          {pet.health && (
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-error" />
                  Gesundheit
                </h3>
                <p className="text-base-content/80 leading-relaxed">
                  {pet.health}
                </p>
              </div>
            </div>
          )}

          {pet.grooming && (
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  Pflege
                </h3>
                <p className="text-base-content/80 leading-relaxed">
                  {pet.grooming}
                </p>
              </div>
            </div>
          )}

          {pet.activity && (
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Aktivität
                </h3>
                <p className="text-base-content/80 leading-relaxed">
                  {pet.activity}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Ratings Section */}
        {ratings && Object.keys(ratings).length > 0 && (
          <div className="card bg-base-100 shadow-lg border border-base-300 mb-12">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-warning" />
                Bewertungen
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(ratings).map(([category, rating]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{category}</span>
                      <span className="text-sm text-base-content/70">{rating}/5</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? 'text-warning fill-current' : 'text-base-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Pets */}
        <Suspense fallback={
          <div className="mt-12 pt-8 border-t border-base-300">
            <div className="h-6 bg-base-300 rounded w-48 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
                  <div className="h-48 bg-base-300"></div>
                  <div className="card-body p-4">
                    <div className="h-4 bg-base-300 rounded mb-2"></div>
                    <div className="h-3 bg-base-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }>
          <RelatedPets currentPetId={pet.id} species={pet.species} />
        </Suspense>
      </div>
    </div>
  )
}
