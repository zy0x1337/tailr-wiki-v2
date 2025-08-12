// components/ui/Navigation.tsx - Korrigierte Burger-Navigation mit separatem X
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Home, 
  Search, 
  BookOpen,
  Heart, 
  PawPrint,
  Fish,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
  Sun,
  Moon
} from 'lucide-react'

// ✅ Navigation Types
interface NavigationItem {
  name: string
  href: string
  icon: any
  emoji: string
  badge?: string
  description: string
  children?: NavigationSubItem[]
  isNew?: boolean
}

interface NavigationSubItem {
  name: string
  href: string
  icon: string
  description: string
  count: number
  isPopular?: boolean
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // ✅ Navigation Configuration
  const navigationItems: NavigationItem[] = [
    { 
      name: 'Home', 
      href: '/', 
      icon: Home,
      emoji: '🏠',
      description: 'Zur Startseite'
    },
    { 
      name: 'Hunde', 
      href: '/dogs', 
      icon: PawPrint,
      emoji: '🐕',
      description: 'Alle Hunderassen entdecken',
      children: [
        { name: 'Kleine Rassen', href: '/dogs?size=small', icon: '🐕', description: 'Bis 25cm', count: 45 },
        { name: 'Mittlere Rassen', href: '/dogs?size=medium', icon: '🐕‍🦺', description: '25-60cm', count: 62, isPopular: true },
        { name: 'Große Rassen', href: '/dogs?size=large', icon: '🐕‍🦮', description: 'Über 60cm', count: 43 },
        { name: 'Beliebte Rassen', href: '/dogs?popular=true', icon: '⭐', description: 'Meist gesuchte', count: 20, isPopular: true },
        { name: 'Familienhunde', href: '/dogs?family=true', icon: '👨‍👩‍👧‍👦', description: 'Kinderfreundlich', count: 35 },
        { name: 'Wachhunde', href: '/dogs?guard=true', icon: '🛡️', description: 'Schutzinstinkt', count: 28 }
      ]
    },
    { 
      name: 'Katzen', 
      href: '/cats', 
      icon: Heart,
      emoji: '🐱',
      description: 'Alle Katzenrassen entdecken',
      children: [
        { name: 'Kurzhaar-Katzen', href: '/cats?coat=short', icon: '🐱', description: 'Pflegeleicht', count: 28 },
        { name: 'Langhaar-Katzen', href: '/cats?coat=long', icon: '😸', description: 'Flauschig', count: 22 },
        { name: 'Wohnungskatzen', href: '/cats?indoor=true', icon: '🏠', description: 'Für drinnen', count: 35, isPopular: true },
        { name: 'Freigänger', href: '/cats?outdoor=true', icon: '🌳', description: 'Abenteuerlustig', count: 18 },
        { name: 'Hypoallergene Rassen', href: '/cats?hypoallergenic=true', icon: '🌿', description: 'Für Allergiker', count: 12 }
      ]
    },
    { 
      name: 'Andere Tiere', 
      href: '/pets', 
      icon: Fish,
      emoji: '🐠',
      description: 'Aquarium, Vögel & mehr',
      children: [
        { name: 'Aquarienfische', href: '/aquarium-fish', icon: '🐠', description: 'Süß- & Salzwasser', count: 85, isPopular: true },
        { name: 'Ziervögel', href: '/birds', icon: '🦜', description: 'Sittiche & Papageien', count: 42 },
        { name: 'Kleintiere', href: '/small-pets', icon: '🐹', description: 'Hamster & Kaninchen', count: 28 },
        { name: 'Reptilien', href: '/reptiles', icon: '🦎', description: 'Echsen & Schlangen', count: 24 },
        { name: 'Amphibien', href: '/amphibians', icon: '🐸', description: 'Frösche & Molche', count: 16 }
      ]
    },
    { 
      name: 'Blog', 
      href: '/blog', 
      icon: BookOpen,
      emoji: '📝',
      badge: 'Neu',
      isNew: true,
      description: 'Expert-Ratgeber & Tipps',
      children: [
        { name: 'Aquaristik-Guide', href: '/blog?category=fische', icon: '🐠', description: 'Fischpflege & Tipps', count: 12, isPopular: true },
        { name: 'Gesundheits-Ratgeber', href: '/blog?category=gesundheit', icon: '❤️', description: 'Medizinische Themen', count: 8 },
        { name: 'Ernährungs-Tipps', href: '/blog?category=ernaehrung', icon: '🥘', description: 'Richtige Fütterung', count: 15 },
        { name: 'Verhaltens-Guide', href: '/blog?category=verhalten', icon: '🧠', description: 'Tierpsychologie', count: 10 },
        { name: 'Pflege-Anleitungen', href: '/blog?category=pflege', icon: '✨', description: 'Körperpflege', count: 7 }
      ]
    },
    { 
      name: 'Suchen', 
      href: '/search', 
      icon: Search,
      emoji: '🔍',
      description: 'Erweiterte Tiersuche'
    }
  ]

  // ✅ Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setExpandedItems([])
  }, [pathname])

  // ✅ Body scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // ✅ Helper Functions
  const isActiveRoute = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  const openMenu = () => {
    setIsMenuOpen(true)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setExpandedItems([])
  }

  return (
    <>
      {/* ===== FLOATING BURGER BUTTON (nur wenn Menü geschlossen) ===== */}
      {!isMenuOpen && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={openMenu}
            className="btn btn-circle shadow-2xl border-2 btn-ghost bg-base-100/90 backdrop-blur-sm hover:btn-primary hover:scale-105 border-base-300/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-0"
            aria-label="Menü öffnen"
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      {/* ===== THEME TOGGLE (TOP RIGHT) - immer sichtbar ===== */}
      <div className="fixed top-4 right-4 z-50">
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="btn btn-circle btn-ghost bg-base-100/90 backdrop-blur-sm shadow-lg border border-base-300/50 hover:btn-primary transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-0"
            aria-label={`Zu ${theme === 'dark' ? 'Hell' : 'Dunkel'} Modus wechseln`}
          >
            <div className="relative w-6 h-6">
              <Sun 
                size={20} 
                className={`absolute inset-0 transition-all duration-500 ${
                  theme === 'dark' 
                    ? 'rotate-90 scale-0 opacity-0' 
                    : 'rotate-0 scale-100 opacity-100'
                }`} 
              />
              <Moon 
                size={20} 
                className={`absolute inset-0 transition-all duration-500 ${
                  theme === 'dark' 
                    ? 'rotate-0 scale-100 opacity-100' 
                    : '-rotate-90 scale-0 opacity-0'
                }`} 
              />
            </div>
          </button>
        )}
      </div>

      {/* ===== OVERLAY ===== */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${
          isMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* ===== SIDEBAR MENU ===== */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-base-100 z-50 shadow-2xl transition-all duration-300 flex flex-col ${
          isMenuOpen 
            ? 'translate-x-0' 
            : '-translate-x-full'
        }`}
      >
        {/* ===== SIDEBAR HEADER MIT CLOSE BUTTON ===== */}
        <div className="p-6 border-b border-base-300 bg-gradient-to-r from-primary/10 to-secondary/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="w-3 h-3 text-secondary absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TAILR.WIKI
                </h2>
                <p className="text-xs text-base-content/60">
                  Wissenschaftlicher Haustier-Ratgeber
                </p>
              </div>
            </div>
            
            {/* ===== CLOSE BUTTON (X) ===== */}
            <button 
              onClick={closeMenu}
              className="btn btn-ghost btn-sm btn-circle hover:btn-error hover:scale-110 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-error/50 focus:ring-offset-0"
              aria-label="Menü schließen"
            >
              <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* ===== SCROLLABLE NAVIGATION CONTENT ===== */}
        <div className="flex-1 overflow-y-auto p-4 navbar-scroll">
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <div key={item.name} className="space-y-1">
                {/* ===== MAIN NAVIGATION ITEM ===== */}
                <div className="relative">
                  {item.children ? (
                    // Expandable Item
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 ${
                        isActiveRoute(item.href)
                          ? 'bg-primary text-primary-content shadow-lg'
                          : 'hover:bg-base-200 hover:scale-102'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {item.emoji}
                        </span>
                        <div className="text-left">
                          <div className="font-semibold flex items-center gap-2">
                            {item.name}
                            {item.badge && (
                              <span className="badge badge-secondary badge-xs animate-pulse">
                                {item.badge}
                              </span>
                            )}
                            {item.isNew && (
                              <Zap size={12} className="text-warning animate-pulse" />
                            )}
                          </div>
                          <div className="text-xs opacity-70">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      
                      <ChevronDown 
                        size={18} 
                        className={`transition-transform duration-300 ${
                          expandedItems.includes(item.name) ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                  ) : (
                    // Regular Link Item
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 ${
                        isActiveRoute(item.href)
                          ? 'bg-primary text-primary-content shadow-lg'
                          : 'hover:bg-base-200 hover:scale-102'
                      }`}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                        {item.emoji}
                      </span>
                      <div className="flex-1 text-left">
                        <div className="font-semibold flex items-center gap-2">
                          {item.name}
                          {item.badge && (
                            <span className="badge badge-secondary badge-xs animate-pulse">
                              {item.badge}
                            </span>
                          )}
                          {item.isNew && (
                            <Zap size={12} className="text-warning animate-pulse" />
                          )}
                        </div>
                        <div className="text-xs opacity-70">
                          {item.description}
                        </div>
                      </div>
                      
                      {isActiveRoute(item.href) && (
                        <div className="w-2 h-2 bg-primary-content rounded-full animate-pulse" />
                      )}
                    </Link>
                  )}
                </div>

                {/* ===== SUBMENU (SPOILER/ACCORDION) ===== */}
                {item.children && (
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedItems.includes(item.name) 
                        ? 'max-h-[500px] opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-6 pl-4 border-l-2 border-primary/20 space-y-1 py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={closeMenu}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200/60 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-0"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg group-hover:scale-110 transition-transform">
                              {child.icon}
                            </span>
                            <div>
                              <div className="text-sm font-medium group-hover:text-primary transition-colors flex items-center gap-2">
                                {child.name}
                                {child.isPopular && (
                                  <Star size={12} className="text-warning fill-current animate-pulse" />
                                )}
                              </div>
                              <div className="text-xs text-base-content/60">
                                {child.description}
                              </div>
                            </div>
                          </div>
                          
                          <span className="badge badge-outline badge-xs">
                            {child.count}
                          </span>
                        </Link>
                      ))}
                      
                      {/* "Alle anzeigen" Link */}
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 p-3 mt-2 bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors text-primary text-sm font-medium group focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0"
                      >
                        Alle {item.name} anzeigen
                        <TrendingUp size={14} className="group-hover:scale-110 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* ===== SIDEBAR FOOTER (FIXED) ===== */}
        <div className="p-4 border-t border-base-300 bg-gradient-to-r from-primary/5 to-secondary/5 flex-shrink-0">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-base-content/60">
              <Sparkles size={14} className="text-primary animate-pulse" />
              150+ wissenschaftlich geprüfte Profile
            </div>
            
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="btn btn-ghost btn-xs gap-1 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={12} />
                    Hell
                  </>
                ) : (
                  <>
                    <Moon size={12} />
                    Dunkel
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
