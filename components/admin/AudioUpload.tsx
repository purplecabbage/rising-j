"use client"

import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"

const PEAK_SAMPLES = 600

async function computePeaks(buffer: ArrayBuffer): Promise<number[]> {
  const actx = new AudioContext()
  const decoded = await actx.decodeAudioData(buffer)
  actx.close()

  const data = decoded.getChannelData(0)
  const blockSize = Math.floor(data.length / PEAK_SAMPLES)
  const peaks = new Float32Array(PEAK_SAMPLES)

  for (let i = 0; i < PEAK_SAMPLES; i++) {
    let sum = 0
    for (let j = 0; j < blockSize; j++) sum += data[i * blockSize + j] ** 2
    peaks[i] = Math.sqrt(sum / blockSize)
  }

  let max = 0
  for (let i = 0; i < peaks.length; i++) if (peaks[i] > max) max = peaks[i]
  if (max > 0) for (let i = 0; i < peaks.length; i++) peaks[i] /= max

  return Array.from(peaks)
}

interface AudioUploadProps {
  value: string
  onChange: (url: string) => void
  onPeaksChange?: (peaks: number[] | null) => void
}

export function AudioUpload({ value, onChange, onPeaksChange }: AudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [peaksStatus, setPeaksStatus] = useState<"idle" | "computing" | "done" | "error">("idle")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)
    onPeaksChange?.(null)
    setPeaksStatus("idle")

    try {
      // Read file buffer for peak computation before upload
      const buffer = await file.arrayBuffer()

      const response = await fetch(
        `/api/projects/upload?filename=${encodeURIComponent(file.name)}`,
        { method: "POST", body: file }
      )

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? "Upload failed")
      }

      const blob = await response.json()
      onChange(blob.url)

      // Compute peaks from the local buffer — no CORS, no proxy needed
      setPeaksStatus("computing")
      const peaks = await computePeaks(buffer)
      onPeaksChange?.(peaks)
      setPeaksStatus("done")
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
      setPeaksStatus("error")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  // When a URL is pasted, fetch it through the proxy and compute peaks
  const handleUrlChange = async (url: string) => {
    onChange(url)
    if (!url) {
      onPeaksChange?.(null)
      setPeaksStatus("idle")
      return
    }

    // Debounce: only compute when URL looks complete
    if (!url.startsWith("http") || !url.includes(".mp3")) return

    try {
      setPeaksStatus("computing")
      onPeaksChange?.(null)
      const proxiedUrl = `/api/audio-proxy?url=${encodeURIComponent(url)}`
      const buf = await fetch(proxiedUrl).then((r) => r.arrayBuffer())
      const peaks = await computePeaks(buf)
      onPeaksChange?.(peaks)
      setPeaksStatus("done")
    } catch {
      setPeaksStatus("error")
    }
  }

  return (
    <div className="space-y-2">
      <Label>Audio File (MP3)</Label>

      {value && (
        <div className="flex items-center gap-3 p-3 border rounded-md bg-muted">
          <audio controls src={value} className="flex-1 h-8" />
          <button
            type="button"
            onClick={() => { onChange(""); onPeaksChange?.(null); setPeaksStatus("idle") }}
            className="text-xs text-red-500 hover:text-red-700 whitespace-nowrap"
          >
            Remove
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,.mp3"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="border py-2 px-4 rounded-md text-sm hover:bg-muted disabled:opacity-50"
        >
          {uploading ? "Uploading…" : value ? "Replace MP3" : "Upload MP3"}
        </button>

        <input
          type="url"
          placeholder="or paste URL"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2 text-sm bg-background"
        />
      </div>

      {peaksStatus === "computing" && (
        <p className="text-xs text-muted-foreground">Computing waveform peaks…</p>
      )}
      {peaksStatus === "done" && (
        <p className="text-xs text-green-600">Waveform peaks computed and ready to save.</p>
      )}
      {peaksStatus === "error" && (
        <p className="text-xs text-amber-600">Could not compute waveform peaks — will fall back to live decode on playback.</p>
      )}

      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
    </div>
  )
}
