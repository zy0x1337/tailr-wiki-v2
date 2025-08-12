// components/ui/Footer.tsx - Client Component Version
'use client'  // ✅ Client Component Direktive hinzugefügt

import Link from 'next/link'
import Image from 'next/image'
import { 
  Heart, 
  Mail, 
  Github, 
  Twitter, 
  Instagram,
  Facebook,
  MapPin,
  Phone,
  Shield,
  FileText,
  HelpCircle,
  Star,
  Award,
  Users,
  Calendar
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const animalCategories = [
    { name: 'Hunde', href: '/dogs', count: '144 Rassen' },
    { name: 'Katzen', href: '/cats', count: '16 Rassen' },
    { name: 'Vögel', href: '/birds', count: 'Bald verfügbar' },
    { name: 'Fische', href: '/fish', count: 'Bald verfügbar' },
    { name: 'Nager', href: '/rodents', count: 'Bald verfügbar' },
    { name: 'Reptilien', href: '/reptiles', count: 'Bald verfügbar' },
  ]

  const quickLinks = [
    { name: 'Über uns', href: '/about', icon: Users },
    { name: 'Blog & Ratgeber', href: '/blog', icon: FileText },
    { name: 'Suche', href: '/search', icon: HelpCircle },
    { name: 'Kontakt', href: '/contact', icon: Mail },
  ]

  const legalLinks = [
    { name: 'Datenschutz', href: '/privacy', icon: Shield },
    { name: 'Impressum', href: '/imprint', icon: FileText },
    { name: 'AGB', href: '/terms', icon: FileText },
    { name: 'Cookie-Richtlinie', href: '/cookies', icon: Shield },
  ]

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/tailrwiki', icon: Facebook, color: 'hover:text-blue-600' },
    { name: 'Instagram', href: 'https://instagram.com/tailrwiki', icon: Instagram, color: 'hover:text-pink-600' },
    { name: 'Twitter', href: 'https://twitter.com/tailrwiki', icon: Twitter, color: 'hover:text-blue-400' },
    { name: 'GitHub', href: 'https://github.com/tailrwiki', icon: Github, color: 'hover:text-gray-900 dark:hover:text-white' },
  ]

  // ✅ Newsletter Handler (Client-side)
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    
    // Hier kannst du später die Newsletter-Logik implementieren
    console.log('Newsletter signup:', email)
    alert('Vielen Dank für Ihr Interesse! Newsletter-Funktion wird bald verfügbar sein.')
  }

  // ✅ Scroll to Top Handler (Client-side)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-base-200 border-t border-base-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-base-300">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Bleiben Sie auf dem Laufenden!
            </h3>
            <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
              Erhalten Sie die neuesten Haustier-Ratgeber, Rassenprofile und Pflegetipps 
              direkt in Ihr Postfach.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                name="email"
                placeholder="Ihre E-Mail-Adresse"
                className="input input-bordered flex-1"
                aria-label="E-Mail für Newsletter"
                required
              />
              <button type="submit" className="btn btn-primary">
                <Mail className="mr-2" size={16} />
                Anmelden
              </button>
            </form>
            <p className="text-xs text-base-content/60 mt-4">
              Kostenlos und jederzeit abbestellbar. Ihre Daten sind bei uns sicher.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center text-2xl font-bold mb-6">
            tailr.wiki
            </Link>
            <p className="text-base-content/70 mb-6 leading-relaxed max-w-md">
              Ihr vertrauenswürdiger Haustier-Ratgeber mit über 150 detaillierten 
              Tierprofilen und wissenschaftlich fundierten Informationen. Von der 
              Auswahl bis zur täglichen Pflege - wir begleiten Sie und Ihren tierischen Freund.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="stat bg-base-100 rounded-lg p-3 text-center">
                <div className="stat-value text-sm text-primary">150+</div>
                <div className="stat-desc text-xs">Tierprofile</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-3 text-center">
                <div className="stat-value text-sm text-secondary">6</div>
                <div className="stat-desc text-xs">Kategorien</div>
              </div>
              <div className="stat bg-base-100 rounded-lg p-3 text-center">
                <div className="stat-value text-sm text-accent">100%</div>
                <div className="stat-desc text-xs">Kostenlos</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:info@tailr.wiki" className="link link-hover">
                  info@tailr.wiki
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Deutschland</span>
              </div>
            </div>
          </div>

          {/* Animal Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Star size={20} className="text-primary" />
              Tierkategorien
            </h3>
            <ul className="space-y-3">
              {animalCategories.map((category) => (
                <li key={category.name}>
                  <Link 
                    href={category.href}
                    className="group flex items-center justify-between py-1 hover:text-primary transition-colors"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {category.name}
                    </span>
                    <span className="text-xs text-base-content/50">
                      {category.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Award size={20} className="text-secondary" />
              Navigation
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="group flex items-center gap-3 py-1 hover:text-primary transition-colors"
                  >
                    <link.icon size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="font-medium mb-4">Folgen Sie uns</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className={`btn btn-circle btn-ghost btn-sm ${social.color} transition-colors`}
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon size={16} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Legal & Support */}
          <div>
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Shield size={20} className="text-accent" />
              Rechtliches
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="group flex items-center gap-3 py-1 hover:text-primary transition-colors"
                  >
                    <link.icon size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust Indicators */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <Shield size={16} className="text-green-500" />
                <span>SSL-verschlüsselt</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <Award size={16} className="text-blue-500" />
                <span>DSGVO-konform</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/60">
                <Heart size={16} className="text-red-500" />
                <span>Made in Germany</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-base-300 border-t border-base-content/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-base-content/60">
              <p>
                © {currentYear} tailr.wiki. Alle Rechte vorbehalten.
              </p>
              <div className="flex items-center gap-1">
                <span>Erstellt mit</span>
                <Heart size={14} className="text-red-500 mx-1" />
                <span>für Tierliebhaber</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-base-content/60">
                <Calendar size={14} />
                <span>Letzte Aktualisierung: {new Date().toLocaleDateString('de-DE')}</span>
              </div>
              <div className="badge badge-outline badge-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        aria-label="Nach oben scrollen"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  )
}
