"use client"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { AudioUpload } from "@/components/admin/AudioUpload"
import type { Song } from "@/lib/types"

interface SongFormProps {
  song?: Song
}

export function SongForm({ song }: SongFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!song

  const [formData, setFormData] = useState({
    title: song?.title ?? "",
    slug: song?.slug ?? "",
    description: song?.description ?? "",
    cover_image: song?.cover_image ?? "",
    visibility: song?.visibility ?? "private",
    apple_music_link: song?.apple_music_link ?? "",
    spotify_link: song?.spotify_link ?? "",
    amazon_music_link: song?.amazon_music_link ?? "",
    stream_url: song?.stream_url ?? "",
    disco_track_id: song?.disco_track_id ?? "",
    audio_file: song?.audio_file ?? "",
    published_at: song?.published_at 
      ? new Date(song.published_at).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const data = {
      ...formData,
      published_at: new Date(formData.published_at).toISOString(),
    }

    if (isEditing) {
      const { error } = await supabase
        .from("songs")
        .update(data)
        .eq("id", song.id)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.from("songs").insert(data)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
    }

    router.push("/admin/songs")
    router.refresh()
  }

  const handleDelete = async () => {
    if (!song) return

    setLoading(true)
    const { error } = await supabase.from("songs").delete().eq("id", song.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push("/admin/songs")
    router.refresh()
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setFormData({ ...formData, slug })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Song" : "New Song"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                onBlur={() => !isEditing && !formData.slug && generateSlug()}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <ImageUpload
            value={formData.cover_image}
            onChange={(url) => setFormData({ ...formData, cover_image: url })}
          />

          <AudioUpload
            value={formData.audio_file}
            onChange={(url) => setFormData({ ...formData, audio_file: url })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <select
                id="visibility"
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="private">Private</option>
                <option value="protected">Protected</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="published_at">Published At</Label>
              <Input
                id="published_at"
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="apple_music_link">Apple Music Link</Label>
              <Input
                id="apple_music_link"
                value={formData.apple_music_link}
                onChange={(e) => setFormData({ ...formData, apple_music_link: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spotify_link">Spotify Link</Label>
              <Input
                id="spotify_link"
                value={formData.spotify_link}
                onChange={(e) => setFormData({ ...formData, spotify_link: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amazon_music_link">Amazon Music Link</Label>
              <Input
                id="amazon_music_link"
                value={formData.amazon_music_link}
                onChange={(e) => setFormData({ ...formData, amazon_music_link: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stream_url">Stream URL</Label>
              <Input
                id="stream_url"
                value={formData.stream_url}
                onChange={(e) => setFormData({ ...formData, stream_url: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="disco_track_id">Disco Track ID</Label>
            <Input
              id="disco_track_id"
              value={formData.disco_track_id}
              onChange={(e) => setFormData({ ...formData, disco_track_id: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-4 items-center">
            <button
              type="button"
              onClick={() => router.push("/admin/songs")}
              disabled={loading}
              className="border py-2 px-4 rounded-md hover:bg-muted disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Saving..." : isEditing ? "Update Song" : "Create Song"}
            </button>
            {isEditing && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={loading}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                Delete
              </button>
            )}
            {isEditing && confirmDelete && (
              <>
                <span className="text-sm text-red-600 font-medium">Are you sure?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={loading}
                  className="border py-2 px-4 rounded-md hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
