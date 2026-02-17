"use client"

import { useEffect, useRef, useState } from "react"
import { Plus, Menu, X } from "lucide-react"
import Image from "next/image"

const NAV_LINKS_LEFT = [
  { label: "ABOUT", href: "/about" },
  { label: "SERVICES", href: "/expertise" },
  { label: "CLIENTS", href: "/clients" },
] as const

const NAV_LINKS_RIGHT = [
  { label: "WORK", href: "/sales-lounge" },
  { label: "EVENTS", href: "/events" },
] as const

import { ModeToggle } from "@/components/mode-toggle"

export function ScrollHeader({ alwaysVisible = false }: { alwaysVisible?: boolean }) {
  const [visible, setVisible] = useState(alwaysVisible)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastScrollYRef.current

      if (alwaysVisible) {
        setVisible(true)
        setIsScrolled(currentY > 10)
      } else {
        if (currentY < 200) {
          setVisible(false)
          setIsScrolled(false)
          setMobileOpen(false)
        } else {
          setIsScrolled(true)
          if (delta < -10) {
            setVisible(true)
          } else if (delta > 10) {
            setVisible(false)
            setMobileOpen(false)
          }
        }
      }

      lastScrollYRef.current = currentY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [alwaysVisible])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ease-in-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-[-100%] opacity-0 pointer-events-none"
      }`}
    >
      {/* Dynamic theme-aware background */}
      <div className={`absolute inset-0 backdrop-blur-lg border-b shadow-xl transition-all duration-300 ${
        alwaysVisible && !isScrolled
          ? "bg-background/95 border-border shadow-black/5"
          : "bg-background/80 border-border shadow-black/20"
      }`} />

      <nav
        className="relative flex items-center justify-between px-6 py-4 md:px-10 lg:px-16"
        aria-label="Sticky navigation"
      >
        {/* LEFT: desktop nav | mobile hamburger */}
        <div className="flex w-24 items-center lg:w-auto">
          {/* Desktop */}
          <ul className="hidden items-center gap-10 lg:flex" role="list">
            {NAV_LINKS_LEFT.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 text-foreground/70 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="flex p-1 lg:hidden text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* CENTER: logo — truly centered with absolute positioning */}
        <a
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 hover:scale-105"
          aria-label="EventBrite - Home"
        >
          <Image
            src="/images/logo.webp"
            alt="EventBrite"
            width={140}
            height={40}
            className="h-8 w-auto transition-all duration-300 dark:invert"
          />
        </a>

        {/* RIGHT: desktop nav + CTA + Theme Toggle */}
        <div className="flex items-center justify-end gap-4 md:gap-8 lg:w-auto">
          <ul className="hidden items-center gap-10 lg:flex" role="list">
            {NAV_LINKS_RIGHT.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 text-foreground/70 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* CONTACT button */}
          <a
            href="/contact"
            className="group hidden items-center gap-2 rounded-full bg-amber-600 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg shadow-amber-900/20 transition-all duration-300 hover:bg-amber-500 md:flex"
          >
            <span>Contact</span>
            <Plus size={14} strokeWidth={3} className="transition-transform group-hover:rotate-90" />
          </a>

          <ModeToggle />
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="relative border-t border-border bg-background/95 px-6 py-4 backdrop-blur-lg">
          <ul className="flex flex-col" role="list">
            {[...NAV_LINKS_LEFT, ...NAV_LINKS_RIGHT].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="border-t border-border pt-3">
              <a
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.2em] text-amber-600 transition-colors hover:text-amber-500"
              >
                Contact Us
                <Plus size={12} strokeWidth={3} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
