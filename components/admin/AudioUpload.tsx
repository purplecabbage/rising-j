"use client"

import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"

interface AudioUploadProps {
  value: string
  onChange: (url: string) => void
}

export function AudioUpload({ value, onChange }: AudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError(null)

    try {
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
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
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
            onClick={() => onChange("")}
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
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2 text-sm bg-background"
        />
      </div>

      {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
    </div>
  )
}
