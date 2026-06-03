"use client"

import { useEffect, useRef, useState } from "react"
import { Music, Mic2, Headphones, Guitar, Disc3 } from "lucide-react"

type SvgProps = { style?: React.CSSProperties }

function DrumIcon({ style }: SvgProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <ellipse cx="12" cy="8" rx="9" ry="4" />
      <path d="M3 8v8c0 2.2 4 4 9 4s9-1.8 9-4V8" />
      <line x1="3" y1="8" x2="3" y2="16" />
      <line x1="21" y1="8" x2="21" y2="16" />
      <path d="M12 12v8" />
    </svg>
  )
}

function TapeReelIcon({ style }: SvgProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <circle cx="7" cy="12" r="4" />
      <circle cx="17" cy="12" r="4" />
      <circle cx="7" cy="12" r="1.5" />
      <circle cx="17" cy="12" r="1.5" />
      <path d="M7 8h10" />
      <path d="M7 16h10" />
      <rect x="2" y="6" width="20" height="12" rx="2" />
    </svg>
  )
}

function PianoKeysIcon({ style }: SvgProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <line x1="6" y1="4" x2="6" y2="20" />
      <line x1="10" y1="4" x2="10" y2="20" />
      <line x1="14" y1="4" x2="14" y2="20" />
      <line x1="18" y1="4" x2="18" y2="20" />
      <rect x="4" y="4" width="2" height="10" fill="currentColor" />
      <rect x="8" y="4" width="2" height="10" fill="currentColor" />
      <rect x="14" y="4" width="2" height="10" fill="currentColor" />
      <rect x="18" y="4" width="2" height="10" fill="currentColor" />
    </svg>
  )
}

interface IconConfig {
  Icon: React.ElementType
  x: number           // left %
  y: number           // top %
  size: number        // px — far icons smaller, close icons larger
  depth: number       // 0.2 = distant … 1.0 = close foreground
  floatDuration: number
  floatDelay: number
}

// How many px a depth-1 icon shifts across a full viewport scroll-through
const PARALLAX_STRENGTH = 70

const iconConfigs: Record<string, IconConfig[]> = {
  hero: [
    // ── Distant ───────────────────────────────────────────────────────────
    { Icon: Music,         x:  8, y: 15, size: 16, depth: 0.20, floatDuration:  9, floatDelay: 0.0 },
    { Icon: Disc3,         x: 55, y:  8, size: 14, depth: 0.25, floatDuration: 11, floatDelay: 1.5 },
    { Icon: Mic2,          x: 88, y: 22, size: 16, depth: 0.22, floatDuration:  8, floatDelay: 0.8 },
    { Icon: DrumIcon,      x: 38, y: 82, size: 14, depth: 0.20, floatDuration: 10, floatDelay: 2.5 },
    { Icon: Music,         x: 72, y: 78, size: 15, depth: 0.18, floatDuration: 12, floatDelay: 3.0 },
    { Icon: PianoKeysIcon, x: 30, y:  5, size: 14, depth: 0.22, floatDuration: 10, floatDelay: 2.0 },
    { Icon: Guitar,        x: 62, y: 92, size: 15, depth: 0.19, floatDuration:  9, floatDelay: 0.5 },
    { Icon: Headphones,    x: 18, y: 95, size: 14, depth: 0.21, floatDuration: 11, floatDelay: 3.5 },
    { Icon: TapeReelIcon,  x: 90, y: 10, size: 16, depth: 0.24, floatDuration:  8, floatDelay: 1.0 },
    { Icon: Mic2,          x: 45, y: 60, size: 15, depth: 0.20, floatDuration: 10, floatDelay: 4.0 },
    // ── Mid-field ─────────────────────────────────────────────────────────
    { Icon: Guitar,        x: 15, y: 55, size: 24, depth: 0.45, floatDuration:  6, floatDelay: 1.0 },
    { Icon: TapeReelIcon,  x: 80, y: 48, size: 22, depth: 0.50, floatDuration:  7, floatDelay: 2.0 },
    { Icon: PianoKeysIcon, x: 48, y: 75, size: 26, depth: 0.40, floatDuration:  8, floatDelay: 0.5 },
    { Icon: Disc3,         x: 65, y: 32, size: 22, depth: 0.35, floatDuration:  7, floatDelay: 3.0 },
    { Icon: Mic2,          x: 35, y: 45, size: 22, depth: 0.38, floatDuration:  7, floatDelay: 0.0 },
    { Icon: DrumIcon,      x: 75, y: 62, size: 24, depth: 0.44, floatDuration:  6, floatDelay: 2.5 },
    { Icon: PianoKeysIcon, x: 10, y: 75, size: 22, depth: 0.35, floatDuration:  8, floatDelay: 1.0 },
    { Icon: Guitar,        x: 58, y: 55, size: 26, depth: 0.48, floatDuration:  7, floatDelay: 3.0 },
    // ── Close foreground ──────────────────────────────────────────────────
    { Icon: Headphones,    x:  4, y: 40, size: 34, depth: 0.75, floatDuration:  5, floatDelay: 1.5 },
    { Icon: TapeReelIcon,  x: 93, y: 32, size: 38, depth: 0.88, floatDuration:  4, floatDelay: 0.0 },
    { Icon: Music,         x: 22, y: 25, size: 42, depth: 1.00, floatDuration:  4.5, floatDelay: 2.0 },
    { Icon: Mic2,          x: 45, y: 18, size: 36, depth: 0.80, floatDuration:  5, floatDelay: 0.5 },
    { Icon: DrumIcon,      x: 78, y: 18, size: 40, depth: 0.90, floatDuration:  4, floatDelay: 1.5 },
    { Icon: Disc3,         x: 32, y: 70, size: 34, depth: 0.72, floatDuration:  5, floatDelay: 2.0 },
  ],
  process: [
    // Distant
    { Icon: Music,         x: 12, y: 10, size: 15, depth: 0.20, floatDuration: 10, floatDelay: 0.0 },
    { Icon: Disc3,         x: 70, y: 15, size: 14, depth: 0.22, floatDuration:  9, floatDelay: 1.0 },
    { Icon: Mic2,          x: 45, y: 88, size: 15, depth: 0.18, floatDuration: 11, floatDelay: 2.0 },
    { Icon: Music,         x: 88, y: 80, size: 16, depth: 0.25, floatDuration:  8, floatDelay: 0.5 },
    { Icon: Guitar,        x: 28, y:  5, size: 14, depth: 0.22, floatDuration:  9, floatDelay: 2.0 },
    { Icon: TapeReelIcon,  x: 55, y: 92, size: 15, depth: 0.19, floatDuration: 11, floatDelay: 1.5 },
    { Icon: Headphones,    x: 82, y: 88, size: 14, depth: 0.21, floatDuration: 10, floatDelay: 3.0 },
    { Icon: DrumIcon,      x: 35, y: 20, size: 15, depth: 0.20, floatDuration:  9, floatDelay: 0.5 },
    { Icon: PianoKeysIcon, x: 62, y: 78, size: 14, depth: 0.23, floatDuration: 10, floatDelay: 2.5 },
    // Mid
    { Icon: TapeReelIcon,  x:  5, y: 30, size: 24, depth: 0.42, floatDuration:  7, floatDelay: 1.5 },
    { Icon: Guitar,        x: 92, y: 25, size: 26, depth: 0.48, floatDuration:  6, floatDelay: 0.0 },
    { Icon: PianoKeysIcon, x: 18, y: 70, size: 22, depth: 0.38, floatDuration:  8, floatDelay: 2.5 },
    { Icon: DrumIcon,      x: 80, y: 65, size: 24, depth: 0.44, floatDuration:  7, floatDelay: 1.0 },
    { Icon: Mic2,          x: 40, y: 45, size: 22, depth: 0.40, floatDuration:  7, floatDelay: 0.0 },
    { Icon: Guitar,        x: 60, y: 58, size: 24, depth: 0.45, floatDuration:  6, floatDelay: 2.0 },
    { Icon: Headphones,    x: 25, y: 42, size: 22, depth: 0.36, floatDuration:  8, floatDelay: 1.0 },
    { Icon: PianoKeysIcon, x: 75, y: 75, size: 24, depth: 0.42, floatDuration:  7, floatDelay: 0.5 },
    // Close
    { Icon: Disc3,         x:  7, y: 55, size: 36, depth: 0.75, floatDuration:  5, floatDelay: 0.5 },
    { Icon: Headphones,    x: 90, y: 50, size: 40, depth: 0.90, floatDuration:  4, floatDelay: 2.0 },
    { Icon: Guitar,        x: 45, y: 20, size: 36, depth: 0.78, floatDuration:  5, floatDelay: 1.0 },
    { Icon: TapeReelIcon,  x: 55, y: 35, size: 40, depth: 0.85, floatDuration:  4, floatDelay: 0.0 },
  ],
  partnership: [
    // Distant
    { Icon: Guitar,        x: 15, y: 12, size: 15, depth: 0.20, floatDuration:  9, floatDelay: 0.5 },
    { Icon: Music,         x: 80, y:  8, size: 14, depth: 0.18, floatDuration: 11, floatDelay: 2.0 },
    { Icon: Disc3,         x: 40, y: 85, size: 16, depth: 0.22, floatDuration:  8, floatDelay: 1.0 },
    { Icon: DrumIcon,      x: 70, y: 80, size: 15, depth: 0.20, floatDuration: 10, floatDelay: 3.0 },
    { Icon: TapeReelIcon,  x: 55, y:  5, size: 15, depth: 0.22, floatDuration: 10, floatDelay: 1.5 },
    { Icon: Mic2,          x: 25, y: 28, size: 14, depth: 0.19, floatDuration:  9, floatDelay: 3.0 },
    { Icon: Guitar,        x: 85, y: 88, size: 16, depth: 0.21, floatDuration: 11, floatDelay: 0.5 },
    { Icon: PianoKeysIcon, x: 48, y: 92, size: 14, depth: 0.20, floatDuration:  9, floatDelay: 2.5 },
    { Icon: Music,         x: 35, y: 50, size: 15, depth: 0.19, floatDuration: 10, floatDelay: 1.0 },
    // Mid
    { Icon: Headphones,    x:  8, y: 40, size: 24, depth: 0.42, floatDuration:  7, floatDelay: 0.0 },
    { Icon: TapeReelIcon,  x: 88, y: 35, size: 26, depth: 0.48, floatDuration:  6, floatDelay: 1.5 },
    { Icon: Mic2,          x: 20, y: 65, size: 22, depth: 0.36, floatDuration:  8, floatDelay: 2.0 },
    { Icon: DrumIcon,      x: 42, y: 30, size: 22, depth: 0.40, floatDuration:  7, floatDelay: 1.0 },
    { Icon: PianoKeysIcon, x: 62, y: 55, size: 24, depth: 0.44, floatDuration:  6, floatDelay: 2.5 },
    { Icon: Guitar,        x: 35, y: 80, size: 22, depth: 0.38, floatDuration:  7, floatDelay: 0.5 },
    // Close
    { Icon: PianoKeysIcon, x: 90, y: 60, size: 38, depth: 0.82, floatDuration:  4.5, floatDelay: 1.0 },
    { Icon: Guitar,        x:  5, y: 68, size: 42, depth: 0.95, floatDuration:  4, floatDelay: 0.0 },
    { Icon: Disc3,         x: 48, y: 15, size: 36, depth: 0.78, floatDuration:  5, floatDelay: 1.5 },
    { Icon: Music,         x: 72, y: 45, size: 40, depth: 0.88, floatDuration:  4, floatDelay: 0.0 },
    { Icon: TapeReelIcon,  x: 30, y: 52, size: 38, depth: 0.82, floatDuration:  4.5, floatDelay: 2.0 },
  ],
  faq: [
    // Distant
    { Icon: Music,         x: 10, y: 20, size: 15, depth: 0.20, floatDuration: 10, floatDelay: 0.0 },
    { Icon: Disc3,         x: 85, y: 15, size: 14, depth: 0.22, floatDuration:  9, floatDelay: 1.0 },
    { Icon: Guitar,        x: 50, y: 82, size: 15, depth: 0.18, floatDuration: 11, floatDelay: 2.5 },
    { Icon: DrumIcon,      x: 32, y:  8, size: 14, depth: 0.22, floatDuration: 10, floatDelay: 1.5 },
    { Icon: TapeReelIcon,  x: 68, y: 88, size: 15, depth: 0.19, floatDuration:  9, floatDelay: 3.0 },
    { Icon: Mic2,          x: 78, y: 55, size: 14, depth: 0.21, floatDuration: 11, floatDelay: 0.5 },
    { Icon: Headphones,    x: 18, y:  8, size: 15, depth: 0.20, floatDuration: 10, floatDelay: 2.0 },
    { Icon: PianoKeysIcon, x: 58, y: 28, size: 14, depth: 0.23, floatDuration:  9, floatDelay: 0.0 },
    // Mid
    { Icon: TapeReelIcon,  x:  6, y: 45, size: 24, depth: 0.42, floatDuration:  7, floatDelay: 0.5 },
    { Icon: DrumIcon,      x: 90, y: 40, size: 26, depth: 0.46, floatDuration:  6, floatDelay: 1.5 },
    { Icon: Mic2,          x: 22, y: 70, size: 22, depth: 0.38, floatDuration:  8, floatDelay: 0.0 },
    { Icon: PianoKeysIcon, x: 45, y: 30, size: 22, depth: 0.40, floatDuration:  7, floatDelay: 1.0 },
    { Icon: Guitar,        x: 62, y: 65, size: 24, depth: 0.44, floatDuration:  6, floatDelay: 2.0 },
    { Icon: Disc3,         x: 18, y: 35, size: 22, depth: 0.38, floatDuration:  7, floatDelay: 0.5 },
    // Close
    { Icon: Headphones,    x: 92, y: 65, size: 36, depth: 0.78, floatDuration:  5, floatDelay: 1.0 },
    { Icon: Music,         x:  4, y: 58, size: 40, depth: 0.92, floatDuration:  4, floatDelay: 0.5 },
    { Icon: TapeReelIcon,  x: 52, y: 12, size: 36, depth: 0.80, floatDuration:  5, floatDelay: 1.5 },
    { Icon: Guitar,        x: 30, y: 78, size: 40, depth: 0.88, floatDuration:  4, floatDelay: 0.0 },
  ],
  form: [
    // Distant
    { Icon: Guitar,        x:  8, y: 12, size: 15, depth: 0.20, floatDuration:  9, floatDelay: 0.0 },
    { Icon: Music,         x: 75, y:  8, size: 14, depth: 0.22, floatDuration: 11, floatDelay: 1.0 },
    { Icon: Disc3,         x: 45, y: 88, size: 15, depth: 0.18, floatDuration: 10, floatDelay: 2.0 },
    { Icon: Mic2,          x: 88, y: 82, size: 16, depth: 0.24, floatDuration:  8, floatDelay: 3.0 },
    { Icon: DrumIcon,      x: 22, y: 90, size: 15, depth: 0.20, floatDuration:  9, floatDelay: 0.5 },
    { Icon: TapeReelIcon,  x: 35, y:  5, size: 14, depth: 0.22, floatDuration: 10, floatDelay: 1.5 },
    { Icon: Headphones,    x: 60, y: 92, size: 15, depth: 0.19, floatDuration:  9, floatDelay: 3.0 },
    { Icon: PianoKeysIcon, x: 52, y: 18, size: 14, depth: 0.21, floatDuration: 11, floatDelay: 0.5 },
    { Icon: Guitar,        x: 28, y: 75, size: 16, depth: 0.23, floatDuration:  8, floatDelay: 2.5 },
    { Icon: Music,         x: 65, y: 45, size: 15, depth: 0.20, floatDuration: 10, floatDelay: 0.0 },
    // Mid
    { Icon: TapeReelIcon,  x:  4, y: 30, size: 24, depth: 0.40, floatDuration:  7, floatDelay: 1.0 },
    { Icon: PianoKeysIcon, x: 92, y: 28, size: 26, depth: 0.46, floatDuration:  6, floatDelay: 0.0 },
    { Icon: Headphones,    x: 15, y: 55, size: 22, depth: 0.42, floatDuration:  7, floatDelay: 2.0 },
    { Icon: Guitar,        x: 85, y: 50, size: 24, depth: 0.44, floatDuration:  8, floatDelay: 1.5 },
    { Icon: Mic2,          x: 50, y: 45, size: 22, depth: 0.40, floatDuration:  7, floatDelay: 0.0 },
    { Icon: DrumIcon,      x: 70, y: 35, size: 24, depth: 0.44, floatDuration:  6, floatDelay: 2.0 },
    { Icon: TapeReelIcon,  x: 35, y: 62, size: 22, depth: 0.38, floatDuration:  7, floatDelay: 1.0 },
    { Icon: Headphones,    x: 60, y: 75, size: 24, depth: 0.42, floatDuration:  8, floatDelay: 3.0 },
    // Close
    { Icon: Music,         x:  5, y: 68, size: 36, depth: 0.75, floatDuration:  5, floatDelay: 0.5 },
    { Icon: Disc3,         x: 90, y: 65, size: 40, depth: 0.88, floatDuration:  4, floatDelay: 1.0 },
    { Icon: TapeReelIcon,  x: 10, y: 38, size: 44, depth: 1.00, floatDuration:  4, floatDelay: 2.0 },
    { Icon: Guitar,        x: 48, y: 20, size: 36, depth: 0.78, floatDuration:  5, floatDelay: 1.5 },
    { Icon: DrumIcon,      x: 30, y: 50, size: 40, depth: 0.86, floatDuration:  4, floatDelay: 0.0 },
    { Icon: PianoKeysIcon, x: 70, y: 55, size: 38, depth: 0.82, floatDuration:  4.5, floatDelay: 2.5 },
  ],
}

interface FloatingMusicIconsProps {
  variant?: "hero" | "process" | "partnership" | "faq" | "form"
}

export function FloatingMusicIcons({ variant = "hero" }: FloatingMusicIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const progress = 0.5 - (rect.top + rect.height / 2) / window.innerHeight
      setScrollProgress(progress)
      setIsScrolling(true)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = setTimeout(() => setIsScrolling(false), 150)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {iconConfigs[variant].map((item, index) => {
        const opacity = 0.12 + item.depth * 0.22
        const ty = isScrolling ? scrollProgress * item.depth * PARALLAX_STRENGTH : 0

        return (
          <div
            key={index}
            className="absolute text-primary"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              opacity,
              willChange: "transform",
              transition: isScrolling ? "transform 0.08s linear" : "transform 0.6s ease-out",
              transform: `translate(-50%, calc(-50% + ${ty}px))`,
            }}
          >
            <item.Icon
              style={{
                width: item.size,
                height: item.size,
                animation: `iconFloat ${item.floatDuration}s ease-in-out ${item.floatDelay}s infinite`,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
