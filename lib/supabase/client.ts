import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    // Return a mock client so the app can still build/render when Supabase
    // is not configured. Auth and data calls will surface a clear error.
    return {
      from: () => ({
        select: () => ({
          order: () => ({ data: null, error: { message: 'Supabase not configured' } }),
          eq: () => ({
            single: () => ({ data: null, error: { message: 'Supabase not configured' } }),
            order: () => ({ data: null, error: { message: 'Supabase not configured' } }),
          }),
        }),
        insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
        update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
        delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({
          data: { user: null, session: null },
          error: { message: 'Supabase not configured' },
        }),
        signOut: async () => ({ error: null }),
      },
    } as unknown as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
