"use client"

import { forwardRef } from "react"

interface VideoLayerProps {
  src: string
  onEnded: () => void
  muted?: boolean
}

/**
 * Full-screen background video.
 */
export const VideoLayer = forwardRef<HTMLVideoElement, VideoLayerProps>(
  function VideoLayer({ src, onEnded, muted = true }, ref) {
    return (
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        playsInline
        muted={muted}
        preload="auto"
        onEnded={onEnded}
        aria-label="Architectural showcase video"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )
  }
)
