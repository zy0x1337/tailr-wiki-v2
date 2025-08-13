// components/ui/InteractiveImageGallery.tsx - ✅ CLIENT COMPONENT

"use client"

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Camera, Star, Award } from 'lucide-react'

interface PetWithCategory {
  id: number
  name: string
  primaryImage?: string | null
  category: {
    name: string
    image?: string | null
  }
}

interface InteractiveImageGalleryProps {
  pet: PetWithCategory
  gallery: string[]
  averageRating: number | null
}

const getImageSrc = (image: string | null): string => {
  if (!image) return '/images/placeholder-pet.jpg'
  return image.startsWith('/') ? image : `/${image}`
}

export function InteractiveImageGallery({ pet, gallery, averageRating }: InteractiveImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const allImages = [pet.primaryImage, ...gallery].filter(Boolean) as string[]

  return (
    <div className="space-y-6">
      
      {/* ✅ MAIN IMAGE - Glassmorphism Frame */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden group">
        <Image
          src={getImageSrc(allImages[selectedImage] || pet.primaryImage)}
          alt={`${pet.name} - Wissenschaftlich dokumentiert`}
          fill
          sizes="(max-width: 1280px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* ✅ SCIENTIFIC RATING BADGE */}
        {averageRating && (
          <div className="absolute top-4 right-4 authority-badge authority-badge--expert">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating)
                        ? 'fill-current text-yellow-300'
                        : 'text-white/50'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
        
        {/* ✅ GALLERY COUNTER */}
        {gallery.length > 0 && (
          <div className="absolute bottom-4 left-4 authority-badge authority-badge--trusted">
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">+{gallery.length}</span>
          </div>
        )}
        
        {/* ✅ NAVIGATION ARROWS */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedImage(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      
      {/* ✅ THUMBNAIL GALLERY */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                selectedImage === index 
                  ? 'ring-2 ring-primary scale-105' 
                  : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            >
              <Image
                src={getImageSrc(image)}
                alt={`${pet.name} Galerie ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
    </div>
  )
}
