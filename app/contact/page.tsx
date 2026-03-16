"use client"

import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { ScrollHeader } from "@/components/scroll-header"

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <ScrollHeader alwaysVisible />
      
      {/* Hero Section */}
      <section className="relative h-[100dvh] w-full">
        <AppShell videoSrc="/videos/contact-bg.mp4" skipIntro={true} />
        <div className="absolute inset-0 flex items-center justify-center px-6 z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
              Get In Touch
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto drop-shadow-xl">
              Let's create something extraordinary together
            </p>
          </div>
        </div>
      </section>

      <main className="relative bg-background">
        {/* Contact Content */}
        <section className="w-full py-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left: Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-foreground mb-4">Visit Our Office</h2>
                  <p className="text-muted-foreground text-lg">
                    We're here to help bring your vision to life
                  </p>
                </div>

                <div className="space-y-4">
                  <a 
                    href="https://maps.google.com/?cid=6948313269780121510" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-6 bg-card hover:bg-muted/50 rounded-2xl transition-all border border-border hover:border-amber-300"
                  >
                    <MapPin className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Head Office</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        F-74, F-75, F-76, first floor<br />
                        Kohinoor City Mall, LBS Road<br />
                        Kurla, Mumbai - 400070
                      </p>
                    </div>
                  </a>

                  <a href="tel:+919833854321" className="group flex items-start gap-4 p-6 bg-card hover:bg-muted/50 rounded-2xl transition-all border border-border hover:border-amber-300">
                    <Phone className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                      <p className="text-muted-foreground">+91 9833854321</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right: Map */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border h-[600px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8267891234567!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e5e5e5e5e5%3A0x606e5e5e5e5e5e5e!2sKohinoor%20City%20Mall!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="EventBrite Office Location"
                  />
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
