import { notFound } from "next/navigation"
import { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import StreamLinks from "@/components/StreamLinks"
import { getSongBySlug } from "@/lib/data"

// Use dynamic rendering since database may not be available at build time
export const dynamic = 'force-dynamic'

interface SongProps {
  params: Promise<{
    slug: string[]
  }>
}

async function getSongFromParams(params: SongProps["params"]) {
  const { slug } = await params
  const slugString = slug?.join("/")
  const song = await getSongBySlug(slugString)
  return song
}

export async function generateMetadata({
  params,
}: SongProps): Promise<Metadata> {
  const song = await getSongFromParams(params)

  if (!song) {
    return {}
  }

  return {
    title: song.title,
    description: song.description || undefined,
  }
}



export default async function SongPage({ params }: SongProps) {
  const song = await getSongFromParams(params)

  if (!song) {
    notFound()
  }

  return (
    <div className="relative min-h-screen">
      {/* Blurred album art background */}
      {song.cover_image && (
        <div
          className="fixed inset-0 -z-10"
          aria-hidden="true"
        >
          <img
            src={song.cover_image}
            alt=""
            className="w-full h-full object-cover scale-100"
            style={{ filter: "blur(3px)" }}
          />
          {/* Dark overlay to improve readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <article className="py-20 min-w-full px-5 sm:px-20 max-w-3xl mx-auto">
        {/* Album art card */}
        {song.cover_image && (
          <div className="flex justify-center mb-8">
            <img
              src={song.cover_image}
              alt={song.title}
              className="w-72 sm:w-[28rem] rounded-xl shadow-2xl"
            />
          </div>
        )}

        {/* Title & description */}
        <div className="rounded-xl bg-white/15 dark:bg-black/30 backdrop-blur-md border border-white/20 px-6 py-5 mb-4 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2 text-balance">{song.title}</h1>
          {song.description && (
            <div className="prose prose-invert prose-lg max-w-none
              prose-p:text-white/85 prose-p:leading-relaxed prose-p:my-2
              prose-headings:text-white prose-strong:text-white
              prose-em:text-white/90 prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline
              prose-ul:text-white/85 prose-ol:text-white/85 prose-li:my-0.5
              prose-hr:border-white/20">
              <ReactMarkdown>{song.description}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Streaming links */}
        <div className="rounded-xl bg-white/15 dark:bg-black/30 backdrop-blur-md border border-white/20 px-6 shadow-lg">
          <StreamLinks
            title={song.title}
            appleMusicLink={song.apple_music_link || undefined}
            spotifyLink={song.spotify_link || undefined}
            amazonMusicLink={song.amazon_music_link || undefined}
            streamUrl={song.stream_url || undefined}
            discoTrackId={song.disco_track_id || undefined}
            audioFile={song.audio_file || undefined}
            waveformPeaks={song.waveform_peaks}
          />
        </div>
      </article>
    </div>
  )
}
