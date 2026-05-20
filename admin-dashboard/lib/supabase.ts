import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Safety check to prevent app crash if env vars are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'MISSING SUPABASE CREDENTIALS: Check your .env.local file. ' +
      'The app will likely fail to fetch data.'
    )
  }

  // Detect Clerk key mistake
  if (supabaseAnonKey?.startsWith('sb_publishable_')) {
    console.error(
      'INVALID API KEY: You are using a Clerk Publishable Key instead of a Supabase Anon Key. ' +
      'Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local with the key from your Supabase Dashboard.'
    )
  }

  // Ensure we have a valid URL format for the client, even if placeholder
  const finalUrl = supabaseUrl?.startsWith('http') 
    ? supabaseUrl 
    : 'https://placeholder-url.supabase.co'

  return createBrowserClient(
    finalUrl,
    supabaseAnonKey || ''
  )
}
