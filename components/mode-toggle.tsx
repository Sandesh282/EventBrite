"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
      
      {/* Tooltip-like effect for luxury feel */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-neutral-900 text-white text-[10px] uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </div>
    </button>
  )
}
