"use client"

import { useEffect, useState } from "react"

const VIDEOS = [
  "/videos/home-bg.mp4",
  "/videos/contact-bg.mp4",
  "/videos/clients-bg.mp4",
  "/videos/projects-bg.mp4",
  "/videos/services-bg.mp4",
  "/intro.mp4",
]

const IMAGES = [
  "/images/logo.webp",
  "/images/hero-project.jpg",
  "/images/about.webp",
  "/images/raheja-1.webp",
  "/images/godrej-1.webp",
  "/images/kalpataru-1.webp",
  "/images/kanchan-1.webp",
  "/images/ashford-1.webp",
  "/images/rustomjee-1.webp",
  ...Array.from({ length: 41 }, (_, i) => `/clients/client-${i + 1}.webp`),
]

export function AssetPreloader() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const preloadAssets = async () => {
      const promises: Promise<void>[] = []

      // Preload videos
      VIDEOS.forEach((src) => {
        const promise = new Promise<void>((resolve) => {
          const video = document.createElement("video")
          video.src = src
          video.muted = true
          video.preload = "auto"
          video.onloadeddata = () => resolve()
          video.onerror = () => resolve() // Continue even if one fails
        })
        promises.push(promise)
      })

      // Preload images
      IMAGES.forEach((src) => {
        const promise = new Promise<void>((resolve) => {
          const img = new Image()
          img.src = src
          img.onload = () => resolve()
          img.onerror = () => resolve() // Continue even if one fails
        })
        promises.push(promise)
      })

      await Promise.all(promises)
      setLoaded(true)
    }

    preloadAssets()
  }, [])

  return null
}
