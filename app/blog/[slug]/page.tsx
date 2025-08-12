// app/blog/[slug]/page.tsx - Individual Blog Post Page - Vollständig
import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft,
  Share2,
  Bookmark,
  Eye,
  MessageCircle,
  ThumbsUp,
  ArrowRight,
  Tag,
  Star,
  Heart
} from 'lucide-react'

// ✅ TypeScript Interfaces
interface BlogAuthor {
  name: string
  avatar: string
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
const categoryConfig: Record<string, { color: string; icon: string }> = {
  'fische': { color: 'bg-blue-500', icon: '🐠' },
  'hunde': { color: 'bg-amber-500', icon: '🐕' },
  'katzen': { color: 'bg-purple-500', icon: '🐱' },
  'voegel': { color: 'bg-yellow-500', icon: '🦜' },
  'reptilien': { color: 'bg-green-500', icon: '🦎' },
  'kleintiere': { color: 'bg-pink-500', icon: '🐹' }
}

// ✅ Data Fetching
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
      authorData: parseAuthor(post.author)
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
        slug: { not: currentSlug }
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

// ✅ Generate Metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Artikel nicht gefunden - TAILR.WIKI Blog',
      description: 'Der gesuchte Artikel konnte nicht gefunden werden.'
    }
  }

  return {
    title: `${post.title} - TAILR.WIKI Blog`,
    description: post.excerpt || `Wissenschaftlich fundierte Informationen zu ${post.category}`,
    keywords: `${post.category}, Haustiere, Aquaristik, Ratgeber, Expert-Tipps`,
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      url: `https://tailr.wiki/blog/${post.slug}`,
      images: post.heroImage ? [{ 
        url: post.heroImage, 
        width: 1200, 
        height: 630,
        alt: post.title 
      }] : [],
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.authorData.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      images: post.heroImage ? [post.heroImage] : [],
    },
  }
}

// ✅ Generate Static Params für bessere Performance
export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      select: { slug: true },
      take: 100 // Limit für Build-Performance
    })

    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// ✅ Loading Component
function BlogPostSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Skeleton */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-4 bg-base-300 rounded w-80 mb-8"></div>
            <div className="h-6 bg-primary/20 rounded-full w-20 mb-4"></div>
            <div className="h-16 bg-base-300 rounded-2xl w-full mb-6"></div>
            <div className="h-6 bg-base-300 rounded w-full mb-4"></div>
            <div className="h-6 bg-base-300 rounded w-3/4 mb-8"></div>
            <div className="flex gap-6 justify-center">
              <div className="h-4 bg-base-300 rounded w-24"></div>
              <div className="h-4 bg-base-300 rounded w-20"></div>
              <div className="h-4 bg-base-300 rounded w-16"></div>
            </div>
            <div className="h-64 bg-base-300 rounded-2xl mt-12"></div>
          </div>
        </div>
      </section>
      
      {/* Content Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-base-300 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ✅ Main Component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category)
  const categoryInfo = categoryConfig[post.category] || categoryConfig['fische']

  return (
    <main className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.heroImage,
            "author": {
              "@type": "Person",
              "name": post.authorData.name,
              "image": post.authorData.avatar
            },
            "publisher": {
              "@type": "Organization",
              "name": "TAILR.WIKI",
              "url": "https://tailr.wiki",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tailr.wiki/logo.png"
              }
            },
            "datePublished": post.publishedAt.toISOString(),
            "dateModified": post.updatedAt.toISOString(),
            "url": `https://tailr.wiki/blog/${post.slug}`,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://tailr.wiki/blog/${post.slug}`
            }
          })
        }}
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-base-content/60 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-base-content">{post.category}</span>
            </nav>

            {/* Article Header */}
            <article className="text-center mb-12">
              <div className="mb-4">
                <span className={`badge ${categoryInfo.color} text-white border-none`}>
                  <span className="mr-1">{categoryInfo.icon}</span>
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-base-content/80 leading-relaxed mb-8 max-w-3xl mx-auto">
                  {post.excerpt}
                </p>
              )}

              {/* Author & Meta Information */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-base-content/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={post.authorData.avatar.startsWith('/') ? post.authorData.avatar : `/${post.authorData.avatar}`}
                      alt={post.authorData.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium">{post.authorData.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{getTimeAgo(post.publishedAt)}</span>
                </div>
                
                {post.readingTime && (
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>{post.readingTime}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  <span>1.2k Aufrufe</span>
                </div>
              </div>
            </article>

            {/* Hero Image */}
            {post.heroImage && (
              <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-2xl">
                <Image
                  src={post.heroImage.startsWith('/') ? post.heroImage : `/${post.heroImage}`}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== ARTICLE CONTENT ===== */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Social Share Buttons - Sticky */}
            <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
              <div className="flex flex-col gap-3 bg-base-100 p-3 rounded-2xl shadow-lg border border-base-300">
                <button className="btn btn-circle btn-sm btn-ghost hover:btn-primary group">
                  <ThumbsUp size={16} className="group-hover:scale-110 transition-transform" />
                </button>
                <button className="btn btn-circle btn-sm btn-ghost hover:btn-secondary group">
                  <Share2 size={16} className="group-hover:scale-110 transition-transform" />
                </button>
                <button className="btn btn-circle btn-sm btn-ghost hover:btn-accent group">
                  <Bookmark size={16} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none blog-content">
              <div 
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="leading-relaxed"
              />
            </div>

            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-base-300">
              {/* Tags */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1 text-sm font-medium text-base-content/70 mr-2">
                    <Tag size={16} />
                    Tags:
                  </span>
                  {['Aquaristik', 'Fischpflege', 'Otocinclus', 'Algenfresser'].map((tag, index) => (
                    <span key={index} className="badge badge-outline hover:badge-primary transition-colors cursor-pointer">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-base-200 p-6 rounded-2xl">
                <div>
                  <h3 className="font-semibold mb-2">Hat Ihnen dieser Artikel gefallen?</h3>
                  <p className="text-sm text-base-content/70">Teilen Sie ihn mit anderen Tierliebhabern!</p>
                </div>
                
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-sm hover:btn-primary">
                    <ThumbsUp size={16} />
                    Gefällt mir
                  </button>
                  <button className="btn btn-outline btn-sm hover:btn-secondary">
                    <Share2 size={16} />
                    Teilen
                  </button>
                  <button className="btn btn-outline btn-sm hover:btn-accent">
                    <Bookmark size={16} />
                    Merken
                  </button>
                </div>
              </div>

              {/* Back to Blog */}
              <div className="mt-8 text-center">
                <Link 
                  href="/blog" 
                  className="btn btn-outline btn-lg group hover:btn-primary"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Zurück zum Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== AUTHOR BIO SECTION ===== */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-lg p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post.authorData.avatar.startsWith('/') ? post.authorData.avatar : `/${post.authorData.avatar}`}
                    alt={post.authorData.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">{post.authorData.name}</h3>
                  <p className="text-base-content/70 mb-4">
                    Expert für Aquaristik und Fischpflege mit über 10 Jahren Erfahrung. 
                    Spezialisiert auf die artgerechte Haltung von Süßwasserfischen und Aquascaping.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="stat">
                      <div className="stat-value text-sm">24</div>
                      <div className="stat-desc">Artikel</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value text-sm">10+</div>
                      <div className="stat-desc">Jahre Erfahrung</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value text-sm">5.2k</div>
                      <div className="stat-desc">Follower</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RELATED POSTS SECTION ===== */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ähnliche Artikel
                </h2>
                <p className="text-xl text-base-content/70">
                  Weitere spannende Beiträge zu {post.category}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
                  >
                    {relatedPost.cardImage && (
                      <figure className="h-48 overflow-hidden">
                        <Image
                          src={relatedPost.cardImage.startsWith('/') ? relatedPost.cardImage : `/${relatedPost.cardImage}`}
                          alt={relatedPost.title}
                          width={400}
                          height={200}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </figure>
                    )}
                    
                    <div className="card-body p-6">
                      <div className="mb-2">
                        <span className={`badge ${categoryConfig[relatedPost.category]?.color || 'bg-gray-500'} text-white border-none text-xs`}>
                          {relatedPost.category}
                        </span>
                      </div>
                      
                      <h3 className="card-title text-lg line-clamp-2 group-hover:text-primary transition-colors mb-3">
                        {relatedPost.title}
                      </h3>
                      
                      {relatedPost.excerpt && (
                        <p className="text-base-content/70 text-sm line-clamp-3 mb-4">
                          {relatedPost.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-base-content/60">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-base-300 overflow-hidden">
                            <Image
                              src={relatedPost.authorData.avatar.startsWith('/') ? relatedPost.authorData.avatar : `/${relatedPost.authorData.avatar}`}
                              alt={relatedPost.authorData.name}
                              width={16}
                              height={16}
                              className="object-cover"
                            />
                          </div>
                          <span>{relatedPost.authorData.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span>{getTimeAgo(relatedPost.publishedAt)}</span>
                          {relatedPost.readingTime && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {relatedPost.readingTime}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
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

      {/* ===== NEWSLETTER CTA ===== */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Verpassen Sie keine neuen Artikel
            </h2>
            <p className="text-lg text-base-content/80 mb-8">
              Erhalten Sie die neuesten Expert-Tipps und Ratgeber direkt in Ihr Postfach
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
