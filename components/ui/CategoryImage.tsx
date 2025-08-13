"use client"

import Image from 'next/image'
import { useState } from 'react'

interface CategoryImageProps {
  src?: string
  alt: string
  fallbackEmoji?: string
  size?: number
  className?: string
  priority?: boolean
}

export default function CategoryImage({
  src,
  alt,
  fallbackEmoji = "🐾",
  size = 64,
  className = "",
  priority = false
}: CategoryImageProps) {
  const [hasError, setHasError] = useState(false)
  
  // ✅ LÖSUNG: Ignoriere Database-Pfade, verwende WebP-Mapping
  const getImagePath = (): string => {
    // ✅ FORCE WEBP: Ignoriere Database-Werte, verwende immer WebP
    const categoryName = alt.toLowerCase().trim()
    
    const webpMapping: Record<string, string> = {
      // Deutsche Category-Namen → WebP-Dateien in public/images/categories/
      'hunde': '/images/categories/dog.webp',
      'katzen': '/images/categories/cat.webp',
      'aquarienfische': '/images/categories/fish.webp',
      'fische': '/images/categories/fish.webp',
      'nager & kleintiere': '/images/categories/rodent.webp',
      'nagetiere': '/images/categories/rodent.webp',
      'reptilien': '/images/categories/reptile.webp',
      'ziervögel': '/images/categories/bird.webp',
      'vögel': '/images/categories/bird.webp',
      'kaninchen': '/images/categories/rabbit.webp'
    }
    
    // Direkte Mapping-Suche
    const webpPath = webpMapping[categoryName]
    if (webpPath) {
      console.log(`✅ WebP-Mapping gefunden: ${categoryName} → ${webpPath}`)
      return webpPath
    }
    
    // Fallback: Standard WebP basierend auf Category-Namen
    console.log(`⚠️ Kein Mapping für: ${categoryName}, verwende Fallback`)
    return '/images/categories/dog.webp' // Temporärer Fallback
  }

  const imagePath = getImagePath()
  
  // ✅ DEBUGGING: Zeige Pfad-Umleitung
  console.log(`🔄 CategoryImage Redirect:`, {
    categoryName: alt,
    ignoredDBPath: src, // Database-Pfad wird ignoriert
    webpPath: imagePath
  })
  
  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 dark:from-base-700 dark:to-base-800 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <span 
          className="text-base-content/60 dark:text-base-content/40"
          style={{ fontSize: size * 0.5 }}
        >
          {fallbackEmoji}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={imagePath}
      alt={alt}
      width={size}
      height={size}
      className={`object-cover ${className}`}
      priority={priority}
      onError={(e) => {
        console.error(`❌ WebP-Bild nicht gefunden:`, {
          webpPath: imagePath,
          category: alt
        })
        setHasError(true)
      }}
      onLoad={() => {
        console.log(`✅ WebP-Bild erfolgreich geladen:`, {
          webpPath: imagePath,
          category: alt
        })
      }}
      sizes={`${size}px`}
    />
  )
}
