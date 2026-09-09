"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { ScrollHeader } from "@/components/scroll-header"
import { ContactEnquiryBodySchema, ContactEnquiryBody, SERVICE_OPTIONS } from "@/lib/validators"

// ---------------------------------------------------------------------------
// ContactForm — standalone client component that POSTs to /api/contact.
//
// State machine:
//   idle → submitting → success (terminal)
//               └────→ error   (retriable — user can resubmit)
//
// React Hook Form + zodResolver keeps validation logic out of this component
// and in the shared ContactEnquiryBodySchema. Any future schema change (e.g.
// adding a budget field) is automatically reflected here with no UI edits.
// ---------------------------------------------------------------------------
type FormState = "idle" | "submitting" | "success" | "error"

function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle")
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactEnquiryBody>({
    resolver: zodResolver(ContactEnquiryBodySchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  })

  const onSubmit = async (data: ContactEnquiryBody) => {
    setFormState("submitting")
    setServerError(null)

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        // Surface a human-readable error: prefer the server message, fall back
        // to a generic one so the form always shows something actionable.
        setServerError(json.error ?? "Something went wrong. Please try again.")
        setFormState("error")
        return
      }

      setFormState("success")
      reset()
    } catch {
      setServerError("Network error — please check your connection and try again.")
      setFormState("error")
    }
  }

  if (formState === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <CheckCircle2 className="w-16 h-16 text-amber-500" />
        <h3 className="text-2xl font-bold text-foreground">Enquiry Received!</h3>
        <p className="text-muted-foreground max-w-sm">
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setFormState("idle")}
          className="mt-2 px-6 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-semibold transition-colors text-sm"
        >
          Send another enquiry
        </button>
      </div>
    )
  }

  const isSubmitting = formState === "submitting"

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Server-level error banner */}
      {formState === "error" && serverError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
          Full Name <span className="text-amber-500">*</span>
        </label>
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          placeholder="Rahul Sharma"
          disabled={isSubmitting}
          {...register("name")}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-foreground placeholder:text-muted-foreground transition-colors disabled:opacity-50"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
          Email Address <span className="text-amber-500">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          placeholder="rahul@example.com"
          disabled={isSubmitting}
          {...register("email")}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-foreground placeholder:text-muted-foreground transition-colors disabled:opacity-50"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Phone + Service — two columns on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-1.5">
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            disabled={isSubmitting}
            {...register("phone")}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-foreground placeholder:text-muted-foreground transition-colors disabled:opacity-50"
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-service" className="block text-sm font-medium text-foreground mb-1.5">
            Service Interest
          </label>
          <select
            id="contact-service"
            disabled={isSubmitting}
            {...register("service")}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-foreground transition-colors disabled:opacity-50 appearance-none"
          >
            <option value="">Select a service…</option>
            {SERVICE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1.5 text-xs text-red-400">{errors.service.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
          Message <span className="text-amber-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell us about your project — location, scale, timeline, and any specific requirements…"
          disabled={isSubmitting}
          {...register("message")}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 text-foreground placeholder:text-muted-foreground transition-colors disabled:opacity-50 resize-none"
        />
        {errors.message && (
          <p className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        id="contact-submit-btn"
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Enquiry
          </>
        )}
      </button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// ContactPage — page composition
// ---------------------------------------------------------------------------
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
              Let&apos;s create something extraordinary together
            </p>
          </div>
        </div>
      </section>

      <main className="relative bg-background">
        <section className="w-full py-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Left: Contact Info + Form */}
              <div className="space-y-10">
                <div>
                  <h2 className="text-4xl font-bold text-foreground mb-4">Send an Enquiry</h2>
                  <p className="text-muted-foreground text-lg">
                    Fill in the form and we&apos;ll get back to you within 24 hours.
                  </p>
                </div>

                {/* Contact info cards */}
                <div className="space-y-4">
                  <a
                    href="https://maps.google.com/?cid=6948313269780121510"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-5 bg-card hover:bg-muted/50 rounded-2xl transition-all border border-border hover:border-amber-300"
                  >
                    <MapPin className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Head Office</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        F-74, F-75, F-76, first floor<br />
                        Kohinoor City Mall, LBS Road<br />
                        Kurla, Mumbai - 400070
                      </p>
                    </div>
                  </a>

                  <a
                    href="tel:+919833854321"
                    className="group flex items-start gap-4 p-5 bg-card hover:bg-muted/50 rounded-2xl transition-all border border-border hover:border-amber-300"
                  >
                    <Phone className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <p className="text-muted-foreground text-sm">+91 9833854321</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border">
                    <Mail className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-muted-foreground text-sm">info@eventbrite.in</p>
                    </div>
                  </div>
                </div>

                {/* The wired-up form */}
                <div className="p-6 bg-card rounded-2xl border border-border shadow-sm">
                  <ContactForm />
                </div>
              </div>

              {/* Right: Map */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-border h-[700px]">
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
