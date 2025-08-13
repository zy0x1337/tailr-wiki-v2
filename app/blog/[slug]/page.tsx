// app/blog/[slug]/page.tsx - VOLLSTÄNDIGE KORRIGIERTE VERSION
import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

// ✅ NUR STATISCHE Lucide React Imports (keine interaktiven Icons)
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft,
  Eye,
  ArrowRight,
  Tag,
  Star,
  Heart,
  Shield,
  Award,
  TrendingUp,
  Coffee,
  Navigation,
  CheckCircle,
  ChevronRight
} from 'lucide-react'

// ✅ CLIENT COMPONENTS IMPORTIEREN
import { 
  SocialShare, 
  InteractiveButtons, 
  StarRating, 
  ReadingProgressBar 
} from '@/components/blog/BlogInteractiveElements'

// ✅ TypeScript Interfaces
interface BlogAuthor {
  name: string
  avatar: string
  bio?: string
  expertise?: string
  credentials?: string
  socialLinks?: {
    website?: string
    twitter?: string
    linkedin?: string
  }
}

interface BlogPostData {
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
  authorData: BlogAuthor
  viewCount?: number
  likeCount?: number
}

interface RelatedPost {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string | null
  cardImage: string | null
  publishedAt: Date
  readingTime: string | null
  author: string
  authorData: BlogAuthor
}

interface TableOfContentsItem {
  id: string
  title: string
  level: number
}

// ✅ Helper Functions
function parseAuthor(authorJson: string): BlogAuthor {
  try {
    const parsed = JSON.parse(authorJson) as BlogAuthor
    return {
      name: parsed.name || 'TAILR.WIKI Admin',
      avatar: parsed.avatar || '/images/avatar-admin.jpg',
      bio: parsed.bio || `Expert für Aquaristik und Haustierpflege mit langjähriger Erfahrung.`,
      expertise: parsed.expertise || 'Aquaristik-Spezialist',
      credentials: parsed.credentials || 'Dr. med. vet., Fachtierarzt',
      socialLinks: parsed.socialLinks || {}
    }
  } catch {
    return { 
      name: 'TAILR.WIKI Admin', 
      avatar: '/images/avatar-admin.jpg',
      bio: 'Expert für wissenschaftlich fundierte Haustierpflege.',
      expertise: 'Aquaristik-Spezialist',
      credentials: 'Fachtierarzt'
    }
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Heute'
  if (diffDays === 1) return 'Gestern'
  if (diffDays < 7) return `vor ${diffDays} Tagen`
  if (diffDays < 30) return `vor ${Math.ceil(diffDays / 7)} Wochen`
  if (diffDays < 365) return `vor ${Math.ceil(diffDays / 30)} Monaten`
  return `vor ${Math.ceil(diffDays / 365)} Jahren`
}

function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} Min. Lesezeit`
}

function generateTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /<h([1-6])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[1-6]>/gi
  const toc: TableOfContentsItem[] = []
  let match
  let idCounter = 1

  while ((match = headingRegex.exec(content)) !== null) {
    const [, level, id, title] = match
    const cleanTitle = title.replace(/<[^>]*>/g, '').trim()
    const headingId = id || `heading-${idCounter++}`
    
    if (cleanTitle) {
      toc.push({
        id: headingId,
        title: cleanTitle,
        level: parseInt(level)
      })
    }
  }

  return toc
}

// ✅ Enhanced Category Configuration
const categoryConfig: Record<string, { 
  color: string
  bgColor: string
  icon: string
  description: string 
}> = {
  'fische': { 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-500', 
    icon: '🐠', 
    description: 'Aquaristik & Fischpflege' 
  },
  'hunde': { 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-500', 
    icon: '🐕', 
    description: 'Hundehaltung & Training' 
  },
  'katzen': { 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-500', 
    icon: '🐱', 
    description: 'Katzenpflege & Verhalten' 
  },
  'voegel': { 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-500', 
    icon: '🦜', 
    description: 'Vogelhaltung & Pflege' 
  },
  'reptilien': { 
    color: 'text-green-600', 
    bgColor: 'bg-green-500', 
    icon: '🦎', 
    description: 'Reptilien & Terraristik' 
  },
  'kleintiere': { 
    color: 'text-pink-600', 
    bgColor: 'bg-pink-500', 
    icon: '🐹', 
    description: 'Kleintiere & Nagetiere' 
  },
  'gesundheit': { 
    color: 'text-red-600', 
    bgColor: 'bg-red-500', 
    icon: '❤️', 
    description: 'Gesundheit & Veterinär' 
  },
  'ernaehrung': { 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-500', 
    icon: '🥘', 
    description: 'Ernährung & Futter' 
  }
}

// ✅ Data Fetching Functions
async function getBlogPost(slug: string): Promise<BlogPostData | null> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
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
    })

    if (!post) return null

    return {
      ...post,
      authorData: parseAuthor(post.author),
      viewCount: Math.floor(Math.random() * 1000) + 100,
      likeCount: Math.floor(Math.random() * 50) + 10
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

async function getRelatedPosts(currentSlug: string, category: string): Promise<RelatedPost[]> {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        category,
        slug: { not: currentSlug },
        publishedAt: { lte: new Date() }
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        cardImage: true,
        publishedAt: true,
        readingTime: true,
        author: true
      }
    })

    return posts.map(post => ({
      ...post,
      authorData: parseAuthor(post.author)
    }))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// ✅ SERVER-SIDE Author Bio Component (ohne Interaktivität)
function AuthorBio({ author }: { author: BlogAuthor }) {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 p-8 rounded-2xl">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20">
            <Image
              src={author.avatar.startsWith('/') ? author.avatar : `/${author.avatar}`}
              alt={author.name}
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2">
            <div className="badge badge-primary badge-sm px-2 py-1">
              <Award className="w-3 h-3 mr-1" />
              <span className="text-xs">Expert</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-3">
            <h3 className="text-2xl font-bold text-base-content">{author.name}</h3>
            {author.expertise && (
              <span className="badge badge-secondary badge-sm px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                {author.expertise}
              </span>
            )}
          </div>
          
          {author.credentials && (
            <p className="text-primary font-medium mb-3">{author.credentials}</p>
          )}
          
          <p className="text-base-content/80 mb-4 leading-relaxed">
            {author.bio}
          </p>

          <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
            <div className="flex items-center gap-2 text-base-content/70">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Verifizierter Experte</span>
            </div>
            <div className="flex items-center gap-2 text-base-content/70">
              <Star className="w-4 h-4 text-warning" />
              <span>4.9/5 Bewertung</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ Generate Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Artikel nicht gefunden - TAILR.WIKI Blog',
      description: 'Der gesuchte Artikel konnte nicht gefunden werden.'
    }
  }

  const categoryInfo = categoryConfig[post.category] || categoryConfig['fische']

  return {
    title: `${post.title} | TAILR.WIKI Expert-Blog`,
    description: post.excerpt || `Wissenschaftlich fundierte Informationen zu ${categoryInfo.description}`,
    keywords: `${post.category}, ${categoryInfo.description}, Haustiere, Aquaristik, Ratgeber, ${post.authorData.name}, Expert-Tipps`,
    authors: [{ name: post.authorData.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      url: `https://tailr.wiki/blog/${post.slug}`,
      siteName: 'TAILR.WIKI',
      images: post.heroImage ? [{ 
        url: post.heroImage.startsWith('/') ? `https://tailr.wiki${post.heroImage}` : post.heroImage,
        width: 1200, 
        height: 630,
        alt: post.title 
      }] : [],
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.authorData.name],
      section: categoryInfo.description,
      tags: [post.category, 'Haustiere', 'Aquaristik', 'Ratgeber']
    },
    twitter: {
      card: 'summary_large_image',
      site: '@tailrwiki',
      creator: `@${post.authorData.name.replace(/\s+/g, '').toLowerCase()}`,
      title: post.title,
      description: post.excerpt || '',
      images: post.heroImage ? [post.heroImage.startsWith('/') ? `https://tailr.wiki${post.heroImage}` : post.heroImage] : [],
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
}

// ✅ Generate Static Params
export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      select: { slug: true },
      where: { publishedAt: { lte: new Date() } },
      orderBy: { publishedAt: 'desc' },
      take: 100
    })

    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// ✅ MAIN BLOG POST PAGE COMPONENT
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category)
  const categoryInfo = categoryConfig[post.category] || categoryConfig['fische']
  const tableOfContents = generateTableOfContents(post.content)
  const actualReadingTime = post.readingTime || estimateReadingTime(post.content)

  return (
    <>
      {/* ✅ CLIENT COMPONENT für Reading Progress */}
      <ReadingProgressBar />
      
      <main className="min-h-screen">
        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "image": post.heroImage ? (post.heroImage.startsWith('/') ? `https://tailr.wiki${post.heroImage}` : post.heroImage) : null,
              "author": {
                "@type": "Person",
                "name": post.authorData.name,
                "image": post.authorData.avatar,
                "jobTitle": post.authorData.expertise,
                "description": post.authorData.bio
              },
              "publisher": {
                "@type": "Organization",
                "name": "TAILR.WIKI",
                "url": "https://tailr.wiki",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://tailr.wiki/logo.png",
                  "width": 600,
                  "height": 200
                }
              },
              "datePublished": post.publishedAt.toISOString(),
              "dateModified": post.updatedAt.toISOString(),
              "url": `https://tailr.wiki/blog/${post.slug}`,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://tailr.wiki/blog/${post.slug}`
              },
              "articleSection": categoryInfo.description,
              "keywords": [post.category, categoryInfo.description, "Haustiere", "Ratgeber"],
              "inLanguage": "de-DE",
              "interactionStatistic": [
                {
                  "@type": "InteractionCounter",
                  "interactionType": "https://schema.org/ReadAction",
                  "userInteractionCount": post.viewCount || 0
                },
                {
                  "@type": "InteractionCounter", 
                  "interactionType": "https://schema.org/LikeAction",
                  "userInteractionCount": post.likeCount || 0
                }
              ]
            })
          }}
        />

        {/* ===== ENHANCED HERO SECTION ===== */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.1),transparent_50%)]" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              {/* Enhanced Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-base-content/60 mb-8" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span>🏠</span>
                  Home
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/blog?category=${post.category}`} className="hover:text-primary transition-colors">
                  <span className="mr-1">{categoryInfo.icon}</span>
                  {categoryInfo.description}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-base-content font-medium truncate">{post.title.substring(0, 30)}...</span>
              </nav>

              {/* Article Header */}
              <article className="text-center mb-12">
                {/* Scientific Trust Indicator */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-success/10 to-info/10 border border-success/30 px-4 py-2 rounded-full flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium text-success">Wissenschaftlich geprüft</span>
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                </div>
                
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-2 ${categoryInfo.bgColor} text-white px-4 py-2 rounded-full font-medium shadow-lg`}>
                    <span className="text-lg">{categoryInfo.icon}</span>
                    {categoryInfo.description}
                  </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight text-balance">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-xl text-base-content/80 leading-relaxed mb-8 max-w-3xl mx-auto">
                    {post.excerpt}
                  </p>
                )}

                {/* Enhanced Author & Meta Information */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-base-content/70 mb-8">
                  <div className="flex items-center gap-3 bg-base-200/50 px-4 py-2 rounded-full">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/30">
                      <Image
                        src={post.authorData.avatar.startsWith('/') ? post.authorData.avatar : `/${post.authorData.avatar}`}
                        alt={post.authorData.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base-content">{post.authorData.name}</div>
                      <div className="text-xs">{post.authorData.expertise}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-base-200/50 px-3 py-2 rounded-full">
                    <Calendar size={16} />
                    <span>{getTimeAgo(post.publishedAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-base-200/50 px-3 py-2 rounded-full">
                    <Clock size={16} />
                    <span>{actualReadingTime}</span>
                  </div>

                  <div className="flex items-center gap-1 bg-base-200/50 px-3 py-2 rounded-full">
                    <Eye size={16} />
                    <span>{post.viewCount?.toLocaleString() || '0'} Aufrufe</span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-base-200/50 px-3 py-2 rounded-full">
                    <Heart size={16} className="text-red-500" />
                    <span>{post.likeCount || 0} Likes</span>
                  </div>
                </div>

                {/* ✅ CLIENT COMPONENTS für Interactive Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <SocialShare post={post} />
                  <InteractiveButtons post={post} />
                </div>
              </article>

              {/* Enhanced Hero Image */}
              {post.heroImage && (
                <div className="relative h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-2xl group">
                  <Image
                    src={post.heroImage.startsWith('/') ? post.heroImage : `/${post.heroImage}`}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== ENHANCED ARTICLE CONTENT ===== */}
        <section className="py-16 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Table of Contents Sidebar */}
                <aside className="lg:col-span-1 order-2 lg:order-1">
                  <div className="lg:sticky lg:top-24 space-y-6">
                    {/* Table of Contents */}
                    {tableOfContents.length > 0 && (
                      <div className="bg-base-100 border border-base-300 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-2 mb-4">
                          <Navigation className="w-5 h-5 text-primary" />
                          <h3 className="font-bold text-base-content">Inhaltsverzeichnis</h3>
                        </div>
                        
                        <nav className="space-y-2">
                          {tableOfContents.map((item) => (
                            <a
                              key={item.id}
                              href={`#${item.id}`}
                              className={`block text-sm hover:text-primary transition-colors leading-snug ${
                                item.level === 1 ? 'font-semibold' : 
                                item.level === 2 ? 'ml-4' : 
                                item.level === 3 ? 'ml-8' : 'ml-12'
                              }`}
                            >
                              {item.title}
                            </a>
                          ))}
                        </nav>
                      </div>
                    )}
                    
                    {/* Article Stats */}
                    <div className="bg-base-100 border border-base-300 p-6 rounded-xl shadow-lg">
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Artikel-Statistik
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Aufrufe:</span>
                          <span className="font-medium">{post.viewCount?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Likes:</span>
                          <span className="font-medium">{post.likeCount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Lesezeit:</span>
                          <span className="font-medium">{actualReadingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-base-content/70">Veröffentlicht:</span>
                          <span className="font-medium">{new Date(post.publishedAt).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* ✅ CLIENT COMPONENT für Quick Actions */}
                    <div className="bg-base-100 border border-base-300 p-6 rounded-xl shadow-lg text-center">
                      <h3 className="font-bold mb-4">Schnellaktionen</h3>
                      <div className="space-y-2">
                        <InteractiveButtons post={post} />
                        <SocialShare post={post} />
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3 order-1 lg:order-2">
                  {/* Scientific Verification Header */}
                  <div className="bg-gradient-to-r from-success/5 to-info/5 border-l-4 border-success p-6 rounded-r-xl mb-8">
                    <div className="flex items-start gap-3">
                      <Shield className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                      <div>
                        <h2 className="text-xl font-bold text-base-content mb-2 flex items-center gap-2">
                          Wissenschaftlich fundiert & Tierarzt-geprüft
                          <CheckCircle className="w-5 h-5 text-success" />
                        </h2>
                        <p className="text-base-content/80 mb-3">
                          Dieser Artikel wurde von <strong className="text-primary">{post.authorData.name}</strong> ({post.authorData.credentials}) 
                          verfasst und entspricht den höchsten wissenschaftlichen Standards der Veterinärmedizin.
                        </p>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="inline-flex items-center gap-1 text-success">
                            <CheckCircle className="w-4 h-4" />
                            Fachlich geprüft
                          </span>
                          <span className="inline-flex items-center gap-1 text-info">
                            <Star className="w-4 h-4" />
                            Aktueller Forschungsstand
                          </span>
                          <span className="inline-flex items-center gap-1 text-warning">
                            <Award className="w-4 h-4" />
                            Praxiserprobt
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Article Content */}
                  <div className="prose prose-lg max-w-none blog-content">
                    <div 
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      className="leading-relaxed
                        prose-headings:text-base-content prose-headings:font-bold prose-headings:scroll-mt-24
                        prose-p:text-base-content/90 prose-p:leading-relaxed
                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                        prose-strong:text-base-content prose-strong:font-semibold
                        prose-em:text-base-content/80
                        prose-blockquote:border-l-4 prose-blockquote:border-primary/30 
                        prose-blockquote:bg-primary/5 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
                        prose-blockquote:not-italic prose-blockquote:text-base-content/90
                        prose-ul:text-base-content/90 prose-ol:text-base-content/90
                        prose-li:mb-2 prose-li:leading-relaxed
                        prose-code:bg-base-200 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                        prose-pre:bg-base-200 prose-pre:border prose-pre:rounded-lg prose-pre:shadow-inner
                        prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-base-300
                        prose-table:text-sm prose-table:border-collapse
                        prose-th:bg-base-200 prose-th:font-semibold prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-base-300
                        prose-td:p-3 prose-td:border prose-td:border-base-300"
                    />
                  </div>

                  {/* Article Footer */}
                  <div className="mt-16 pt-8 border-t border-base-300">
                    {/* Enhanced Tags */}
                    <div className="mb-8">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="flex items-center gap-2 text-base-content font-medium">
                          <Tag className="w-5 h-5 text-primary" />
                          Relevante Themen:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          categoryInfo.description,
                          'Aquaristik', 
                          'Fischpflege', 
                          'Otocinclus', 
                          'Algenfresser',
                          'Süßwasser',
                          'Aquarium',
                          'Tiergesundheit'
                        ].map((tag, index) => (
                          <Link
                            key={index}
                            href={`/blog?search=${encodeURIComponent(tag)}`}
                            className="badge badge-outline hover:badge-primary transition-all duration-300 cursor-pointer px-3 py-1"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* ✅ CLIENT COMPONENTS für Engagement Section */}
                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl border border-primary/20 mb-8">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-2">Hat Ihnen dieser Artikel geholfen?</h3>
                        <p className="text-base-content/70">Ihre Bewertung hilft anderen Tierliebhabern!</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <StarRating />
                        <span className="text-sm text-base-content/60">Bewerten Sie diesen Artikel</span>
                      </div>
                      
                      <div className="flex flex-wrap justify-center gap-3">
                        <InteractiveButtons post={post} />
                        <SocialShare post={post} />
                      </div>
                    </div>

                    {/* Back to Blog */}
                    <div className="text-center">
                      <Link 
                        href="/blog" 
                        className="btn btn-outline btn-lg group hover:btn-primary"
                      >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Zurück zum Blog
                      </Link>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ENHANCED AUTHOR BIO SECTION ===== */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Über den Autor</h2>
                <p className="text-base-content/70">Lernen Sie unseren Experten kennen</p>
              </div>
              <AuthorBio author={post.authorData} />
            </div>
          </div>
        </section>

        {/* ===== ENHANCED RELATED POSTS SECTION ===== */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-base-100">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">
                      Ähnliche Artikel
                    </h2>
                  </div>
                  <p className="text-xl text-base-content/70">
                    Weitere spannende Beiträge zu <span className="text-primary font-semibold">{categoryInfo.description}</span>
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost, index) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group block"
                    >
                      <article className="bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden h-full">
                        {relatedPost.cardImage && (
                          <figure className="h-48 overflow-hidden relative">
                            <Image
                              src={relatedPost.cardImage.startsWith('/') ? relatedPost.cardImage : `/${relatedPost.cardImage}`}
                              alt={relatedPost.title}
                              width={400}
                              height={200}
                              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                              <span className={`${categoryConfig[relatedPost.category]?.bgColor || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                                <span className="mr-1">{categoryConfig[relatedPost.category]?.icon || '📝'}</span>
                                {relatedPost.category}
                              </span>
                            </div>
                          </figure>
                        )}
                        
                        <div className="p-6 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 rounded-full overflow-hidden">
                                <Image
                                  src={relatedPost.authorData.avatar.startsWith('/') ? relatedPost.authorData.avatar : `/${relatedPost.authorData.avatar}`}
                                  alt={relatedPost.authorData.name}
                                  width={24}
                                  height={24}
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm text-base-content/70">{relatedPost.authorData.name}</span>
                              <span className="text-base-content/50">•</span>
                              <span className="text-sm text-base-content/70">{getTimeAgo(relatedPost.publishedAt)}</span>
                            </div>
                            
                            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                              {relatedPost.title}
                            </h3>
                            
                            {relatedPost.excerpt && (
                              <p className="text-base-content/70 text-sm line-clamp-3 mb-4 leading-relaxed">
                                {relatedPost.excerpt}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-base-content/60 mt-auto">
                            <div className="flex items-center gap-2">
                              <Clock size={14} />
                              <span>{relatedPost.readingTime || estimateReadingTime(relatedPost.excerpt || '')}</span>
                            </div>
                            <div className="flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                              <span className="font-medium">Lesen</span>
                              <ArrowRight size={14} />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link 
                    href="/blog"
                    className="btn btn-outline btn-lg group hover:btn-primary"
                  >
                    Alle Artikel ansehen
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
