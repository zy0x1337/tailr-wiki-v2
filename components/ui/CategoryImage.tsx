// components/ui/CategoryImage.tsx - Mit Zoom und runden Ecken
'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CategoryImageProps {
  src: string
  alt: string
  fallbackEmoji: string
  size?: number
  className?: string
}

export default function CategoryImage({ 
  src, 
  alt, 
  fallbackEmoji, 
  size = 120,
  className = ''
}: CategoryImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div 
        className={`flex items-center justify-center rounded-2xl transition-all duration-300 hover:scale-105 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.6 }}
      >
        <span className="filter drop-shadow-lg">
          {fallbackEmoji}
        </span>
      </div>
    )
  }

  return (
    <div 
      className="relative rounded-2xl overflow-hidden group cursor-pointer" 
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        className={`object-cover rounded-2xl transition-all duration-500 group-hover:scale-110 ${className}`}
        style={{
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
        onError={() => setImageError(true)}
      />
      
      {/* Subtle Hover Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}
