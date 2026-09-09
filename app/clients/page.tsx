"use client"

import { Footer } from "@/components/footer"
import { AppShell } from "@/components/app-shell"
import { ScrollHeader } from "@/components/scroll-header"

const CLIENTS = Array.from({ length: 41 }, (_, i) => ({
  id: i + 1,
  image: `/clients/client-${i + 1}.webp`
}))

export default function ClientsPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <ScrollHeader alwaysVisible />
      
      {/* Hero Section with Video Background */}
      <div className="relative h-[100dvh] w-full">
        <AppShell videoSrc="/videos/clients-bg.mp4" skipIntro={true} />
        <section className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-10 pointer-events-none">
          <div className="text-center pointer-events-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 drop-shadow-2xl">
              Our Esteemed Clients
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-4 drop-shadow-xl">
              Celebrating collaborations with industry leaders who trust us
            </p>
          </div>
        </section>
      </div>
      
      <main className="relative bg-background">
        {/* Clients Grid Section */}
        <section className="min-h-screen py-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our Trusted Partners
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Building success together with industry leaders
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 md:gap-12">
              {CLIENTS.map((client) => (
                <div
                  key={client.id}
                  className="relative aspect-square bg-card rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 border border-border"
                >
                  <div className="absolute inset-0 p-4 flex items-center justify-center">
                    <img
                      src={client.image}
                      alt={`Client ${client.id}`}
                      className={`object-contain transition-transform duration-300 hover:scale-110 ${client.id === 11 ? "w-full h-full scale-150" : "max-w-full max-h-full"} dark:brightness-90 dark:invert-[0.1]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
