// app/page.tsx

import Image from 'next/image'
import Link from 'next/link'
import CategoryImage from '@/components/ui/CategoryImage'
import { prisma } from '@/lib/prisma'
import { Suspense } from 'react'
import { FeatureIcons, TrustIcons, StatsIcons, NavigationIcons, Icon } from '@/lib/icons'
import { ArrowRight } from 'lucide-react'

async function StatsSection() {
  const [totalPets, totalCategories, totalBlogPosts] = await Promise.all([
    prisma.pet.count(),
    prisma.category.count(),
    prisma.blogPost.count()
  ])

  return (
    <section className="py-3 lg:py-4">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          
          {/* ✅ STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
            {[
              { 
                value: totalPets.toLocaleString(), 
                label: "Tiere", 
                icon: StatsIcons.Pets,
                iconColorClass: "text-cyan-600 dark:text-cyan-400",
              },
              { 
                value: totalCategories, 
                label: "Kategorien", 
                icon: StatsIcons.Categories,
                iconColorClass: "text-blue-600 dark:text-blue-400", 
              },
              { 
                value: totalBlogPosts, 
                label: "Artikel", 
                icon: StatsIcons.Articles,
                iconColorClass: "text-indigo-600 dark:text-indigo-400",
              }
            ].map((stat, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-xl bg-base-100/60 dark:bg-base-100/5 backdrop-blur-md border border-base-300/30 dark:border-base-700/20 p-4 text-center hover:bg-base-100/80 dark:hover:bg-base-100/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Card Content */}
                <div className="relative">
                  
                  {/* ✅ ICON CONTAINER - EXAKT WIE WHY SECTION */}
                  <div className="flex justify-center mb-3">
                    <div className="relative p-2.5 rounded-xl bg-base-100/90 dark:bg-base-800/70 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 border border-white/20 dark:border-white/10">
                      {/* ✅ IDENTISCH MIT WHY SECTION: bg-base-100/90 dark:bg-base-800/70 */}
                      <Icon 
                        icon={stat.icon} 
                        size={20}
                        className={`${stat.iconColorClass} group-hover:scale-110 transition-transform duration-300`} 
                      />
                    </div>
                  </div>
                  
                  {/* Werte */}
                  <div className="mb-2">
                    <div className="text-xl lg:text-2xl font-bold text-base-content dark:text-base-content group-hover:scale-105 transition-transform duration-300 leading-none">
                      {stat.value}
                    </div>
                  </div>
                  
                  {/* Labels */}
                  <div className="text-xs lg:text-sm text-base-content/70 dark:text-base-content/60 font-medium">
                    {stat.label}
                  </div>

                  {/* Progress Dots */}
                  <div className="flex justify-center gap-1 mt-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-0.5 h-0.5 rounded-full transition-all duration-300 ${
                          stat.iconColorClass.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')
                        }`}
                        style={{ 
                          animationDelay: `${i * 100}ms`,
                          opacity: '0.6'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Live Status - unverändert */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-base-100/60 dark:bg-base-100/5 backdrop-blur-md border border-base-300/30 dark:border-base-700/20 hover:bg-base-100/80 dark:hover:bg-base-100/10 transition-all duration-300">
              
              {/* Live Indicators */}
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
              </div>
              
              <span className="text-xs text-base-content/70 dark:text-base-content/60 font-medium">
                Live-Daten
              </span>
              
              {/* Trust Indicator */}
              <div className="hidden sm:flex items-center gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Aktuell
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ✅ OPTIMIERTE CATEGORIESSECTION mit responsiven Bildgrößen
async function CategoriesSection() {
  const categories = await prisma.category.findMany({
    include: { 
      _count: { select: { pets: true } }
    },
    orderBy: { name: 'asc' }
  })

  const sortedCategories = categories.sort((a, b) => {
    const countA = a._count.pets
    const countB = b._count.pets
    if (countB !== countA) return countB - countA
    return a.name.localeCompare(b.name)
  })

  return (
    <section className="py-4 lg:py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="text-lg lg:text-xl font-bold mb-2">
            Entdecken Sie unsere Tierkategorien
          </h2>
          <p className="text-xs lg:text-sm text-base-content/60 dark:text-base-content/50 max-w-lg mx-auto">
            Von Hunden und Katzen bis hin zu Vögeln, Fischen und Reptilien
          </p>
        </div>
        
        {/* Grid mit größeren Bildern */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
          {sortedCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/${category.id}`}
              className="group relative overflow-hidden bg-base-100 dark:bg-base-100/5 backdrop-blur-sm border border-base-300/20 dark:border-base-700/20 rounded-xl p-3 lg:p-4 text-center hover:bg-base-200/50 dark:hover:bg-base-800/30 hover:shadow-md hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              <div className="relative">
                {/* Größere Image Container */}
                <div className="mb-3 flex justify-center">
                  <div className="p-1.5 rounded-lg bg-base-200/80 dark:bg-base-800/50 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                    <CategoryImage
                      src={category.image || ''}
                      alt={category.name}
                      fallbackEmoji="🐾"
                      size={196}
                      className="rounded-md"
                      priority={index < 6}
                    />
                  </div>
                </div>
                
                {/* Category Name */}
                <h3 className="font-medium text-xs lg:text-sm mb-2 line-clamp-1 text-base-content/90 dark:text-base-content/80 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>
                
                {/* Count Badge */}
                <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary border border-primary/20 dark:border-primary/30 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                  {category._count.pets}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-6">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-primary dark:hover:text-primary transition-colors duration-200 group"
          >
            <span>Alle Kategorien anzeigen</span>
            <Icon 
      icon={NavigationIcons.ChevronRight} 
      size={14} 
      className="group-hover:translate-x-0.5 transition-transform duration-200" 
    />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ✅ SCIENTIFIC BLOG SECTION - Korrekte Bildpfade aus public/images/blog/
async function RecentBlogSection() {
  const recentPosts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      heroImage: true,
      cardImage: true,
      publishedAt: true,
      author: true,
      category: true
    }
  })

  const publishedPosts = recentPosts.filter(post => post.publishedAt !== null)

  // ✅ HELPER FUNCTION für korrekte Bildpfade
  const getBlogImagePath = (imagePath: string | null): string => {
    if (!imagePath) return '/images/blog/placeholder-blog.jpg'
    
    // Wenn der Pfad bereits mit / beginnt, verwenden wir ihn direkt
    if (imagePath.startsWith('/')) return imagePath
    
    // Ansonsten fügen wir den korrekten Pfad hinzu
    return `/images/blog/${imagePath}`
  }

  return (
    <section className="py-4 lg:py-6">
      <div className="container mx-auto px-4">
        {/* Scientific Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg lg:text-xl font-bold mb-2">
            Neueste Ratgeber
          </h2>
          <p className="text-xs lg:text-sm text-base-content/60 dark:text-base-content/50 max-w-lg mx-auto">
            Wissenschaftlich fundierte Tipps für die optimale Haustierpflege
          </p>
        </div>

        {/* ✅ SCIENTIFIC BLOG CARDS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 max-w-6xl mx-auto">
          {publishedPosts.map((post, index) => {
            const excerpt = post.content 
              ? post.content.substring(0, 120) + '...'
              : undefined

            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative overflow-hidden rounded-xl bg-base-100/60 dark:bg-base-100/5 backdrop-blur-md border border-base-300/30 dark:border-base-700/20 hover:bg-base-100/80 dark:hover:bg-base-100/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* ✨ SCIENTIFIC RAINBOW SHINE EFFECT - Excellence Colors */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-300 pointer-events-none rounded-xl"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${
                      index % 3 === 0 ? 'rgba(212, 70, 239, 0.2)' : // excellence-research (magenta) 
                      index % 3 === 1 ? 'rgba(244, 63, 94, 0.2)' : // excellence-comprehensive (rose)
                      'rgba(139, 92, 246, 0.2)' // excellence-reliable (violet)
                    }, transparent)`,
                    transform: 'translateX(-100%) skewX(-15deg)'
                  }}
                />

                {/* ✅ SUBTLE BACKGROUND GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                <div className="relative">
                  {/* ✅ BILDER AUS PUBLIC/IMAGES/BLOG/ - OHNE FALLBACK */}
                  <div className="aspect-[16/9] overflow-hidden rounded-t-xl mb-4">
                    <Image
                      src={getBlogImagePath(post.cardImage || post.heroImage)}
                      alt={post.title}
                      width={400}
                      height={225}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      priority={index < 3}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="p-4 pt-0">
                    {/* ✅ KATEGORIE BADGE - Falls verfügbar */}
                    {post.category && (
                      <div className="mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          index % 3 === 0 ? 'bg-fuchsia-100/80 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200/30 dark:border-fuchsia-700/30' :
                          index % 3 === 1 ? 'bg-rose-100/80 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200/30 dark:border-rose-700/30' :
                          'bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200/30 dark:border-violet-700/30'
                        }`}>
                          {post.category}
                        </span>
                      </div>
                    )}

                    {/* ✅ NEUTRAL TITLE */}
                    <h3 className="font-bold text-sm mb-2 line-clamp-2 text-base-content dark:text-base-content group-hover:scale-105 transition-transform duration-300">
                      {post.title}
                    </h3>
                    
                    {/* ✅ EXCERPT - Neutral aber lesbar */}
                    {excerpt && (
                      <p className="text-xs text-base-content/60 dark:text-base-content/50 line-clamp-2 mb-3 leading-relaxed">
                        {excerpt}
                      </p>
                    )}
                    
                    {/* ✅ FOOTER - Scientific Style */}
                    <div className="flex justify-between items-center pt-3 border-t border-base-300/30 dark:border-base-600/20">
                      {/* ✅ DATE - Scientific Format */}
                      <div className="text-xs text-base-content/50 dark:text-base-content/40 font-medium">
                        {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('de-DE', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit'
                        })}
                      </div>
                      
                      {/* ✅ SCIENTIFIC READ BUTTON - Excellence Colors */}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105 ${
                        index % 3 === 0 ? 'bg-fuchsia-100/80 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200/30 dark:border-fuchsia-700/30' :
                        index % 3 === 1 ? 'bg-rose-100/80 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200/30 dark:border-rose-700/30' :
                        'bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200/30 dark:border-violet-700/30'
                      }`}>
                        Lesen
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ✅ ENHANCED CTA - Scientific Design */}
        <div className="text-center mt-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-base-100/60 dark:bg-base-100/5 backdrop-blur-md border border-base-300/30 dark:border-base-700/20 text-sm text-base-content/70 hover:text-base-content hover:bg-base-100/80 dark:hover:bg-base-100/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <span>Alle Artikel</span>
            <ArrowRight 
              size={14} 
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}


// ✅ SEKTION 4: MAIN HOMEPAGE - Wikipedia-inspiriert kompakt
export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* ✅ KORRIGIERTE HERO SECTION - Sichtbare Überschrift */}
<section className="relative py-6 lg:py-10 overflow-hidden">
  {/* Subtiler Hintergrund-Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3"></div>
  
  <div className="container mx-auto px-4 text-center relative">
    <div className="max-w-4xl mx-auto">
      {/* Logo/Brand - KORRIGIERT: Normale Textfarbe statt Gradient */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-balance text-primary">
          TAILR.WIKI
        </h1>
        
        {/* Moderne Tagline - prägnant wie Wikipedia */}
        <p className="text-sm lg:text-base text-base-content/70 max-w-2xl mx-auto leading-relaxed">
          Wissenschaftlich fundierte Informationen zu über 150 Hunderassen, 
          Katzen, Vögeln, Fischen und Reptilien.
        </p>
      </div>

      {/* ✅ SEGMENTED CONTROL - Apple/Modern Style */}
<div className="inline-flex rounded-xl bg-base-200/80 dark:bg-base-800/50 p-1 backdrop-blur-sm border border-base-300/40 dark:border-base-700/40 mb-8">
  {[
    { 
      href: "/dogs", 
      label: "Hunde", 
      icon: FeatureIcons.Heart,
      isPrimary: true 
    },
    { 
      href: "/cats", 
      label: "Katzen", 
      icon: FeatureIcons.Search,
      isPrimary: false 
    },
    { 
      href: "/search", 
      label: "Suchen", 
      icon: FeatureIcons.Search,
      isPrimary: false 
    }
  ].map((item, index) => (
    <Link
      key={index}
      href={item.href}
      className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        item.isPrimary 
          ? 'bg-primary text-primary-content shadow-sm hover:bg-primary/90' 
          : 'text-base-content/70 hover:text-base-content hover:bg-base-100/80 dark:hover:bg-base-700/50'
      }`}
    >
      <Icon 
        icon={item.icon} 
        size={14} 
        className={`transition-transform duration-200 ${
          item.isPrimary ? 'group-hover:scale-110' : 'group-hover:rotate-12'
        }`} 
      />
      {item.label}
      
      {/* Active Indicator für Primary */}
      {item.isPrimary && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
      )}
    </Link>
  ))}
</div>

      {/* ✅ TRUST CARDS - Why Section Icon Style */}
<div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-6 max-w-4xl mx-auto">
  {[
    { 
      icon: TrustIcons.Free, 
      label: "100% Kostenlos", 
      stat: "Seit 2025",
      colorClass: "text-emerald-600 dark:text-emerald-400", 
      shineColor: "rgba(34, 197, 94, 0.2)",
      // ❌ REMOVED: iconBg nicht mehr nötig
      trustType: "value"
    },
    { 
      icon: TrustIcons.Mobile, 
      label: "Mobile-First", 
      stat: "98% Score",
      colorClass: "text-blue-600 dark:text-blue-400",
      shineColor: "rgba(59, 130, 246, 0.2)",
      trustType: "technology"
    },
    { 
      icon: TrustIcons.Privacy, 
      label: "DSGVO-konform", 
      stat: "EU-Standard",
      colorClass: "text-violet-600 dark:text-violet-400",
      shineColor: "rgba(168, 85, 247, 0.2)",
      trustType: "security"
    }
  ].map((item, index) => (
    <div 
      key={index}
      className="group relative overflow-hidden rounded-xl bg-base-100/60 dark:bg-base-100/5 backdrop-blur-md border border-base-300/30 dark:border-base-700/20 p-3 text-center hover:bg-base-100/80 dark:hover:bg-base-100/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* ✨ SCIENTIFIC RAINBOW SHINE EFFECT */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-300 pointer-events-none rounded-xl"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.shineColor}, transparent)`,
          transform: 'translateX(-100%) skewX(-15deg)'
        }}
      />
      
      {/* ✅ SCIENTIFIC TRUST INDICATOR */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`w-2 h-2 rounded-full animate-pulse ${item.colorClass.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')}`}></div>
      </div>
      
      {/* ✅ ICON CONTAINER - EXAKT WIE WHY SECTION */}
      <div className="relative flex justify-center mb-2">
        <div className="relative p-2.5 rounded-xl bg-base-100/90 dark:bg-base-800/70 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 border border-white/20 dark:border-white/10">
          {/* ✅ IDENTISCH MIT WHY SECTION: bg-base-100/90 dark:bg-base-800/70 */}
          <Icon icon={item.icon} size={20} className={`${item.colorClass} group-hover:scale-110 transition-transform duration-300`} />
        </div>
      </div>
      
      {/* Enhanced Content */}
      <div className="relative">
        <div className={`font-bold text-sm ${item.colorClass} mb-1 group-hover:scale-105 transition-transform duration-300`}>
          {item.label}
        </div>
        <div className="text-xs text-base-content/70 dark:text-base-content/60 font-medium mb-2">
          {item.stat}
        </div>
        
        {/* ✅ TRUST LEVEL INDICATOR */}
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                i < 4 
                  ? item.colorClass.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')
                  : 'bg-base-300/40 dark:bg-base-600/30'
              }`}
              style={{ 
                animationDelay: `${i * 100}ms`,
                opacity: i < 4 ? '0.8' : '0.3'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  ))}
</div>
    </div>
  </div>
</section>

      {/* Stats Section */}
      <Suspense fallback={
        <div className="py-6 flex justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      }>
        <StatsSection />
      </Suspense>

      {/* ✅ WHY TAILR.WIKI SECTION - Nur Icons farbig, Text neutral */}
<section className="py-4 lg:py-6">
  <div className="container mx-auto px-4">
    {/* Header */}
    <div className="text-center mb-6">
      <h2 className="text-lg lg:text-xl font-bold mb-2">
        Warum TAILR.WIKI?
      </h2>
      <p className="text-xs lg:text-sm text-base-content/60 dark:text-base-content/50 max-w-lg mx-auto">
        Die einzige Haustier-Plattform mit wissenschaftlicher Expertise und veterinärer Validierung
      </p>
    </div>

    {/* Enhanced Scientific Grid mit Perfekt Synchronisierten Typewriter Animationen */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
      {[
        {
          title: "Wissenschaftlich fundiert", 
          subtitle: "Basiert auf peer-reviewed Studien",
          icon: FeatureIcons.Scientific,
          // ✅ SCIENTIFIC EXCELLENCE COLORS - NUR FÜR ICONS
          colorClass: "text-fuchsia-600 dark:text-fuchsia-400",
          shineColor: "rgba(212, 70, 239, 0.2)", // excellence-research.500
          details: "500+ wissenschaftliche Quellen",
          typewriterClass: "sync-typewriter-1"
        },
        {
          title: "Rassespezifisch",
          subtitle: "Individuelle Profile für 200+ Rassen",
          icon: FeatureIcons.Analytics,
          colorClass: "text-violet-600 dark:text-violet-400", 
          shineColor: "rgba(139, 92, 246, 0.2)", // excellence-reliable.500
          details: "Von Chihuahua bis Deutsche Dogge", 
          typewriterClass: "sync-typewriter-2"
        },
        {
          title: "Kontinuierlich aktualisiert",
          subtitle: "Neueste Forschung & Erkenntnisse",
          icon: FeatureIcons.Updates,
          colorClass: "text-emerald-600 dark:text-emerald-400",
          shineColor: "rgba(34, 197, 94, 0.2)", // trust-value.500
          details: "Wöchentliche Updates basierend auf neuen Studien",
          typewriterClass: "sync-typewriter-3"
        }
      ].map((feature, index) => (
        <div 
          key={index}
          className="group relative overflow-hidden rounded-xl bg-base-100/60 dark:bg-base-100/5 backdrop-blur-md border border-base-300/30 dark:border-base-700/20 p-4 text-center hover:bg-base-100/80 dark:hover:bg-base-100/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          {/* ✨ SCIENTIFIC RAINBOW SHINE EFFECT */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-300 pointer-events-none rounded-xl"
            style={{
              background: `linear-gradient(90deg, transparent, ${feature.shineColor}, transparent)`,
              transform: 'translateX(-100%) skewX(-15deg)'
            }}
          />

          {/* Enhanced Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          
          {/* Enhanced Content */}
          <div className="relative">
            {/* Enhanced Icon Container - NUR HIER FARBEN */}
            <div className="flex justify-center mb-3">
              <div className="relative p-2.5 rounded-xl bg-base-100/90 dark:bg-base-800/70 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 border border-white/20 dark:border-white/10">
                <Icon 
                  icon={feature.icon} 
                  size={20} 
                  className={`${feature.colorClass} group-hover:scale-110 transition-transform duration-300`} 
                />
              </div>
            </div>
            
            {/* ✅ TITLE - NEUTRAL TEXT COLOR */}
            <h3 className="font-bold text-sm text-base-content dark:text-base-content mb-1 group-hover:scale-105 transition-transform duration-300">
              {feature.title}
            </h3>
            
            {/* ✅ SUBTITLE - NEUTRAL TEXT COLOR */}
            <p className="text-xs text-base-content/70 dark:text-base-content/60 mb-3 font-medium leading-relaxed">
              {feature.subtitle}
            </p>

            {/* ✅ PERFEKT SYNCHRONISIERTE TYPEWRITER DETAILS - NEUTRAL */}
            <div className="h-8 flex items-center justify-center min-h-[2rem]">
              <div className={`text-xs text-base-content/50 dark:text-base-content/40 italic sync-typewriter-loop ${feature.typewriterClass}`}>
                {feature.details}
              </div>
            </div>

            {/* ✅ PROGRESS DOTS - NEUTRAL FARBEN */}
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-0.5 rounded-full bg-base-content/40 dark:bg-base-content/30 transition-all duration-500"
                  style={{ 
                    animation: `pulse 8s ease-in-out infinite`,
                    animationDelay: `${(index * 2.6 + i * 0.3)}s`,
                    opacity: '0.6'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ✅ SCIENTIFIC RAINBOW CONNECTION FOOTER */}
<div className="py-6">
  <div className="container mx-auto px-4">
    <div className="text-center">
      {/* Rainbow Connection Line */}
      <div className="w-full max-w-4xl mx-auto h-1 rounded-full bg-gradient-to-r from-rose-500 via-amber-500 via-emerald-500 via-cyan-500 via-blue-500 via-indigo-500 via-purple-500 via-pink-500 to-violet-500 opacity-30 mb-4"></div>
    </div>
  </div>
</div>

      {/* Categories Section */}
      <Suspense fallback={
        <div className="py-6 flex justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      }>
        <CategoriesSection />
      </Suspense>

      {/* Recent Blog Posts */}
      <Suspense fallback={
        <div className="py-6 flex justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      }>
        <RecentBlogSection />
      </Suspense>

      {/* ✅ FINAL CTA - Extrem kompakt */}
      <section className="py-6 lg:py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-lg lg:text-xl font-bold mb-2">
            Bereit, Ihren perfekten Begleiter zu finden?
          </h2>
          <p className="text-sm text-base-content/70 max-w-lg mx-auto mb-4">
            Durchstöbern Sie unsere Datenbank oder nutzen Sie unsere intelligente Suche
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search" className="btn btn-primary btn-sm">
              Jetzt suchen
            </Link>
            <Link href="/dogs" className="btn btn-outline btn-sm">
              Kategorien durchstöbern
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
