// app/blog/page.tsx - TAILR.WIKI Blog mit echten Prisma-Daten
import { Suspense } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Search,
  Filter,
  Heart,
  Star,
  BookOpen,
  Shield,
  TrendingUp,
  Eye,
  MessageCircle,
  Tag,
  Grid
} from 'lucide-react'

// ✅ SEO-Optimized Metadata
export const metadata: Metadata = {
  title: 'TAILR.WIKI Blog - Wissenschaftlicher Haustier-Ratgeber | Expert-Tipps',
  description: 'Wissenschaftlich fundierte Haustier-Ratgeber von Veterinär-Experten. Aquaristik, Pflege, Gesundheit, Verhalten und Training für Fische, Hunde, Katzen und mehr.',
  keywords: 'Haustier Blog, Aquaristik, Otocinclus, Kampffisch, Betta, Tiergesundheit, Aquarium Guide',
  openGraph: {
    title: 'TAILR.WIKI Blog - Wissenschaftlicher Haustier-Ratgeber',
    description: 'Expert-Tipps für Haustierhalter: Aquaristik, Gesundheit, Pflege und mehr.',
    url: 'https://tailr.wiki/blog',
    images: [{ url: '/blog-og-image.jpg', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

// ✅ TypeScript Interfaces
interface BlogAuthor {
  name: string
  avatar: string
}

interface BlogPost {
  id: number
  title: string
  slug: string
  category: string
  content: string
  excerpt: string | null
  author: string
  readingTime: string | null
  cardImage: string | null
  heroImage: string | null
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
  authorData?: BlogAuthor
  featured?: boolean
}

interface BlogCategory {
  category: string
  count: number
  color: string
  description: string
  icon: string
}

// ✅ Helper Functions
function parseAuthor(authorJson: string): BlogAuthor {
  try {
    return JSON.parse(authorJson) as BlogAuthor
  } catch {
    return { name: 'TAILR.WIKI Admin', avatar: 'images/avatar-admin.jpg' }
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

// ✅ Category Configuration
const categoryConfig: Record<string, { color: string; description: string; icon: string }> = {
  'fische': { 
    color: 'bg-blue-500', 
    description: 'Aquaristik und Fischhaltung',
    icon: '🐠'
  },
  'hunde': { 
    color: 'bg-amber-500', 
    description: 'Hundehaltung und -training',
    icon: '🐕'
  },
  'katzen': { 
    color: 'bg-purple-500', 
    description: 'Katzenpflege und Verhalten',
    icon: '🐱'
  },
  'voegel': { 
    color: 'bg-yellow-500', 
    description: 'Vogelhaltung und -pflege',
    icon: '🦜'
  },
  'reptilien': { 
    color: 'bg-green-500', 
    description: 'Reptilienhaltung',
    icon: '🦎'
  },
  'kleintiere': { 
    color: 'bg-pink-500', 
    description: 'Nager und Kleintiere',
    icon: '🐹'
  }
}

// ✅ Data Fetching
async function getBlogData() {
  try {
    const [posts, categoryStats, totalPosts] = await Promise.all([
      prisma.blogPost.findMany({
        orderBy: [
          { publishedAt: 'desc' }
        ],
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          content: true,
          excerpt: true,
          author: true,
          readingTime: true,
          cardImage: true,
          heroImage: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      
      prisma.blogPost.groupBy({
        by: ['category'],
        _count: {
          category: true
        }
      }),
      
      prisma.blogPost.count()
    ])

    const processedPosts: BlogPost[] = posts.map(post => ({
      ...post,
      authorData: parseAuthor(post.author),
      featured: post.id <= 2
    }))

    const processedCategories: BlogCategory[] = categoryStats.map(stat => {
      const config = categoryConfig[stat.category] || categoryConfig['fische']
      return {
        category: stat.category,
        count: stat._count.category,
        color: config.color,
        description: config.description,
        icon: config.icon
      }
    })

    return {
      posts: processedPosts,
      categories: processedCategories,
      totalPosts,
      featuredPosts: processedPosts.filter(post => post.featured),
      recentPosts: processedPosts.slice(0, 6)
    }
  } catch (error) {
    console.error('Blog data loading error:', error)
    throw error
  }
}

// ✅ Loading Skeletons
function BlogPostSkeleton() {
  return (
    <div className="card bg-base-100 shadow-lg border border-base-300 animate-pulse">
      <figure className="h-48 bg-base-300"></figure>
      <div className="card-body p-6">
        <div className="h-4 bg-primary/20 rounded-full w-20 mb-3"></div>
        <div className="h-6 bg-base-300 rounded mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-base-300 rounded"></div>
          <div className="h-4 bg-base-300 rounded w-4/5"></div>
          <div className="h-4 bg-base-300 rounded w-3/5"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-base-300 rounded-full"></div>
            <div className="h-4 bg-base-300 rounded w-24"></div>
          </div>
          <div className="h-8 bg-base-300 rounded w-20"></div>
        </div>
      </div>
    </div>
  )
}

// ✅ Featured Post Component
function FeaturedPost({ post }: { post: BlogPost }) {
  const categoryInfo = categoryConfig[post.category] || categoryConfig['fische']
  
  return (
    <div className="relative group overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 p-1">
      <div className="card bg-base-100 shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden h-full">
        <div className="absolute top-4 left-4 z-20">
          <span className="badge badge-primary font-semibold">
            <Star size={12} className="mr-1" />
            Featured
          </span>
        </div>
        
        <figure className="relative h-64 md:h-80 overflow-hidden">
          <Image
            src={post.cardImage?.startsWith('/') ? post.cardImage : `/${post.cardImage}` || '/placeholder-blog.jpg'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className={`badge ${categoryInfo.color} text-white border-none`}>
                <span className="mr-1">{categoryInfo.icon}</span>
                {post.category}
              </span>
              <span className="text-xs opacity-80 flex items-center gap-1">
                <Clock size={12} />
                {post.readingTime || '5 Min.'}
              </span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold leading-tight mb-2 line-clamp-2">
              {post.title}
            </h2>
            
            <div className="flex items-center gap-4 text-xs opacity-90">
              <div className="flex items-center gap-1">
                <User size={12} />
                {post.authorData?.name}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {getTimeAgo(post.publishedAt)}
              </div>
            </div>
          </div>
        </figure>
        
        <div className="card-body p-6">
          <p className="text-base-content/80 line-clamp-3 mb-4">
            {post.excerpt || 'Entdecken Sie wissenschaftlich fundierte Informationen und Expert-Tipps.'}
          </p>
          
          <div className="card-actions justify-end">
            <Link 
              href={`/blog/${post.slug}`}
              className="btn btn-primary btn-sm group/btn"
            >
              Artikel lesen
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Regular Post Component
function BlogPostCard({ post }: { post: BlogPost }) {
  const categoryInfo = categoryConfig[post.category] || categoryConfig['fische']
  
  return (
    <div className="group relative">
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-base-300 hover:border-primary/30 group-hover:scale-105">
        <figure className="relative h-48 overflow-hidden">
          <Image
            src={post.cardImage?.startsWith('/') ? post.cardImage : `/${post.cardImage}` || '/placeholder-blog.jpg'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <span className={`badge ${categoryInfo.color} text-white border-none text-xs`}>
              <span className="mr-1">{categoryInfo.icon}</span>
              {post.category}
            </span>
          </div>
        </figure>
        
        <div className="card-body p-6">
          <h3 className="card-title text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <p className="text-base-content/70 text-sm line-clamp-3 mb-4">
            {post.excerpt || 'Wissenschaftlich fundierte Informationen und Expert-Tipps für Tierliebhaber.'}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-base-content/60 mb-4">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-base-300 overflow-hidden">
                <Image
                  src={post.authorData?.avatar?.startsWith('/') ? post.authorData.avatar : `/${post.authorData?.avatar}` || '/images/avatar-admin.jpg'}
                  alt={post.authorData?.name || 'Admin'}
                  width={16}
                  height={16}
                  className="object-cover"
                />
              </div>
              {post.authorData?.name}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {post.readingTime || '5 Min.'}
            </div>
          </div>
          
          <div className="card-actions justify-between items-center">
            <div className="text-xs text-base-content/50">
              {getTimeAgo(post.publishedAt)}
            </div>
            
            <Link 
              href={`/blog/${post.slug}`}
              className="btn btn-outline btn-sm group/btn"
            >
              Lesen
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Main Blog Page Component
export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-base-200 animate-pulse">
        <div className="hero min-h-[50vh] bg-base-300"></div>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogPostSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  )
}

// ✅ Blog Content Component
async function BlogContent() {
  const { posts, categories, featuredPosts } = await getBlogData()

  return (
    <main className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "TAILR.WIKI Blog",
            "description": "Wissenschaftlich fundierte Haustier-Ratgeber",
            "url": "https://tailr.wiki/blog",
            "publisher": {
              "@type": "Organization",
              "name": "TAILR.WIKI",
              "url": "https://tailr.wiki"
            }
          })
        }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(14,165,233,0.1),transparent)]"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen size={16} />
              Wissenschaftlicher Haustier-Ratgeber
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Expert-Wissen für 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Tierliebhaber</span>
            </h1>
            
            <p className="text-xl text-base-content/80 mb-8 leading-relaxed">
              Wissenschaftlich fundierte Ratgeber von Experten für Aquaristik, 
              Haustierpflege und artgerechte Haltung Ihrer Liebsten.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="relative">
                <input 
                  type="search" 
                  placeholder="Blog durchsuchen..." 
                  className="input input-lg pl-12 pr-4 bg-base-100 border-2 border-base-300 focus:border-primary w-full sm:w-80"
                />
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <button className="btn btn-primary btn-sm">
                <Grid size={16} />
                Alle Artikel
              </button>
              {categories.map((category, index) => (
                <button 
                  key={index}
                  className="btn btn-outline btn-sm hover:scale-105 transition-transform"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.category} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED POSTS SECTION ===== */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Empfohlene Artikel
              </h2>
              <p className="text-xl text-base-content/70">
                Unsere besten und ausführlichsten Ratgeber
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== ALL POSTS SECTION ===== */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Alle Artikel
            </h2>
            <p className="text-xl text-base-content/70">
              Entdecken Sie unser vollständiges Archiv
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER CTA ===== */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Verpassen Sie keine Expert-Tipps
            </h2>
            <p className="text-lg text-base-content/80 mb-8">
              Erhalten Sie die neuesten Ratgeber und Pflegetipps direkt in Ihr Postfach
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Ihre E-Mail-Adresse" 
                className="input input-lg flex-1 max-w-sm"
              />
              <button className="btn btn-primary btn-lg">
                Newsletter abonnieren
              </button>
            </div>
            <p className="text-sm text-base-content/60 mt-4">
              Kostenlos • Jederzeit abbestellbar • Datenschutz garantiert
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
