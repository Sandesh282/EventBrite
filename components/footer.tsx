"use client"

import { Mail, Phone, MapPin, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const clientHeight = window.innerHeight
      const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 500
      setShowScrollTop(scrolledToBottom)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative w-full bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground uppercase tracking-wider">EventBrite</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For over a decade, Eventbrite has been India's premier real estate marketing studio, designing award-winning Sales Lounges and executing high-impact events nationwide.
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-foreground uppercase tracking-wider">Contact Info</h4>
            <div className="space-y-4">
              <a href="tel:+919833848009" className="flex items-center gap-3 text-muted-foreground hover:text-amber-600 transition-colors group">
                <div className="p-2 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 group-hover:bg-amber-200 transition-colors">
                  <Phone className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium">+91 9833848009</span>
              </a>
              <a href="mailto:info@event-brite.in" className="flex items-center gap-3 text-muted-foreground hover:text-amber-600 transition-colors group">
                <div className="p-2 rounded-lg bg-amber-100/50 dark:bg-amber-900/20 group-hover:bg-amber-200 transition-colors">
                  <Mail className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium">info@event-brite.in</span>
              </a>
              <div className="flex items-start gap-3 text-muted-foreground">
                <div className="p-2 rounded-lg bg-amber-100/50 dark:bg-amber-900/20">
                  <MapPin className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium">Headquartered in Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <h4 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              LET'S<br />CONNECT
            </h4>
            <a href="/contact" className="group inline-flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-amber-600 transition-all duration-300">
              Get In Touch
              <ArrowUp className="w-5 h-5 rotate-45 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Copyright © {new Date().getFullYear()} EventBrite | All rights reserved
            </p>
            <p className="text-sm text-muted-foreground">
              Designed by <span className="font-semibold text-foreground">EventBrite</span>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 p-4 bg-amber-600 text-white rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-110 z-50 border border-white/20"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </footer>
  )
}
