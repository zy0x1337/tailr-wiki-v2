// components/ui/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  // Hydration fix für Theme
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isMobileMenuOpen && !target.closest('.navbar-container')) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const navigationItems = [
    { name: 'Startseite', href: '/', icon: '🏠' },
    { name: 'Hunde', href: '/dogs', icon: '🐕' },
    { name: 'Katzen', href: '/cats', icon: '🐱' },
    { name: 'Kleintiere', href: '/small-pets', icon: '🐹' },
    { name: 'Exoten', href: '/exotic-pets', icon: '🦎' }
  ]

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-base-100/90 backdrop-blur-xl shadow-xl border-b border-base-300/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 navbar-container">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            href="/" 
            className="btn btn-ghost text-xl font-bold text-primary hover:scale-105 transition-all duration-300 group"
          >
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              tailr.wiki
            </span>
          </Link>

          {/* Rechte Seite: Theme Toggle + Burger Menu */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="btn btn-ghost btn-square transition-all duration-300 group hover:bg-primary/10 hover:scale-105"
                aria-label={`Zu ${theme === 'dark' ? 'Hell' : 'Dunkel'} Modus wechseln`}
              >
                <div className="relative w-6 h-6">
                  {/* Sun Icon */}
                  <svg 
                    className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
                      theme === 'dark' 
                        ? 'rotate-90 scale-0 opacity-0' 
                        : 'rotate-0 scale-100 opacity-100'
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="5"/>
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                  </svg>
                  
                  {/* Moon Icon */}
                  <svg 
                    className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
                      theme === 'dark' 
                        ? 'rotate-0 scale-100 opacity-100' 
                        : '-rotate-90 scale-0 opacity-0'
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                </div>
              </button>
            )}

            {/* Burger Menu Button */}
            <div className="relative">
              <button 
                className={`btn btn-ghost btn-square transition-all duration-300 ${
                  isMobileMenuOpen ? 'bg-primary/10 scale-110' : 'hover:bg-primary/10'
                }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
              >
                {/* Burger Icon */}
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span 
                    className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ${
                      isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                    }`}
                  />
                  <span 
                    className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span 
                    className={`bg-current block h-0.5 w-6 rounded-sm transition-all duration-300 ${
                      isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                    }`}
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              <div 
                className={`absolute top-full right-0 mt-4 bg-base-100/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-base-300/50 transition-all duration-300 origin-top-right min-w-[280px] max-w-[90vw] sm:w-80 ${
                  isMobileMenuOpen 
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
                }`}
              >
                {/* Header mit Theme Info */}
                <div className="p-4 border-b border-base-300/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-bold text-primary">Navigation</h3>
                        <p className="text-xs text-base-content/70">
                          {mounted ? (theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode') : '150+ Tierprofile'}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-ghost btn-sm btn-circle"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="p-2">
                  {navigationItems.map((item, index) => (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group w-full ${
                        pathname === item.href 
                          ? 'bg-primary text-primary-content shadow-md' 
                          : 'hover:bg-base-200/80 hover:translate-x-1'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="font-medium flex-1">{item.name}</span>
                      
                      {pathname === item.href ? (
                        <div className="w-2 h-2 bg-primary-content rounded-full animate-pulse" />
                      ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Footer mit Quick Theme Switch */}
                <div className="p-4 border-t border-base-300/50">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-base-content/60">
                      150+ Tierprofile
                    </div>
                    {mounted && (
                      <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="btn btn-ghost btn-xs hover:scale-105 transition-transform"
                      >
                        {theme === 'dark' ? '☀️ Hell' : '🌙 Dunkel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
