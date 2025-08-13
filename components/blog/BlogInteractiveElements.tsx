// components/blog/BlogInteractiveElements.tsx - CLIENT COMPONENT
'use client'

import { useState, useEffect } from 'react'
import { Share2, Bookmark, Printer, ThumbsUp, Star } from 'lucide-react'

interface BlogPostData {
  id: number
  title: string
  slug: string
  excerpt: string | null
  likeCount?: number
}

// ✅ Social Share Client Component
export function SocialShare({ post }: { post: BlogPostData }) {
  const handleShare = async (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = post.title
    const text = post.excerpt || title

    switch (platform) {
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({ title, text, url })
          } catch (error) {
            console.log('Sharing failed:', error)
          }
        }
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(url)
          alert('Link wurde in die Zwischenablage kopiert!')
        } catch (error) {
          console.log('Copy failed:', error)
        }
        break
    }
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleShare('native')}
        className="btn btn-outline btn-sm hover:btn-primary"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline">Teilen</span>
      </button>
      <button 
        onClick={() => handleShare('copy')}
        className="btn btn-outline btn-sm hover:btn-secondary"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline">Link</span>
      </button>
    </div>
  )
}

// ✅ Interactive Buttons Client Component
export function InteractiveButtons({ post }: { post: BlogPostData }) {
  const handlePrint = () => {
    window.print()
  }

  const handleBookmark = () => {
    // Bookmark functionality
    console.log('Bookmark clicked')
  }

  const handleLike = () => {
    // Like functionality
    console.log('Like clicked')
  }

  return (
    <>
      {/* Print Button */}
      <button 
        onClick={handlePrint}
        className="btn btn-outline btn-sm hover:btn-info"
      >
        <Printer size={16} />
        <span className="hidden sm:inline">Drucken</span>
      </button>

      {/* Bookmark Button */}
      <button 
        onClick={handleBookmark}
        className="btn btn-outline btn-sm hover:btn-accent"
      >
        <Bookmark size={16} />
        <span className="hidden sm:inline">Merken</span>
      </button>

      {/* Like Button */}
      <button 
        onClick={handleLike}
        className="btn btn-outline btn-sm hover:btn-success"
      >
        <ThumbsUp size={16} />
        <span className="hidden sm:inline">Hilfreich ({post.likeCount || 127})</span>
      </button>
    </>
  )
}

// ✅ Star Rating Client Component
export function StarRating() {
  const [rating, setRating] = useState(0)

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button 
          key={star} 
          onClick={() => setRating(star)}
          className="btn btn-circle btn-outline hover:btn-warning"
        >
          <Star size={20} className={star <= rating ? 'fill-current text-warning' : ''} />
        </button>
      ))}
    </div>
  )
}

// ✅ Reading Progress Bar Client Component
export function ReadingProgressBar() {
  useEffect(() => {
    function updateReadingProgress() {
      const article = document.querySelector('main')
      const progressBar = document.getElementById('reading-progress-bar')
      if (article && progressBar) {
        const scrolled = window.scrollY
        const articleTop = article.offsetTop - 100
        const articleHeight = article.offsetHeight
        const windowHeight = window.innerHeight
        const progress = Math.min(100, Math.max(0, ((scrolled - articleTop + windowHeight) / articleHeight) * 100))
        progressBar.style.width = progress + '%'
      }
    }
    
    let ticking = false
    function handleScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateReadingProgress()
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    updateReadingProgress()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-base-300/50 z-50">
      <div 
        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-150"
        style={{ width: '0%' }}
        id="reading-progress-bar"
      />
    </div>
  )
}
