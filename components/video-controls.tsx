"use client"

interface VideoControlsProps {
  progress: number
  visible: boolean
  onSkip: () => void
}

/**
 * Overlay controls displayed while the intro video is playing:
 * - A "Skip" button in the top-right corner
 * - A thin progress bar at the bottom
 *
 * These fade out once the video completes or is skipped.
 */
export function VideoControls({ progress, visible, onSkip }: VideoControlsProps) {
  return (
    <div
      className={`absolute inset-0 z-20 transition-opacity duration-700 ${
        visible
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
    >
      {/* Subtle dark vignette so the skip button is always legible */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/50 to-transparent" />

      {/* Skip button - moved to bottom right */}
      <button
        onClick={onSkip}
        className="absolute right-6 bottom-32 z-10 flex items-center gap-2 rounded-full border border-foreground/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-foreground backdrop-blur-sm transition-all duration-300 hover:border-foreground/60 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:right-10 md:bottom-24"
        aria-label="Skip intro video"
        tabIndex={visible ? 0 : -1}
      >
        <span>Skip</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="13 17 18 12 13 7" />
          <polyline points="6 17 11 12 6 7" />
        </svg>
      </button>

      {/* Progress bar */}
      <div
        className="video-progress-track"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Video progress"
      >
        <div
          className="video-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
