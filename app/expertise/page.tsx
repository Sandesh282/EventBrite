"use client"

import { Footer } from "@/components/footer"
import { useEffect, useRef, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { ScrollHeader } from "@/components/scroll-header"

const EXPERTISE_ITEMS = [
  { id: 1, title: "Experience Centre", description: "Step into immersive Experience Centres where model displays, VR, lighting, and films bring your project's story and lifestyle to life.", image: "/images/godrej-1.webp" },
  { id: 2, title: "Marketing Office", description: "The command center of your sales campaign. Designed for efficiency, it includes branded interiors, workstations, and collaboration spaces.", image: "/images/raheja-1.webp" },
  { id: 3, title: "Project Office", description: "Your on-site headquarters for project teams. Smart layouts, storage for drawings, and collaborative meeting areas keep project execution organized.", image: "/images/kalpataru-1.webp" },
  { id: 4, title: "Show Apartment", description: "A fully furnished, ready-to-experience home that lets buyers walk through their future lifestyle.", image: "/images/kanchan-1.webp" },
  { id: 5, title: "Sample-Up Apartment", description: "A hybrid between a raw unit and a fully done show flat. Demonstrates actual construction quality and finishes.", image: "/images/ashford-1.webp" },
  { id: 6, title: "Sample Apartment", description: "The simplest version of an apartment mock-up usually unfurnished, demonstrating exact dimensions and specifications.", image: "/images/rustomjee-1.webp" },
  { id: 7, title: "Project Infrastructure Branding", description: "We transform construction infrastructure into powerful brand statements. From site barricades to entry gates.", image: "/images/godrej-4.webp" },
  { id: 8, title: "Site Branding & Signage", description: "Your project deserves to stand out. Includes hoardings, gantries, directional signs, and branded panels.", image: "/images/raheja-4.webp" },
  { id: 9, title: "Channel Partner Meet / Event", description: "Engage your sales channel with interactive broker and partner events.", image: "/images/kalpataru-4.webp" },
  { id: 10, title: "Signature Lounge", description: "A luxury lounge with plush interiors and premium branding.", image: "/images/project-3.jpg" },
  { id: 11, title: "Bhoomi Poojan", description: "We manage every detail of your Bhoomi Poojan and inauguration events with elegance and reverence.", image: "/images/ashford-4.webp" },
  { id: 12, title: "Temporary Structures & Utilities", description: "Turnkey rental structures and utilities for any event or sales campaign.", image: "/images/ashford-6.webp" },
]

export default function ExpertisePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const scrollSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollSectionRef.current) {
        const rect = scrollSectionRef.current.getBoundingClientRect()
        const scrolled = -rect.top
        const sectionHeight = rect.height
        const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight - window.innerHeight)))
        const exactIndex = progress * (EXPERTISE_ITEMS.length - 1)
        setCurrentImageIndex(Math.round(exactIndex))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-background">
      <ScrollHeader alwaysVisible />
      
      {/* Hero Section */}
      <section className="relative h-[100dvh] w-full overflow-hidden">
        <AppShell videoSrc="/videos/services-bg.mp4" skipIntro={true} />
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center px-6 pointer-events-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
              Our Expertise
            </h1>
            <p className="max-w-3xl text-xl text-white/90 drop-shadow-xl mx-auto">
              Comprehensive design, build, and exhibit solutions that transform ideas into impactful real estate experiences.
            </p>
          </div>
        </div>
      </section>

      <main className="relative">
        {/* Scrolling Background Images Section */}
        <section ref={scrollSectionRef} className="relative min-h-[800vh] bg-background">
          <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
            {EXPERTISE_ITEMS.map((item, index) => (
              <div
                key={item.id}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{ opacity: currentImageIndex === index ? 1 : 0 }}
              >
                {/* INCREASED BRIGHTNESS & INTENSITY */}
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover brightness-[1.2] saturate-[1.2] contrast-[1.1] dark:brightness-[0.8] dark:contrast-[1.2]" 
                />
                {/* Localized gradient on the right side for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-l from-background/90 via-background/40 to-transparent" />
              </div>
            ))}

            {/* Content Layer - RIGHT ALIGNED for clear image visibility */}
            <div className="absolute inset-0 flex items-center justify-end">
              <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 flex justify-end">
                <div className="max-w-xl space-y-8 text-right">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-amber-600 text-white text-[11px] font-bold uppercase tracking-widest shadow-xl">
                    Expertise {currentImageIndex + 1}
                  </div>
                  <h2 className="text-4xl md:text-7xl font-bold text-foreground leading-tight drop-shadow-2xl">
                    {EXPERTISE_ITEMS[currentImageIndex].title}
                  </h2>
                  <div className="h-1.5 w-24 bg-amber-500 ml-auto rounded-full shadow-lg" />
                  <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed font-light drop-shadow-xl">
                    {EXPERTISE_ITEMS[currentImageIndex].description}
                  </p>
                  
                  {/* Visual progress indicator */}
                  <div className="flex items-center justify-end gap-3 pt-12">
                    {EXPERTISE_ITEMS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 transition-all duration-500 rounded-full ${i === currentImageIndex ? "w-10 bg-amber-500" : "w-2 bg-foreground/20"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
