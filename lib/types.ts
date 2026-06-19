export interface Post {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  cover_image: string | null
  published_at: string
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  created_at: string
  updated_at: string
}

export interface Song {
  id: string
  slug: string
  title: string
  description: string | null
  cover_image: string | null
  published_at: string
  visibility: 'private' | 'protected' | 'public'
  apple_music_link: string | null
  spotify_link: string | null
  amazon_music_link: string | null
  stream_url: string | null
  disco_track_id: string | null
  audio_file: string | null
  created_at: string
  updated_at: string
}

export interface Press {
  id: string
  slug: string
  title: string
  description: string | null
  content: string
  cover_image: string | null
  published_at: string
  created_at: string
  updated_at: string
}

export type ContentType = 'posts' | 'pages' | 'songs' | 'press'
