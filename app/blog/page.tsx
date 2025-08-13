// app/blog/page.tsx - NEXT-LEVEL Enterprise Blog System
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Clock, User, TrendingUp, Search, Filter, ChevronRight, Eye, Bookmark, Share2, Calendar, Tag, Star, ArrowUp } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import CategoryImage from '@/components/ui/CategoryImage'

// ✅ ERWEITERTE TypeScript Types - Schema-kompatibel
interface BlogPostWithMeta {
  id: number
  title: string
  slug: string
  category: string
  content: string
  excerpt: string | null
  author: string // JSON: {"name": "Dr. Sarah Weber", "avatar": "/images/authors/sarah.webp", "expertise": "Tierärztin"}
  readingTime: string | null
  cardImage: string | null
  heroImage: string | null
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

interface AuthorData {
  name: string
  avatar?: string
  expertise?: string
  credentials?: string
}

interface BlogPageProps {
  searchParams: { 
    category?: string
    search?: string
    page?: string 
  }
}

// ✅ ADVANCED Server Component für optimierte Data Fetching
async function getBlogPosts(params: {
  category?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{
  featured: BlogPostWithMeta[]
  recent: BlogPostWithMeta[]
  categories: { category: string; count: number }[]
  totalPosts: number
  hasMore: boolean
}> {
  const { category, search, page = 1, limit = 6 } = params
  const skip = (page - 1) * limit

  // Advanced WHERE Conditions
  const whereConditions: any = {
    publishedAt: { lte: new Date() }
  }

  if (category) {
    whereConditions.category = category
  }

  if (search) {
    whereConditions.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [featured, recent, categoryStats, totalCount] = await Promise.all([
    // Featured Posts (Top 3 neueste ohne Filter)
    prisma.blogPost.findMany({
      take: 3,
      orderBy: { publishedAt: 'desc' },
      where: { publishedAt: { lte: new Date() } }
    }),
    
    // Recent Posts mit Advanced Filtering
    prisma.blogPost.findMany({
      take: limit,
      skip,
      orderBy: { publishedAt: 'desc' },
      where: whereConditions
    }),
    
    // Category Statistics
    prisma.blogPost.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
      where: { publishedAt: { lte: new Date() } }
    }),

    // Total Count für Pagination
    prisma.blogPost.count({ where: whereConditions })
  ])

  return {
    featured: category || search ? [] : featured, // Featured nur auf Hauptseite
    recent,
    categories: categoryStats.map(stat => ({
      category: stat.category,
      count: stat._count.category
    })),
    totalPosts: totalCount,
    hasMore: totalCount > skip + limit
  }
}

// ✅ ENHANCED Blog Card mit Scientific Trust Indicators
function BlogCard({ post, featured = false, priority = false }: { 
  post: BlogPostWithMeta
  featured?: boolean
  priority?: boolean 
}) {
  const author: AuthorData = JSON.parse(post.author)
  
  // Reading Time Calculation aus Content
  const estimateReadingTime = (content: string): string => {
    const wordsPerMinute = 200
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} Min. Lesezeit`
  }

  const readingTime = post.readingTime || estimateReadingTime(post.content)
  
  return (
    <article className={`group category-card-scientific credibility-shine ${featured ? 'lg:col-span-2' : ''}`}>
      {/* Hero Image mit CategoryImage Integration */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
        {post.cardImage ? (
          <Image
            src={post.cardImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 gpu-accelerated"
            sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            priority={priority}
          />
        ) : (
          <CategoryImage
            alt={post.category}
            fallbackEmoji="📝"
            size={featured ? 120 : 80}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Scientific Trust Badges */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          <span className="authority-badge authority-badge--verified">
            <Star className="w-3 h-3" />
            {post.category}
          </span>
          {author.expertise && (
            <span className="authority-badge authority-badge--expert">
              <User className="w-3 h-3" />
              {author.expertise}
            </span>
          )}
        </div>

        {/* Reading Progress Indicator (für Featured) */}
        {featured && (
          <div className="absolute bottom-4 right-4">
            <div className="glass-card px-3 py-1 flex items-center gap-2 text-white text-sm">
              <Clock className="w-4 h-4" />
              {readingTime}
            </div>
          </div>
        )}
      </div>

      {/* Content mit Enhanced Typography */}
      <div className="p-6 space-scientific">
        {/* Author & Meta Information */}
        <div className="flex items-center justify-between text-sm text-base-content/70 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs">
                {author.name.charAt(0)}
              </div>
              <span className="font-medium">{author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt.toISOString()}>
                {new Intl.DateTimeFormat('de-DE', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }).format(new Date(post.publishedAt))}
              </time>
            </div>
          </div>
          
          {/* Interactive Elements */}
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost btn-xs gap-1 hover:btn-primary" title="Bookmark">
              <Bookmark className="w-3 h-3" />
            </button>
            <button className="btn btn-ghost btn-xs gap-1 hover:btn-primary" title="Teilen">
              <Share2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Title mit Scientific Typography */}
        <h3 className={`text-scientific--heading mb-3 group-hover:text-primary transition-colors line-clamp-2 text-balance ${featured ? 'text-2xl' : 'text-lg'}`}>
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt mit Enhanced Readability */}
        {post.excerpt && (
          <p className="text-scientific mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {/* Enhanced Call-to-Action */}
        <div className="flex items-center justify-between">
          <Link 
            href={`/blog/${post.slug}`}
            className="btn-scientific group/btn text-sm px-4 py-2"
          >
            Vollständigen Artikel lesen
            <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          
          {/* Reading Stats */}
          <div className="flex items-center gap-3 text-xs text-base-content/60">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

// ✅ ADVANCED Category Filter mit Scientific Design
function CategoryFilter({ categories, activeCategory }: { 
  categories: { category: string; count: number }[]
  activeCategory?: string 
}) {
  const categoryData: Record<string, { emoji: string; color: string }> = {
    'fische': { emoji: '🐠', color: 'from-blue-500/10 to-cyan-500/10' },
    'gesundheit': { emoji: '❤️', color: 'from-red-500/10 to-pink-500/10' },
    'ernaehrung': { emoji: '🥘', color: 'from-orange-500/10 to-yellow-500/10' },
    'verhalten': { emoji: '🧠', color: 'from-purple-500/10 to-indigo-500/10' },
    'pflege': { emoji: '✨', color: 'from-emerald-500/10 to-green-500/10' },
    'haltung': { emoji: '🏠', color: 'from-amber-500/10 to-orange-500/10' }
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <Tag className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-base-content">Kategorien</h2>
        <span className="text-sm text-base-content/60">Nach Themen filtern</span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* All Categories Button */}
        <Link
          href="/blog"
          className={`trust-indicator-enhanced px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            !activeCategory 
              ? 'bg-primary text-primary-content shadow-lg' 
              : 'hover:bg-primary/10'
          }`}
        >
          <span className="mr-2">📚</span>
          Alle Artikel
          <span className="ml-2 text-xs opacity-75">
            ({categories.reduce((sum, cat) => sum + cat.count, 0)})
          </span>
        </Link>

        {/* Category Buttons */}
        {categories.map(({ category, count }) => {
          const data = categoryData[category] || { emoji: '📝', color: 'from-gray-500/10 to-gray-600/10' }
          const isActive = activeCategory === category
          
          return (
            <Link
              key={category}
              href={`/blog?category=${category}`}
              className={`trust-indicator-enhanced px-4 py-2 rounded-xl text-sm font-medium transition-all bg-gradient-to-r ${data.color} ${
                isActive 
                  ? 'ring-2 ring-primary/50 bg-primary/20' 
                  : 'hover:scale-105'
              }`}
            >
              <span className="mr-2">{data.emoji}</span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span className="ml-2 badge badge-xs">{count}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ✅ Advanced Search Component
function SearchBar({ initialSearch }: { initialSearch?: string }) {
  return (
    <div className="mb-8">
      <div className="max-w-md mx-auto relative">
        <div className="glass-card p-1 rounded-xl">
          <form method="GET" className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type="search"
                name="search"
                defaultValue={initialSearch}
                placeholder="Artikel durchsuchen..."
                className="w-full pl-10 pr-4 py-3 bg-transparent border-none outline-none text-base-content placeholder:text-base-content/50"
              />
            </div>
            <button 
              type="submit"
              className="btn-scientific px-6 rounded-lg"
            >
              Suchen
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ✅ Loading Components mit Scientific Design
function BlogCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className={`category-card-scientific overflow-hidden ${featured ? 'lg:col-span-2' : ''}`}>
      <div className="aspect-[16/9] bg-gradient-to-br from-base-300/20 to-base-300/10 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="flex gap-3">
          <div className="h-3 bg-base-300/30 rounded-full animate-pulse w-1/4" />
          <div className="h-3 bg-base-300/30 rounded-full animate-pulse w-1/5" />
        </div>
        <div className="h-6 bg-base-300/30 rounded animate-pulse w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-base-300/30 rounded animate-pulse w-full" />
          <div className="h-4 bg-base-300/30 rounded animate-pulse w-2/3" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-8 bg-base-300/30 rounded-lg animate-pulse w-1/3" />
          <div className="h-4 bg-base-300/30 rounded animate-pulse w-1/4" />
        </div>
      </div>
    </div>
  )
}

// ✅ MAIN Blog Page mit Advanced Features
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category, search, page } = searchParams
  const currentPage = parseInt(page || '1')
  
  const { featured, recent, categories, totalPosts, hasMore } = await getBlogPosts({
    category,
    search,
    page: currentPage
  })

  const hasFilters = Boolean(category || search)
  const resultsText = hasFilters 
    ? `${totalPosts} ${totalPosts === 1 ? 'Ergebnis' : 'Ergebnisse'} gefunden`
    : `${totalPosts} Artikel verfügbar`

  return (
    <div className="min-h-screen bg-base-100">
      {/* ===== ENHANCED HERO SECTION ===== */}
      <section className="relative bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 py-20 overflow-hidden">
        {/* Scientific Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
        </div>
        
        <div className="container-scientific relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Icon Hero */}
            <div className="flex items-center justify-center gap-3 mb-8 animate-trust-entrance">
              <div className="trust-indicator-enhanced p-4 rounded-2xl">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-base-content mb-8 animate-trust-entrance--delayed text-balance">
              Expert-Wissen für 
              <span className="text-primary block lg:inline"> Tierliebhaber</span>
            </h1>
            
            {/* Scientific Value Proposition */}
            <p className="text-xl lg:text-2xl text-scientific max-w-4xl mx-auto mb-12 animate-trust-entrance--more-delayed">
              Wissenschaftlich fundierte Ratgeber von Veterinären und Experten für 
              <strong className="text-primary"> artgerechte Haustierhaltung</strong>, 
              Aquaristik und optimale Pflege Ihrer Liebsten.
            </p>

            {/* Search Integration */}
            <SearchBar initialSearch={search} />
          </div>
        </div>
      </section>

      <div className="container-scientific py-16">
        {/* ===== ADVANCED CATEGORY FILTER ===== */}
        <CategoryFilter categories={categories} activeCategory={category} />

        {/* ===== RESULTS HEADER ===== */}
        {hasFilters && (
          <div className="flex items-center justify-between mb-8 p-4 glass-card rounded-xl">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-primary" />
              <span className="font-medium">{resultsText}</span>
              {category && (
                <span className="authority-badge authority-badge--verified">
                  {category}
                </span>
              )}
              {search && (
                <span className="authority-badge authority-badge--expert">
                  "{search}"
                </span>
              )}
            </div>
            <Link href="/blog" className="btn btn-ghost btn-sm">
              Filter zurücksetzen
            </Link>
          </div>
        )}

        {/* ===== FEATURED ARTICLES (nur ohne Filter) ===== */}
        {!hasFilters && featured.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="trust-indicator-enhanced p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-scientific--heading">Empfohlene Artikel</h2>
              <span className="text-scientific--muted">Unsere besten und ausführlichsten Ratgeber</span>
            </div>
            
            <Suspense fallback={
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <BlogCardSkeleton featured />
                <BlogCardSkeleton />
              </div>
            }>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featured.map((post, index) => (
                  <BlogCard 
                    key={post.id} 
                    post={post} 
                    featured={index === 0}
                    priority={index < 3}
                  />
                ))}
              </div>
            </Suspense>
          </section>
        )}

        {/* ===== ALLE ARTIKEL / SUCHERGEBNISSE ===== */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="trust-indicator-enhanced p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-scientific--heading">
                {hasFilters ? 'Suchergebnisse' : 'Alle Artikel'}
              </h2>
              <span className="text-scientific--muted">
                {hasFilters 
                  ? `${totalPosts} ${totalPosts === 1 ? 'Treffer' : 'Treffer'} gefunden`
                  : 'Entdecken Sie unser vollständiges Archiv'
                }
              </span>
            </div>
          </div>
          
          <Suspense fallback={
            <div className="grid-scientific">
              {[...Array(6)].map((_, i) => <BlogCardSkeleton key={i} />)}
            </div>
          }>
            {recent.length > 0 ? (
              <div className="grid-scientific">
                {recent.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="glass-card p-12 rounded-2xl max-w-md mx-auto">
                  <Search className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-base-content mb-2">Keine Artikel gefunden</h3>
                  <p className="text-base-content/70 mb-4">
                    Für Ihre Suchkriterien konnten keine passenden Artikel gefunden werden.
                  </p>
                  <Link href="/blog" className="btn-scientific">
                    Alle Artikel anzeigen
                  </Link>
                </div>
              </div>
            )}
          </Suspense>

          {/* ===== PAGINATION ===== */}
          {hasMore && (
            <div className="flex justify-center mt-12">
              <Link
                href={`/blog?${new URLSearchParams({
                  ...(category && { category }),
                  ...(search && { search }),
                  page: (currentPage + 1).toString()
                })}`}
                className="btn-scientific--nature px-8 py-3 text-lg"
              >
                Mehr Artikel laden
                <ArrowUp className="w-5 h-5 ml-2 rotate-90" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

// ✅ ENHANCED Metadata für SEO + Structured Data
export const metadata = {
  title: 'Expert-Blog | TAILR.WIKI - Wissenschaftliche Haustier-Ratgeber',
  description: 'Wissenschaftlich fundierte Ratgeber von Veterinären für Aquaristik, Haustierpflege und artgerechte Haltung. Tierarzt-geprüfte Artikel für Hunde, Katzen, Fische und mehr.',
  keywords: 'Haustier Ratgeber, Tierarzt Tipps, Aquaristik, Hundepflege, Katzenpflege, wissenschaftlich fundiert, Veterinär, artgerechte Haltung',
  openGraph: {
    title: 'TAILR.WIKI Expert-Blog - Wissenschaftliche Haustier-Ratgeber',
    description: 'Entdecken Sie über 150+ wissenschaftlich fundierte Ratgeber von Veterinären und Experten für die optimale Pflege Ihrer Haustiere.',
    type: 'website',
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expert-Wissen für Tierliebhaber | TAILR.WIKI',
    description: 'Wissenschaftlich fundierte Haustier-Ratgeber von Experten'
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
  }
}
