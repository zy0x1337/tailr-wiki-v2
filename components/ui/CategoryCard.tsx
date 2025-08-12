// components/ui/CategoryCard.tsx - Fehlende CategoryCard-Komponente
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  id: string
  name: string
  image?: string | null
  description?: string | null
  petCount: number
  href: string
}

export default function CategoryCard({ 
  id, 
  name, 
  image, 
  description, 
  petCount, 
  href 
}: CategoryCardProps) {
  const getImageSrc = (img: string | null | undefined): string => {
    if (!img) return '/images/placeholder-category.jpg'
    return img.startsWith('/') ? img : `/${img}`
  }

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-100 to-base-200 hover:from-primary/5 hover:to-secondary/5 p-6 text-center transition-all duration-700 hover:scale-105 hover:shadow-2xl border border-base-300 hover:border-primary/20"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Category Image/Icon */}
      {image ? (
        <div className="relative w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-500">
          <Image
            src={getImageSrc(image)}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="64px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      ) : (
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-500">
          <span className="text-2xl">🐾</span>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        <p className="text-sm text-base-content/70 mb-3">
          {petCount} Rassen
        </p>
        
        {description && (
          <p className="text-xs text-base-content/60 mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Hover Arrow */}
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <ArrowRight size={20} className="mx-auto text-primary" />
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-700"></div>
    </Link>
  )
}
