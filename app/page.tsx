// app/page.tsx - TAILR.WIKI Homepage - Vollständig optimiert
import { Suspense } from 'react'
import { Metadata } from 'next'
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
  BookOpen,
  Globe,
  Clock,
  PawPrint,
  User,
  Calendar
} from 'lucide-react'

// ✅ SEO-Optimized Metadata
export const metadata: Metadata = {
  title: 'TAILR.WIKI - Finden Sie Ihren perfekten Haustier-Begleiter | 150+ Rassen',
  description: 'Entdecken Sie über 150 wissenschaftlich geprüfte Hunde- und Katzenrassen. Kostenlos, werbefrei und expertengepräft - Ihr vertrauensvoller Haustier-Ratgeber.',
  keywords: 'Hunderassen, Katzenrassen, Haustier finden, Tierauswahl, Haustier-Ratgeber, wissenschaftlich geprüft',
  authors: [{ name: 'TAILR.WIKI Team' }],
  openGraph: {
    title: 'TAILR.WIKI - Der ultimative Haustier-Ratgeber | 150+ Rassen',
    description: 'Wissenschaftlich fundierte Informationen für Ihren perfekten Begleiter. Kostenlos und werbefrei.',
    url: 'https://tailr.wiki',
    siteName: 'TAILR.WIKI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TAILR.WIKI - Wissenschaftlich fundierte Haustier-Informationen'
      }
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAILR.WIKI - Wissenschaftlich fundierte Haustier-Informationen',
    description: 'Über 150 Rassen mit detaillierten Profilen. Kostenlos und expertengepräft.',
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

// ✅ TypeScript Interfaces
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

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  category: string
  author: string
  publishedAt: Date
  readingTime: string | null
  cardImage: string | null
  authorData: { name: string; avatar: string }
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

// ✅ Loading Skeletons
function HomePageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="hero min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 relative overflow-hidden animate-pulse">
        <div className="text-center space-y-8">
          <div className="h-8 bg-base-300 rounded-full w-64 mx-auto"></div>
          <div className="h-20 bg-base-300 rounded-2xl w-96 mx-auto"></div>
          <div className="h-6 bg-base-300 rounded w-80 mx-auto"></div>
          <div className="flex gap-4 justify-center">
            <div className="h-14 bg-base-300 rounded-xl w-48"></div>
            <div className="h-14 bg-base-300 rounded-xl w-48"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsSkeleton() {
  const statItems = [
    { delay: '0s', iconColor: 'bg-primary/20', valueColor: 'bg-primary/30' },
    { delay: '0.2s', iconColor: 'bg-secondary/20', valueColor: 'bg-secondary/30' },
    { delay: '0.4s', iconColor: 'bg-accent/20', valueColor: 'bg-accent/30' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {statItems.map((stat, i) => (
        <div 
          key={i} 
          className="group relative animate-pulse hover:scale-105 transition-transform duration-300" 
          style={{animationDelay: stat.delay}}
        >
          <div className="relative bg-gradient-to-br from-base-100 to-base-200 backdrop-blur-sm rounded-3xl p-8 text-center transition-all duration-700 overflow-hidden border-2 border-base-300 shadow-xl">
            <div className={`${stat.iconColor} rounded-3xl p-6 mx-auto w-fit shadow-lg mb-6`}>
              <div className="w-10 h-10 bg-white/30 rounded mx-auto"></div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-base-300 rounded-lg w-32 mx-auto"></div>
              <div className={`h-12 ${stat.valueColor} rounded-xl w-20 mx-auto font-bold`}></div>
              <div className="h-3 bg-base-300 rounded w-28 mx-auto"></div>
              <div className="flex items-center justify-center gap-1">
                <div className="w-3 h-3 bg-success/40 rounded"></div>
                <div className="h-3 bg-success/40 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ✅ Data Fetching
async function getHomepageData() {
  try {
    const [categoriesWithCounts, totalPets, recentPets, totalUsers] = await Promise.all([
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          speciesCount: true,
          image: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { pets: true }
          }
        },
        orderBy: {
          pets: { _count: 'desc' }
        },
        take: 6
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
      Promise.resolve(25000)
    ])

    return {
      categoriesWithCounts: categoriesWithCounts as CategoryWithCount[],
      totalPets: totalPets || 150,
      recentPets: recentPets || [],
      totalUsers: totalUsers || 25000
    }
  } catch (error) {
    console.error('Homepage data error:', error)
    return {
      categoriesWithCounts: [] as CategoryWithCount[],
      totalPets: 150,
      recentPets: [],
      totalUsers: 25000
    }
  }
}

// ✅ Blog Preview Component
async function BlogPreview() {
  try {
    const recentBlogPosts = await prisma.blogPost.findMany({
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        author: true,
        publishedAt: true,
        readingTime: true,
        cardImage: true
      }
    })

    const processedPosts: BlogPost[] = recentBlogPosts.map(post => ({
      ...post,
      authorData: JSON.parse(post.author) as { name: string; avatar: string }
    }))

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {processedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-500 group border border-base-300 hover:border-primary/30 hover:scale-105"
          >
            {post.cardImage && (
              <figure className="relative h-40 overflow-hidden">
                <Image
                  src={post.cardImage.startsWith('/') ? post.cardImage : `/${post.cardImage}`}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="badge badge-primary badge-sm">
                    {post.category}
                  </span>
                </div>
              </figure>
            )}
            
            <div className="card-body p-5">
              <h3 className="card-title text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              
              {post.excerpt && (
                <p className="text-base-content/70 text-sm line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-base-content/60">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-base-300 overflow-hidden">
                    <Image
                      src={post.authorData.avatar.startsWith('/') ? post.authorData.avatar : `/${post.authorData.avatar}`}
                      alt={post.authorData.name}
                      width={16}
                      height={16}
                      className="object-cover"
                    />
                  </div>
                  <span>{post.authorData.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readingTime || '5 Min.'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Blog preview loading error:', error)
    return (
      <div className="text-center py-8">
        <BookOpen className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
        <p className="text-base-content/60">Blog-Artikel werden geladen...</p>
      </div>
    )
  }
}

// ✅ Stats Overview Component
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
        gradientFrom: 'from-primary/20',
        gradientTo: 'to-primary/5',
        borderColor: 'border-primary/20',
        glowColor: 'shadow-primary/20',
        description: 'Wissenschaftlich geprüft',
        trend: '+15%',
        trendColor: 'text-emerald-600',
        subtitle: 'Detaillierte Tierprofile'
      },
      { 
        label: 'Kategorien', 
        value: categoriesWithCounts.length || 6, 
        icon: Star, 
        color: 'text-secondary',
        bgColor: 'bg-secondary/10',
        gradientFrom: 'from-secondary/20',
        gradientTo: 'to-secondary/5',
        borderColor: 'border-secondary/20',
        glowColor: 'shadow-secondary/20',
        description: 'Verschiedene Tierarten',
        trend: '+2%',
        trendColor: 'text-blue-600',
        subtitle: 'Hunde, Katzen & mehr'
      },
      { 
        label: 'Aktive Nutzer', 
        value: totalUsers, 
        icon: Users, 
        color: 'text-accent',
        bgColor: 'bg-accent/10',
        gradientFrom: 'from-accent/20',
        gradientTo: 'to-accent/5',
        borderColor: 'border-accent/20',
        glowColor: 'shadow-accent/20',
        description: 'Monatlich aktiv',
        trend: '+28%',
        trendColor: 'text-green-600',
        subtitle: 'Vertrauen uns bereits'
      },
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {stats.map((stat, index) => (
          <div 
            key={stat.label} 
            className="group relative"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className={`relative bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo} backdrop-blur-sm rounded-3xl p-8 text-center transition-all duration-700 hover:scale-105 overflow-hidden border-2 ${stat.borderColor} hover:border-opacity-60 shadow-xl hover:shadow-2xl hover:${stat.glowColor} group-hover:shadow-2xl`}>
              
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{animationDelay: '0s'}}></div>
                <div className="absolute bottom-6 left-4 w-1 h-1 bg-white/30 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1/2 left-6 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{animationDelay: '1s'}}></div>
              </div>

              <div className={`relative mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-700`}>
                <div className={`${stat.bgColor} rounded-3xl p-6 mx-auto w-fit shadow-lg group-hover:shadow-xl transition-shadow duration-500 relative overflow-hidden`}>
                  <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}></div>
                  <stat.icon size={42} className={`${stat.color} relative z-10 drop-shadow-sm`} />
                </div>
                
                <div className="absolute inset-0 rounded-full border-2 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
              </div>
              
              <div className="relative z-10 space-y-3">
                <div className="text-base font-semibold text-base-content/70 tracking-wide uppercase text-xs">
                  {stat.label}
                </div>
                
                <div className={`text-5xl md:text-6xl font-black ${stat.color} mb-1 group-hover:scale-110 transition-transform duration-500 tracking-tight`}>
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                
                <div className="text-sm font-medium text-base-content/60 mb-3">
                  {stat.subtitle}
                </div>
                
                <div className="text-sm text-base-content/50 font-medium mb-4">
                  {stat.description}
                </div>
                
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className={`flex items-center gap-1 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 group-hover:bg-white/20`}>
                    <div className="relative">
                      <TrendingUp size={14} className={`${stat.trendColor} animate-pulse`} />
                      <div className={`absolute inset-0 ${stat.trendColor} opacity-30 blur-sm`}></div>
                    </div>
                    <span className={`text-sm font-bold ${stat.trendColor}`}>
                      {stat.trend}
                    </span>
                  </div>
                  <div className="text-xs text-base-content/40 font-medium">
                    diesen Monat
                  </div>
                </div>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradientFrom} ${stat.gradientTo} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className={`absolute top-4 right-4 w-8 h-8 ${stat.bgColor} rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
            </div>

            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700 -z-10`}></div>
          </div>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Stats loading error:', error)
    return <StatsSkeleton />
  }
}

// Category Navigation
import CategoryImage from '@/components/ui/CategoryImage'

async function CategoryNavigation() {
  try {
    const { categoriesWithCounts } = await getHomepageData()

    if (!categoriesWithCounts.length) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 category-image-loading rounded-full"></div>
          <p className="text-base-content/60">Kategorien werden geladen...</p>
        </div>
      )
    }

    const speciesConfig: Record<string, { 
      image: string;
      fallbackEmoji: string; 
      color: string; 
      bg: string;
      description: string;
    }> = {
      'Hunde': { 
        image: '/images/categories/dog.webp',
        fallbackEmoji: '🐕', 
        color: 'from-amber-500 to-orange-600', 
        bg: 'bg-amber-50',
        description: 'Treue Begleiter für jede Familie'
      },
      'Katzen': { 
        image: '/images/categories/cat.webp',
        fallbackEmoji: '🐱', 
        color: 'from-purple-500 to-pink-600', 
        bg: 'bg-purple-50',
        description: 'Elegante und unabhängige Hausgenossen'
      },
      'Aquarienfische': { 
        image: '/images/categories/fish.webp',
        fallbackEmoji: '🐠', 
        color: 'from-blue-500 to-cyan-600', 
        bg: 'bg-blue-50',
        description: 'Faszinierende Unterwasserwelt'
      },
      'Nager & Kleintiere': { 
        image: '/images/categories/rodent.webp',
        fallbackEmoji: '🐹', 
        color: 'from-green-500 to-emerald-600', 
        bg: 'bg-green-50',
        description: 'Kleine Freunde, große Liebe'
      },
      'Ziervögel': { 
        image: '/images/categories/bird.webp',
        fallbackEmoji: '🦜', 
        color: 'from-yellow-500 to-amber-600', 
        bg: 'bg-yellow-50',
        description: 'Bunte Gefiederte mit Charakter'
      },
      'Reptilien': { 
        image: '/images/categories/reptile.webp',
        fallbackEmoji: '🦎', 
        color: 'from-red-500 to-rose-600', 
        bg: 'bg-red-50',
        description: 'Exotische Schuppentiere'
      }
    }

    return (
      <div className="category-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {categoriesWithCounts.map((category, index) => {
          const config = speciesConfig[category.name] || { 
            image: '/images/categories/default.webp',
            fallbackEmoji: '🐾', 
            color: 'from-gray-500 to-gray-600', 
            bg: 'bg-gray-50',
            description: 'Weitere Tierarten entdecken'
          }
          
          return (
            <Link
              key={category.id}
              href={`/${category.id}`}
              className="category-card category-border-gradient group relative overflow-hidden rounded-2xl p-6 text-center bg-gradient-to-br from-base-100 to-base-200 hover:from-primary/5 hover:to-secondary/5 border border-base-300 hover:border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              {/* ===== BACKGROUND OVERLAY EFFECTS ===== */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* ===== OPTIMIERTE BILD-DARSTELLUNG ===== */}
              <div className="relative mb-6">
                <div className="category-image-container mx-auto mb-3 category-shadow-rounded">
                  <CategoryImage
                    src={config.image}
                    alt={`${category.name} - ${config.description}`}
                    fallbackEmoji={config.fallbackEmoji}
                    className="category-image-enhanced category-image-glow w-full h-full"
                  />
                </div>
                
                {/* Decorative Background Glow */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
              </div>
              
              {/* ===== CONTENT BEREICH ===== */}
              <div className="relative z-10 space-y-3">
                <h3 className="text-category-lg group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>
                
                <div className={`category-badge badge badge-lg bg-gradient-to-r ${config.color} text-white border-none shadow-lg`}>
                  <span className="font-semibold">{category._count.pets}</span>
                  <span className="ml-1 text-xs opacity-90">Rassen</span>
                </div>
                
                {/* Description */}
                <p className="text-category-sm text-base-content/60 leading-relaxed min-h-[2.5rem] flex items-center justify-center px-2">
                  {category.description || config.description}
                </p>
                
                {/* Animated Arrow */}
                <div className="category-arrow">
                  <ArrowRight 
                    size={18} 
                    className="mx-auto text-primary" 
                  />
                </div>
              </div>

              {/* ===== CORNER ACCENT ===== */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              {/* ===== SUBTLE PATTERN OVERLAY ===== */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 bg-gradient-to-br from-white via-transparent to-black rounded-2xl"></div>
            </Link>
          )
        })}
      </div>
    )
  } catch (error) {
    console.error('Categories loading error:', error)
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 category-image-loading rounded-full"></div>
        <p className="text-base-content/60 text-category-lg">
          Fehler beim Laden der Kategorien.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-outline btn-sm mt-4 hover:btn-primary transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    )
  }
}

// ✅ Trust Indicators Component
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

// ✅ Main HomePage Component
export default function HomePage() {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <main className="min-h-screen">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "TAILR.WIKI",
              "description": "Wissenschaftlich fundierte Haustier-Informationen für über 150 Rassen",
              "url": "https://tailr.wiki",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tailr.wiki/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        {/* ===== HERO SECTION ===== */}
        <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-30" 
                 style={{background: 'hsl(var(--p) / 0.1)'}}></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse opacity-20" 
                 style={{background: 'hsl(var(--s) / 0.08)', animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full blur-2xl animate-pulse opacity-25" 
                 style={{background: 'hsl(var(--a) / 0.06)', animationDelay: '2s'}}></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm hover:bg-primary/20 transition-colors duration-300">
                <Sparkles size={16} className="animate-pulse" />
                Über 150 wissenschaftlich geprüfte Rassen
                <TrendingUp size={16} />
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="block text-base-content mt-2">
                  tailr.wiki
                </span>
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl text-base-content/80 mb-12 max-w-4xl mx-auto leading-relaxed">
                Entdecken Sie wissenschaftlich fundierte Informationen zu über 
                <span className="font-bold text-primary"> 150 Hunderassen</span>, 
                Katzen, Vögeln, Fischen, Reptilien und mehr.
              </p>
            </div>

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

            <TrustIndicators />

            <div className="mt-16">
              <Suspense fallback={<StatsSkeleton />}>
                <StatsOverview />
              </Suspense>
            </div>
          </div>
        </section>

        {/* ===== WHY TAILR.WIKI SECTION ===== */}
        <section className="why-section py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Warum TAILR.WIKI?
              </h2>
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
                Ihre vertrauenswürdige Quelle für wissenschaftlich fundierte Haustier-Informationen
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                }
              ].map((feature, index) => (
                <div key={index} className="group relative">
                  <div className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-700 p-8 text-center border-2 ${feature.borderColor} hover:border-opacity-50 hover:scale-105 h-full overflow-hidden`}>
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
                      
                      <div className="flex flex-wrap gap-2 justify-center">
                        {feature.features.map((tag, tagIndex) => (
                          <span key={tagIndex} className="badge badge-outline badge-sm opacity-70 group-hover:opacity-100 transition-opacity">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-700"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CATEGORIES SECTION ===== */}
        <section className="categories-section py-24 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Entdecken Sie unsere 
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-textt"> Tierkategorien</span>
              </h2>
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
                Von Hunden und Katzen bis hin zu Vögeln, Fischen und Reptilien - wir haben alle Informationen, die Sie brauchen
              </p>
            </div>
            
            <Suspense fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-base-200 rounded-2xl h-32 animate-pulse"></div>
                ))}
              </div>
            }>
              <CategoryNavigation />
            </Suspense>
          </div>
        </section>

        {/* ===== BLOG PREVIEW SECTION ===== */}
        <section className="py-24 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen size={16} />
                Expert-Ratgeber
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Neueste 
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text"> Blog-Artikel</span>
              </h2>
              
              <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
                Wissenschaftlich fundierte Ratgeber und Expert-Tipps für die optimale Haustierpflege
              </p>
            </div>

            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
                    <div className="h-40 bg-base-300"></div>
                    <div className="card-body">
                      <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-base-300 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-base-300 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            }>
              <BlogPreview />
            </Suspense>

            <div className="text-center mt-12">
              <Link 
                href="/blog"
                className="btn btn-outline btn-lg group hover:btn-primary transition-all duration-300"
              >
                <BookOpen className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                Alle Artikel im Blog
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA SECTION ===== */}
        <section className="py-24 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),transparent)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.2),transparent)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Bereit, Ihren perfekten 
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text"> Begleiter</span> zu finden?
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
              
              <div className="mt-12 text-sm text-base-content/60">
                <p>✨ Kostenlos • 📱 Mobile-optimiert • 🔒 Datenschutz-freundlich</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Suspense>
  )
}
