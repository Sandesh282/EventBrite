"use client"

import { useState } from "react"
import { Plus, Send } from "lucide-react"

const NAV_LINKS_LEFT = [
  { label: "PROJECTS", href: "/sales-lounge" },
  { label: "SERVICES", href: "/expertise" },
  { label: "EVENTS", href: "/events" },
] as const

const NAV_LINKS_RIGHT = [
  { label: "ABOUT", href: "/about" },
  { label: "CLIENTS", href: "/clients" },
  { label: "CONTACT", href: "/contact" },
] as const

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="absolute left-0 right-0 top-[calc(env(safe-area-inset-top)+1rem)] z-40">
      <nav
        className="flex items-center justify-between px-6 py-5 md:px-10 lg:px-12"
        aria-label="Main navigation"
      >
        {/* Left nav links - hidden on mobile */}
        <ul className="hidden items-center gap-8 lg:flex" role="list">
          {NAV_LINKS_LEFT.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/80 transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="flex items-center gap-2 lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-px w-5 bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {/* Logo */}
        <a
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="EventBrite - Home"
        >
          <img src="/images/logo.webp" alt="EventBrite" className="h-12 md:h-14" />
        </a>

        {/* Right nav links - hidden on mobile */}
        <div className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-8" role="list">
            {NAV_LINKS_RIGHT.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-xs font-medium uppercase tracking-[0.15em] text-foreground/80 transition-colors duration-300 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/contact"
            className="flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-opacity duration-300 hover:opacity-90"
          >
            <span>{"LET'S TALK"}</span>
            <Plus size={14} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>

        {/* Mobile CTA: use an icon only to save horizontal space */}
        <a
          href="/contact"
          className="flex items-center justify-center rounded-full bg-foreground p-2 text-primary-foreground lg:hidden"
          aria-label="Contact"
        >
          <Send size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      </nav>

      {/* Mobile navigation menu */}
      <div
        id="mobile-navigation"
        className={`absolute left-0 right-0 top-full bg-background/95 backdrop-blur-md transition-all duration-500 lg:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto max-h-screen opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <ul className="flex flex-col gap-1 px-6 py-6" role="list">
          {[...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT].map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="block py-3 text-sm uppercase tracking-[0.2em] text-foreground/80 transition-colors duration-300 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
