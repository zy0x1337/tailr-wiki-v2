// app/blog/[slug]/not-found.tsx
import Link from 'next/link'
import { BookOpen, Home, Search } from 'lucide-react'

export default function BlogPostNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <BookOpen className="w-24 h-24 mx-auto text-primary/30 mb-4" />
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Artikel nicht gefunden
          </h1>
          <p className="text-lg text-base-content/70">
            Der gesuchte Blog-Artikel existiert nicht oder wurde verschoben.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/blog"
            className="btn btn-primary btn-wide"
          >
            <BookOpen size={20} />
            Zum Blog
          </Link>
          
          <Link 
            href="/"
            className="btn btn-outline btn-wide"
          >
            <Home size={20} />
            Zur Startseite
          </Link>
          
          <Link 
            href="/search"
            className="btn btn-ghost btn-wide"
          >
            <Search size={20} />
            Suchen
          </Link>
        </div>
      </div>
    </div>
  )
}
