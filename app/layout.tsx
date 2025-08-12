// app/layout.tsx - Optimierte Layout-Komponente
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/ui/Navigation'
import Footer from '@/components/ui/Footer'
import { Providers } from '@/components/Providers'

// ✅ Optimierte Google Font Konfiguration
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'], // Spezifische Gewichte für bessere Performance
  preload: true, // Preload für kritische Font
})

// ✅ Erweiterte SEO Metadata
export const metadata: Metadata = {
  title: {
    default: 'tailr.wiki - Ihr umfassender Haustier-Ratgeber',
    template: '%s | tailr.wiki'
  },
  description: 'Entdecken Sie über 150 detaillierte Haustier-Profile mit wissenschaftlich fundierten Informationen zu Hunderassen, Katzen, Vögeln und mehr.',
  keywords: [
    'Haustiere',
    'Hunderassen', 
    'Katzenrassen',
    'Tierhaltung',
    'Haustier-Ratgeber',
    'Hundeerziehung',
    'Katzenpflege',
    'Tiergesundheit'
  ],
  authors: [{ name: 'tailr.wiki Team' }],
  creator: 'tailr.wiki',
  publisher: 'tailr.wiki',
  
  // ✅ Open Graph erweitert
  openGraph: {
    title: 'tailr.wiki - Ihr umfassender Haustier-Ratgeber',
    description: 'Über 150 detaillierte Haustier-Profile mit wissenschaftlich fundierten Informationen',
    url: 'https://tailr.wiki',
    siteName: 'tailr.wiki',
    type: 'website',
    locale: 'de_DE',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'tailr.wiki - Haustier-Ratgeber',
      }
    ],
  },
  
  // ✅ Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'tailr.wiki - Ihr umfassender Haustier-Ratgeber',
    description: 'Über 150 detaillierte Haustier-Profile mit wissenschaftlich fundierten Informationen',
    images: ['/images/og-image.jpg'],
    creator: '@tailrwiki',
  },
  
  // ✅ Robots optimiert
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
  
  // ✅ Weitere SEO-Verbesserungen
  alternates: {
    canonical: 'https://tailr.wiki',
    languages: {
      'de-DE': 'https://tailr.wiki',
    },
  },
  
  // ✅ App-spezifische Metadaten
  applicationName: 'tailr.wiki',
  referrer: 'origin-when-cross-origin',
  category: 'animals',
  classification: 'pet care',
}

// ✅ Viewport Konfiguration
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html 
      lang="de" 
      className={inter.variable}
      suppressHydrationWarning={true}
    >
      <head>
        {/* ✅ Performance Optimierungen */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* ✅ PWA & Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* ✅ Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        
        {/* ✅ DNS Prefetch für externe Ressourcen */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-base-100 text-base-content`}>
        <Providers>
          {/* ✅ Skip to main content für Accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-content px-4 py-2 rounded-md z-50"
          >
            Zum Hauptinhalt springen
          </a>
          
          <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <Navigation />
            
            {/* Main Content mit ID für Skip-Link */}
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </Providers>
        
        {/* ✅ Strukturierte Daten (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'tailr.wiki',
              description: 'Umfassender Haustier-Ratgeber mit über 150 detaillierten Tierprofilen',
              url: 'https://tailr.wiki',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://tailr.wiki/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'tailr.wiki',
                url: 'https://tailr.wiki',
              },
            })
          }}
        />
      </body>
    </html>
  )
}
