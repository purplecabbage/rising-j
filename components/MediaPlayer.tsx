"use client"

import { useRef, useState, useEffect, useMemo } from "react"

interface MediaPlayerProps {
  src: string
  title?: string
}

// Decode once at high resolution, downsample for display
const RAW_SAMPLES = 600

// ~150 bars at 800px, clamped to [60, 200]
function barsForWidth(w: number) {
  return Math.max(60, Math.min(200, Math.round((w * 150) / 800)))
}

export default function MediaPlayer({ src, title }: MediaPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [rawPeaks, setRawPeaks] = useState<Float32Array | null>(null)
  const [waveformError, setWaveformError] = useState(false)
  const [bars, setBars] = useState(150)
  const [canvasWidth, setCanvasWidth] = useState(800)

  // After mount: restore volume from localStorage, then apply to audio element
  useEffect(() => {
    const stored = localStorage.getItem("player-volume")
    const v = stored !== null ? Number(stored) : 0.5
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  // Watch container width → update bar count + canvas width state
  // (canvas.width is set inside the draw effect so clear+draw are atomic)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width)
      setCanvasWidth(w)
      setBars(barsForWidth(w))
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Fetch + decode audio → high-res RMS peaks, cached in sessionStorage
  useEffect(() => {
    if (!src) return
    let cancelled = false

    ;(async () => {
      try {
        // Check sessionStorage cache first — peaks never change for a given track
        const cacheKey = `waveform:${src}`
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          const arr = JSON.parse(cached) as number[]
          if (!cancelled) setRawPeaks(new Float32Array(arr))
          return
        }

        // Route through server-side proxy to avoid CORS issues with cross-origin audio files
        const proxiedUrl = `/api/audio-proxy?url=${encodeURIComponent(src)}`
        const buf = await fetch(proxiedUrl).then((r) => r.arrayBuffer())
        if (cancelled) return

        const actx = new AudioContext()
        const decoded = await actx.decodeAudioData(buf)
        actx.close()
        if (cancelled) return

        const data = decoded.getChannelData(0)
        const blockSize = Math.floor(data.length / RAW_SAMPLES)
        const p = new Float32Array(RAW_SAMPLES)

        for (let i = 0; i < RAW_SAMPLES; i++) {
          let sum = 0
          for (let j = 0; j < blockSize; j++) sum += data[i * blockSize + j] ** 2
          p[i] = Math.sqrt(sum / blockSize)
        }

        let max = 0
        for (let i = 0; i < p.length; i++) if (p[i] > max) max = p[i]
        if (max > 0) for (let i = 0; i < p.length; i++) p[i] /= max

        // Persist to sessionStorage as a plain number array
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(Array.from(p)))
        } catch {
          // sessionStorage may be full or unavailable — not fatal
        }

        if (!cancelled) setRawPeaks(p)
      } catch {
        if (!cancelled) setWaveformError(true)
      }
    })()

    return () => { cancelled = true }
  }, [src])

  // Downsample high-res peaks → current bar count
  const peaks = useMemo<Float32Array | null>(() => {
    if (!rawPeaks) return null
    const p = new Float32Array(bars)
    const ratio = RAW_SAMPLES / bars
    for (let i = 0; i < bars; i++) {
      const start = Math.floor(i * ratio)
      const end = Math.min(Math.floor((i + 1) * ratio), RAW_SAMPLES)
      let max = 0
      for (let j = start; j < end; j++) if (rawPeaks[j] > max) max = rawPeaks[j]
      p[i] = max
    }
    return p
  }, [rawPeaks, bars])

  // Redraw canvas whenever peaks, time, duration, or canvas width change.
  // Setting canvas.width here (not in the ResizeObserver) ensures clear+draw
  // are atomic — no blank frames after resize.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !peaks) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvasWidth
    const W = canvasWidth
    const H = canvas.height
    const progress = duration > 0 ? currentTime / duration : 0
    const barW = W / peaks.length

    ctx.clearRect(0, 0, W, H)

    for (let i = 0; i < peaks.length; i++) {
      const barH = Math.max(3, peaks[i] * H * 0.88)
      const x = i * barW
      ctx.fillStyle = i / peaks.length < progress ? "#ffffff" : "rgba(255,255,255,0.22)"
      ctx.beginPath()
      ctx.roundRect(x + 1.5, (H - barH) / 2, barW - 3, barH, 2)
      ctx.fill()
    }
  }, [peaks, currentTime, duration, canvasWidth])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    playing ? a.pause() : a.play()
    setPlaying(!playing)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const a = audioRef.current
    if (!a || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const t = ((e.clientX - rect.left) / rect.width) * duration
    a.currentTime = t
    setCurrentTime(t)
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    setVolume(v)
    localStorage.setItem("player-volume", String(v))
    if (audioRef.current) audioRef.current.volume = v
  }

  const fmt = (s: number) =>
    !s || isNaN(s)
      ? "0:00"
      : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`

  return (
    <div className="bg-gray-900 text-white rounded-xl p-5 space-y-4 w-full">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => { setPlaying(false); setCurrentTime(0) }}
      />

      {title && (
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 truncate">
          {title}
        </p>
      )}

      {/* Waveform area */}
      <div ref={containerRef} className="w-full">
        {peaks ? (
          <canvas
            ref={canvasRef}
            width={800}
            height={72}
            onClick={handleCanvasClick}
            className="w-full cursor-pointer rounded"
          />
        ) : waveformError ? (
          <div
            className="h-16 bg-white/10 rounded cursor-pointer relative overflow-hidden"
            onClick={(e) => {
              const a = audioRef.current
              if (!a || !duration) return
              const rect = e.currentTarget.getBoundingClientRect()
              const t = ((e.clientX - rect.left) / rect.width) * duration
              a.currentTime = t
              setCurrentTime(t)
            }}
          >
            <div
              className="h-full bg-white/40"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
        ) : (
          <div className="h-16 flex items-end gap-px">
            {Array.from({ length: bars }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-white/15 rounded-sm animate-pulse"
                style={{
                  height: `${30 + Math.abs(Math.sin(i * 0.37)) * 60}%`,
                  animationDelay: `${(i % 10) * 70}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-colors"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>

        <span className="text-xs tabular-nums text-gray-400 w-9">{fmt(currentTime)}</span>
        <span className="text-xs text-gray-600">/</span>
        <span className="text-xs tabular-nums text-gray-500">{fmt(duration)}</span>

        <div className="flex items-center gap-2 ml-auto">
          <VolumeIcon volume={volume} className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            className="w-20 accent-white cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}

function VolumeIcon({ volume, className }: { volume: number; className?: string }) {
  if (volume === 0) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    )
  }
  if (volume < 0.5) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    )
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}
