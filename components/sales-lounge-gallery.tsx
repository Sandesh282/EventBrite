"use client"

import { useEffect, useRef, useState, useCallback, type MouseEvent } from "react"
import { X, ChevronLeft, ChevronRight, MapPin, ArrowRight } from "lucide-react"

interface Project {
  id: number
  name: string
  location: string
  images: string[]
}

const PROJECTS: Project[] = [
  { id: 1, name: "RUSTOMJEE", location: "Dombivli", images: ["/images/rustomjee-1.webp", "/images/rustomjee-2.webp"] },
  { id: 2, name: "K. RAHEJA", location: "Kanjurmarg", images: ["/images/raheja-1.webp", "/images/raheja-2.webp", "/images/raheja-3.webp", "/images/raheja-4.webp", "/images/raheja-5.webp"] },
  { id: 3, name: "KANCHAN", location: "Pune", images: ["/images/kanchan-1.webp", "/images/kanchan-2.webp", "/images/kanchan-3.webp", "/images/kanchan-4.webp"] },
  { id: 4, name: "GODREJ", location: "Pune", images: ["/images/godrej-1.webp", "/images/godrej-2.webp", "/images/godrej-3.webp", "/images/godrej-4.webp", "/images/godrej-5.webp"] },
  { id: 5, name: "ASHFORD", location: "Nahur", images: ["/images/ashford-1.webp", "/images/ashford-2.webp", "/images/ashford-3.webp", "/images/ashford-4.webp", "/images/ashford-5.webp", "/images/ashford-6.webp"] },
  { id: 6, name: "KALPATARU - ARIA", location: "Karjat", images: ["/images/kalpataru-1.webp", "/images/kalpataru-2.webp", "/images/kalpataru-3.webp", "/images/kalpataru-4.webp"] }
]

export function SalesLoungeGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageDirection, setImageDirection] = useState<'left' | 'right'>('right')

  const calculateScrollProgress = useCallback(() => {
    if (!containerRef.current) return
    const { top } = containerRef.current.getBoundingClientRect()
    const progress = (window.innerHeight - top) / window.innerHeight
    setScrollProgress(Math.max(0, Math.min(progress, 1)))
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", calculateScrollProgress, { passive: true })
    calculateScrollProgress()
    return () => window.removeEventListener("scroll", calculateScrollProgress)
  }, [calculateScrollProgress])

  const toggleBodyScroll = useCallback((lock: boolean) => {
    document.body.style.overflow = lock ? "hidden" : "auto"
  }, [])

  const openGallery = useCallback((project: Project) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
    setImageDirection('right')
    toggleBodyScroll(true)
  }, [toggleBodyScroll])

  const closeGallery = useCallback(() => {
    setSelectedProject(null)
    toggleBodyScroll(false)
  }, [toggleBodyScroll])

  const navigateImage = useCallback((direction: 'next' | 'prev') => {
    if (!selectedProject) return
    setImageDirection(direction === 'next' ? 'right' : 'left')
    setCurrentImageIndex(prev => 
      direction === 'next' 
        ? (prev + 1) % selectedProject.images.length
        : prev === 0 ? selectedProject.images.length - 1 : prev - 1
    )
  }, [selectedProject])

  const handleNavClick = useCallback((e: MouseEvent, direction: 'next' | 'prev') => {
    e.stopPropagation()
    navigateImage(direction)
  }, [navigateImage])

  useEffect(() => {
    if (!selectedProject) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape": closeGallery(); break
        case "ArrowLeft": navigateImage('prev'); break
        case "ArrowRight": navigateImage('next'); break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedProject, closeGallery, navigateImage])

  return (
    <>
      <section ref={containerRef} className="relative w-full min-h-screen bg-background py-32 px-6 md:px-12 lg:px-20 overflow-hidden">
        
        <div className="max-w-7xl mx-auto relative">
          <header 
            className="text-center mb-20 space-y-4"
            style={{
              opacity: Math.min(scrollProgress * 2, 1),
              transform: `translateY(${Math.max(0, 30 - scrollProgress * 60)}px)`
            }}
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
              Sales Lounge Gallery
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Spaces designed to inspire, engage, and convert
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, index) => (
              <article 
                key={project.id} 
                className="group relative bg-card rounded-2xl overflow-hidden cursor-pointer border border-border hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500" 
                style={{
                  opacity: Math.min((scrollProgress - index * 0.05) * 2, 1),
                  transform: `translateY(${Math.max(0, 50 - (scrollProgress - index * 0.05) * 100)}px)`
                }}
                onClick={() => openGallery(project)}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={project.images[0]} 
                    alt={`${project.name} sales lounge`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2 tracking-wide">{project.name}</h3>
                  <p className="text-sm text-neutral-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div 
            className="text-center mt-16"
            style={{
              opacity: Math.min((scrollProgress - 0.3) * 2, 1),
              transform: `translateY(${Math.max(0, 20 - (scrollProgress - 0.3) * 40)}px)`
            }}
          >
            <a href="/sales-lounge" className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-full font-semibold hover:shadow-xl hover:shadow-neutral-900/30 transition-all duration-300">
              VIEW ALL PROJECTS
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 bg-black/98 backdrop-blur-sm flex items-center justify-center p-4" 
          onClick={closeGallery}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gallery-title"
        >
          <button 
            onClick={(e) => { e.stopPropagation(); closeGallery(); }} 
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/80 hover:text-white hover:rotate-90 transition-all duration-500 z-20 p-2 rounded-full hover:bg-white/10"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          {selectedProject.images.length > 1 && (
            <>
              <button 
                onClick={(e) => handleNavClick(e, 'prev')} 
                className="absolute left-2 md:left-6 text-white/80 hover:text-white hover:scale-110 transition-all duration-300 z-20 p-3 rounded-full hover:bg-white/10 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
              </button>
              <button 
                onClick={(e) => handleNavClick(e, 'next')} 
                className="absolute right-2 md:right-6 text-white/80 hover:text-white hover:scale-110 transition-all duration-300 z-20 p-3 rounded-full hover:bg-white/10 backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
              </button>
            </>
          )}

          <div className="max-w-5xl w-full relative" onClick={(e) => e.stopPropagation()}>
            <header className="mb-4 text-center space-y-1">
              <h3 id="gallery-title" className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {selectedProject.name}
              </h3>
              <p className="text-sm md:text-base text-gray-400 flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                {selectedProject.location}
              </p>
              <p className="text-xs text-gray-500">
                {currentImageIndex + 1} / {selectedProject.images.length}
              </p>
            </header>

            <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
              <img 
                key={`${selectedProject.id}-${currentImageIndex}`}
                src={selectedProject.images[currentImageIndex]} 
                alt={`${selectedProject.name} - Image ${currentImageIndex + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>

            {selectedProject.images.length > 1 && (
              <nav className="flex justify-center items-center gap-2 mt-4" aria-label="Image navigation">
                {selectedProject.images.map((_, index) => (
                  <button 
                    key={index} 
                    onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(index); }} 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? "bg-white w-8" 
                        : "bg-gray-600 w-6 hover:bg-gray-500"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                    aria-current={index === currentImageIndex}
                  />
                ))}
              </nav>
            )}
          </div>
        </div>
      )}
    </>
  )
}
