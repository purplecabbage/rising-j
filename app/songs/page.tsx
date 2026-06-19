import Link from "next/link"
import { getPublicSongs } from "@/lib/data"

export const dynamic = 'force-dynamic'

export const metadata = { title: "Songs" }

export default async function SongsPage() {
  const songs = await getPublicSongs()

  if (songs.length === 0) {
    return (
      <p className="py-20 text-center text-gray-500">No songs available yet.</p>
    )
  }

  return (
    <div className="pt-20 px-6 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {songs.map((song) => (
          <Link
            key={song.id}
            href={`/songs/${song.slug}`}
            className="group block aspect-square overflow-hidden rounded-lg bg-gray-900 shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {song.cover_image ? (
              <img
                src={song.cover_image}
                alt={song.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MusicIcon className="w-20 h-20 text-gray-600" />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}
