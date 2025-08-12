// app/blog/[slug]/loading.tsx - Vollständige Loading Page
export default function BlogPostLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero Skeleton */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb Skeleton */}
            <div className="h-4 bg-base-300 rounded w-80 mb-8"></div>
            
            {/* Badge Skeleton */}
            <div className="h-6 bg-primary/20 rounded-full w-20 mb-4 mx-auto"></div>
            
            {/* Title Skeleton */}
            <div className="space-y-3 mb-6">
              <div className="h-12 bg-base-300 rounded-2xl w-full"></div>
              <div className="h-12 bg-base-300 rounded-2xl w-4/5 mx-auto"></div>
            </div>
            
            {/* Excerpt Skeleton */}
            <div className="space-y-3 mb-8">
              <div className="h-6 bg-base-300 rounded w-full"></div>
              <div className="h-6 bg-base-300 rounded w-3/4 mx-auto"></div>
            </div>
            
            {/* Meta Info Skeleton */}
            <div className="flex gap-6 justify-center mb-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-base-300 rounded-full"></div>
                <div className="h-4 bg-base-300 rounded w-24"></div>
              </div>
              <div className="h-4 bg-base-300 rounded w-20"></div>
              <div className="h-4 bg-base-300 rounded w-16"></div>
            </div>
            
            {/* Hero Image Skeleton */}
            <div className="h-64 md:h-96 bg-base-300 rounded-2xl"></div>
          </div>
        </div>
      </section>
      
      {/* Content Skeleton */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Social Share Skeleton - Desktop */}
            <div className="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
              <div className="flex flex-col gap-3 bg-base-100 p-3 rounded-2xl shadow-lg border border-base-300">
                <div className="w-8 h-8 bg-base-300 rounded-full"></div>
                <div className="w-8 h-8 bg-base-300 rounded-full"></div>
                <div className="w-8 h-8 bg-base-300 rounded-full"></div>
              </div>
            </div>

            {/* Article Content Skeleton */}
            <div className="space-y-6">
              {/* Paragraph Skeletons */}
              {[...Array(15)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-base-300 rounded w-full"></div>
                  <div className="h-4 bg-base-300 rounded w-11/12"></div>
                  <div className="h-4 bg-base-300 rounded w-4/5"></div>
                  {i % 4 === 0 && <div className="h-8 bg-base-300 rounded w-3/4 mt-6"></div>}
                </div>
              ))}
              
              {/* Image Skeleton */}
              <div className="h-64 bg-base-300 rounded-2xl my-8"></div>
              
              {/* More Content */}
              {[...Array(8)].map((_, i) => (
                <div key={i + 15} className="space-y-3">
                  <div className="h-4 bg-base-300 rounded w-full"></div>
                  <div className="h-4 bg-base-300 rounded w-5/6"></div>
                  <div className="h-4 bg-base-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>

            {/* Article Footer Skeleton */}
            <div className="mt-16 pt-8 border-t border-base-300">
              {/* Tags Skeleton */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                  <div className="h-4 bg-base-300 rounded w-12"></div>
                  <div className="h-6 bg-base-300 rounded-full w-20"></div>
                  <div className="h-6 bg-base-300 rounded-full w-24"></div>
                  <div className="h-6 bg-base-300 rounded-full w-18"></div>
                  <div className="h-6 bg-base-300 rounded-full w-22"></div>
                </div>
              </div>

              {/* Share Section Skeleton */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-base-200 p-6 rounded-2xl">
                <div className="flex-1">
                  <div className="h-5 bg-base-300 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-base-300 rounded w-64"></div>
                </div>
                
                <div className="flex gap-2">
                  <div className="h-8 bg-base-300 rounded w-20"></div>
                  <div className="h-8 bg-base-300 rounded w-16"></div>
                  <div className="h-8 bg-base-300 rounded w-18"></div>
                </div>
              </div>

              {/* Back Button Skeleton */}
              <div className="mt-8 text-center">
                <div className="h-12 bg-base-300 rounded w-40 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio Skeleton */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-lg p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 bg-base-300 rounded-full flex-shrink-0"></div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="h-8 bg-base-300 rounded w-48 mb-2 mx-auto md:mx-0"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-base-300 rounded w-full"></div>
                    <div className="h-4 bg-base-300 rounded w-4/5"></div>
                    <div className="h-4 bg-base-300 rounded w-3/5"></div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="text-center">
                      <div className="h-6 bg-base-300 rounded w-8 mb-1"></div>
                      <div className="h-3 bg-base-300 rounded w-12"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-base-300 rounded w-8 mb-1"></div>
                      <div className="h-3 bg-base-300 rounded w-16"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-base-300 rounded w-8 mb-1"></div>
                      <div className="h-3 bg-base-300 rounded w-14"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts Skeleton */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="h-10 bg-base-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-base-300 rounded w-80 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card bg-base-100 shadow-lg overflow-hidden">
                  <div className="h-48 bg-base-300"></div>
                  <div className="card-body p-6">
                    <div className="h-4 bg-primary/20 rounded-full w-16 mb-2"></div>
                    <div className="h-6 bg-base-300 rounded mb-3"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-base-300 rounded w-full"></div>
                      <div className="h-4 bg-base-300 rounded w-4/5"></div>
                      <div className="h-4 bg-base-300 rounded w-3/5"></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <div className="h-4 bg-base-300 rounded w-20"></div>
                      <div className="h-4 bg-base-300 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <div className="h-12 bg-base-300 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA Skeleton */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="h-10 bg-base-300 rounded w-80 mx-auto mb-4"></div>
            <div className="h-6 bg-base-300 rounded w-96 mx-auto mb-8"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 bg-base-300 rounded flex-1 max-w-sm"></div>
              <div className="h-12 bg-base-300 rounded w-48"></div>
            </div>
            <div className="h-4 bg-base-300 rounded w-72 mx-auto mt-4"></div>
          </div>
        </div>
      </section>
    </div>
  )
}
