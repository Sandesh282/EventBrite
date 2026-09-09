"use client"

import { useState } from "react"
import Image from "next/image"
import { Volume2, VolumeX, X } from "lucide-react"

interface LandingOverlayProps {
  phase: "playing" | "landed"
  isHome?: boolean
  isMuted?: boolean
  onToggleMute?: () => void
}

const CITIES = ["Mumbai", "Delhi", "Goa", "Pune", "Hyderabad", "Gujarat"] as const

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Youtube", href: "https://youtube.com" },
] as const

const NAV_LEFT = [
  { label: "ABOUT", href: "/about" },
  { label: "SERVICES", href: "/expertise" },
  { label: "CLIENTS", href: "/clients" },
] as const

const NAV_RIGHT = [
  { label: "WORK", href: "/sales-lounge" },
  { label: "EVENTS", href: "/events" },
] as const

export function LandingOverlay({ 
  phase, 
  isHome = false, 
  isMuted = true,
  onToggleMute
}: LandingOverlayProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isLanded = phase === "landed"

  const logoPositionClasses = !isHome
    ? "top-[26px] -translate-x-1/2 scale-75"
    : isLanded
      ? "top-1/2 -translate-x-1/2 -translate-y-1/2 scale-100"
      : "top-[26px] -translate-x-1/2 scale-75"

  return (
    <div
      className="absolute inset-0 z-30 transition-all duration-1000 ease-in-out pointer-events-none"
      aria-hidden={false}
    >
      {/* Subtle vignette overlays (Home Only) */}
      {isHome && (
        <>
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/60 to-transparent opacity-100" />
          <div className={`absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-1000 ${isLanded ? "opacity-100" : "opacity-0"}`} />
        </>
      )}

      {/* ===== CENTER/TOP: Logo (Home Only) ===== */}
      {isHome && (
        <div
          className={`absolute left-1/2 z-50 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${logoPositionClasses}`}
        >
          <a href="/" aria-label="EventBrite - Home" className="relative group block pointer-events-auto">
            {isLanded && (
              <div className="absolute inset-0 -z-10 bg-white/10 blur-[60px] rounded-full scale-150 animate-pulse" />
            )}
            <Image
              src="/images/logo.webp"
              alt="EventBrite"
              width={200}
              height={80}
              className="h-16 w-auto md:h-20 brightness-0 invert drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
              priority
            />
          </a>
        </div>
      )}

      {/* ===== TOP-LEFT: Nav links (Home Only) ===== */}
      {isHome && (
        <div className="absolute left-8 top-10 z-40 hidden lg:flex items-center gap-10 md:left-12 transition-all duration-700 pointer-events-auto">
          {NAV_LEFT.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-[13px] font-medium uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-500 hover:text-white/70 ${
                !isLanded && idx > 0 ? "opacity-0 pointer-events-none translate-x-[-20px]" : "opacity-100 translate-x-0"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* ===== TOP-RIGHT: Nav links (Home Only) ===== */}
      {isHome && (
        <div className="absolute right-8 top-10 z-40 hidden lg:flex items-center gap-10 md:right-12 transition-all duration-700 pointer-events-auto">
          {NAV_RIGHT.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-[13px] font-medium uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all duration-500 hover:text-white/70 ${
                !isLanded && idx > 0 ? "opacity-0 pointer-events-none translate-x-[20px]" : "opacity-100 translate-x-0"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* ===== MOBILE: hamburger (Home Only) ===== */}
      {isHome && (
        <div className="absolute left-6 top-8 z-40 lg:hidden pointer-events-auto">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex flex-col gap-1.5 p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all"
          >
            <span className={`block h-[1.5px] w-5 bg-white transition-all ${isMobileMenuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-white transition-all ${isMobileMenuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      )}

      {/* Mobile menu dropdown */}
      <div className={`absolute inset-0 z-50 bg-black/95 backdrop-blur-xl transition-all duration-500 lg:hidden flex flex-col items-center justify-center ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-8 right-8 text-white/50 hover:text-white p-2"
        >
          <X className="w-8 h-8" />
        </button>
        <ul className="flex flex-col gap-8 text-center">
          {[...NAV_LEFT, ...NAV_RIGHT].map((link, i) => (
            <li 
              key={link.label}
              className={`transition-all duration-500 delay-[${i * 100}ms] ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
            >
              <a href={link.href} className="block text-2xl font-bold uppercase tracking-[0.3em] text-white hover:text-amber-500 transition-colors">
                {link.label}
              </a>
            </li>
          ))}
          <li className={`pt-8 transition-all duration-500 delay-500 ${isMobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
            <a href="/contact" className="px-8 py-4 bg-amber-600 text-white rounded-full font-bold uppercase tracking-widest text-sm shadow-xl shadow-amber-900/40">
              Contact Us
            </a>
          </li>
        </ul>
        <div className="absolute bottom-12 flex gap-8">
           {SOCIAL_LINKS.map(link => (
             <a key={link.label} href={link.href} className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">{link.label}</a>
           ))}
        </div>
      </div>

      {/* ===== BOTTOM-LEFT: City list ===== */}
      <div className={`absolute bottom-10 left-8 z-40 hidden lg:flex flex-col gap-1.5 md:left-12 transition-all duration-1000 ${isLanded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {CITIES.map((city) => (
          <span key={city} className="text-[12px] font-medium uppercase tracking-[0.25em] text-white/70">{city}</span>
        ))}
      </div>

      {/* ===== BOTTOM-RIGHT: Contact + Volume Control ===== */}
      <div className={`absolute bottom-10 right-8 z-40 flex flex-col items-end gap-6 md:right-12 transition-all duration-1000 ${isLanded ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-10 pointer-events-none"}`}>
        
        {/* Volume Toggle - VISUAL SOUND CONTROL */}
        <button
          onClick={onToggleMute}
          className="group flex items-center gap-3 pointer-events-auto bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-all duration-300"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
            {isMuted ? "SOUND OFF" : "SOUND ON"}
          </span>
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          ) : (
            <Volume2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          )}
        </button>

        <div className="flex flex-col items-end gap-3 hidden lg:flex">
          <a href="/contact" className="text-[13px] font-medium uppercase tracking-[0.2em] text-white/80 hover:text-white">Contact Us</a>
          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-[12px] font-medium uppercase tracking-[0.15em] text-white/70 hover:text-white">{link.label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
