"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { VideoLayer } from "@/components/video-layer"
import { LandingOverlay } from "@/components/landing-overlay"
import { Play } from "lucide-react"

type AppPhase = "playing" | "landed"

interface AppShellProps {
  videoSrc?: string
  skipIntro?: boolean
  isHome?: boolean
}

const DEFAULT_VIDEO = "/videos/home-bg.mp4"

export function AppShell({ 
  videoSrc = DEFAULT_VIDEO, 
  skipIntro = false,
  isHome = false 
}: AppShellProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<AppPhase>(skipIntro ? "landed" : "playing")
  const [progress, setProgress] = useState(skipIntro ? 100 : 0)
  const [isMuted, setIsMuted] = useState(true)
  const [hasStarted, setHasStarted] = useState(skipIntro)
  const animFrameRef = useRef<number | null>(null)

  // Disable scroll during intro
  useEffect(() => {
    if (phase === "playing" || !hasStarted) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [phase, hasStarted, isHome])

  // Progress tracking & End-of-video freezing
  useEffect(() => {
    const video = videoRef.current
    if (!video || !hasStarted) return

    const tick = () => {
      if (video.duration > 0) {
        setProgress((video.currentTime / video.duration) * 100)
        
        // If not home, freeze on the last beautiful frame (0.2s before end)
        // to avoid any "fade to black" transitions in the video file itself.
        if (!isHome && phase === "playing" && video.currentTime >= video.duration - 0.2) {
          video.pause()
          setPhase("landed")
          setProgress(100)
        }
      }
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current) }
  }, [phase, hasStarted, isHome])

  const handleStart = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    setIsMuted(false)
    setHasStarted(true)
    video.currentTime = 0
    video.play().catch(() => {
      video.muted = true
      setIsMuted(true)
      video.play()
    })
  }, [])

  const transitionToLanded = useCallback(() => {
    if (phase === "landed") return
    const video = videoRef.current
    if (video) {
      if (!isHome) {
        // Freeze on a late frame to ensure visual continuity
        video.currentTime = Math.max(0, video.duration - 0.3)
        video.pause()
      }
    }
    setPhase("landed")
    setProgress(100)
  }, [phase, isHome])

  const handleVideoEnded = useCallback(() => {
    if (isHome && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
    setPhase("landed")
    setProgress(100)
  }, [isHome])

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
      
      {/* Splash Screen */}
      {!hasStarted && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-1000">
          <div className="relative group cursor-pointer" onClick={handleStart}>
            <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full scale-150 animate-pulse" />
            <button className="relative flex flex-col items-center gap-6 group transition-transform duration-500 hover:scale-110">
              <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md bg-white/5 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-500">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
              <div className="space-y-2 text-center">
                <span className="block text-[14px] font-bold uppercase tracking-[0.4em] text-white">Enter Experience</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">Sound Recommended</span>
              </div>
            </button>
          </div>
        </div>
      )}

      <VideoLayer
        ref={videoRef}
        src={videoSrc}
        onEnded={handleVideoEnded}
        muted={isMuted}
      />

      {/* Landing Tint */}
      {/* Minimal tint for text legibility, almost invisible to keep image clear */}
      <div className={`absolute inset-0 z-[1] bg-black/5 transition-opacity duration-1000 ${phase === "landed" ? "opacity-100" : "opacity-0"}`} />

      {/* Skip Intro */}
      <div className={`absolute inset-0 z-20 transition-opacity duration-700 ${phase === "playing" && hasStarted ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <button
          onClick={transitionToLanded}
          className="absolute right-8 bottom-10 z-10 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.25em] text-white/70 hover:text-white transition-all"
        >
          <span>Skip</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <div className="h-full bg-amber-500 transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <LandingOverlay 
        phase={phase} 
        isHome={isHome} 
        isMuted={isMuted}
        onToggleMute={() => {
          if (videoRef.current) {
            const nextMute = !videoRef.current.muted
            videoRef.current.muted = nextMute
            setIsMuted(nextMute)
          }
        }}
      />
    </div>
  )
}
