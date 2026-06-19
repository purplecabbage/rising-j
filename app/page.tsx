import StreamLinks from "@/components/StreamLinks"
import { getAllPosts, getPublicSongs } from "@/lib/data"

// Use dynamic rendering since database may not be available at build time
export const dynamic = 'force-dynamic'

export default async function Home() {
  const songs = await getPublicSongs()
  const posts = await getAllPosts()
  
  const song = songs[0] // Get the most recent public song
  const post = posts[0] // Get the most recent post

  if (!song && !post) {
    return (
      <article className="m-auto py-20 px-5 sm:px-20">
        <img src="/RisingJ-7.png" alt="Rising J" width="500px" style={{margin: 'auto'}} />
        <p className="text-center mt-8">Welcome to Rising J</p>
      </article>
    )
  }

  return (
    <div className="min-w-full">
      <article className="py-12 min-w-full px-5 sm:px-20 bg-fixed bg-center"
      style={{  
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundImage: post?.cover_image ? `url(${post.cover_image})` : 'url(/RisingJ-bg.png)',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className="min-w-full px-5 sm:px-20 bg-fixed bg-cover bg-center h-screen">
          <div>
            <img src="/RisingJ-7.png" alt="Rising J" width="500px" style={{margin: 'auto'}} />
          </div>
          {post && (
            <div className="bg-white/20 backdrop-blur-sm dark:bg-gray-900/10 p-5 w-full text-black dark:text-slate-100 rounded-lg">
              <p className="mb-2">From the blog:</p>
              <a className="mb-2" href={`/posts/${post.slug}`}>
                {post.title}
              </a>
              <p className="text-xl mt-0">
                {post.description}
              </p>
            </div>
          )}
        </div>
      </article>

      {song && (
        <article className="py-4 prose dark:prose-invert min-w-full px-5 sm:px-20">
          <p>Streaming now</p>
          <a className="mb-2" href={`/songs/${song.slug}`}>
            {song.title}
          </a>
          {song.description && (
            <p className="text-xl mt-0 text-slate-700 dark:text-slate-200">
              {song.description}
            </p>
          )}
          <StreamLinks
            title={song.title}
            appleMusicLink={song.apple_music_link || undefined}
            spotifyLink={song.spotify_link || undefined}
            amazonMusicLink={song.amazon_music_link || undefined}
            streamUrl={song.stream_url || undefined}
            discoTrackId={song.disco_track_id || undefined}
            audioFile={song.audio_file || undefined}
          />
        </article>
      )}
    </div>
  )
}
