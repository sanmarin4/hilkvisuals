import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

declare const require: any

const authOptions: any = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
}

if (typeof window !== 'undefined') {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default
  authOptions.storage = AsyncStorage
}

function getExpoExtra(): Record<string, string> | undefined {
  const manifest = Constants.expoConfig ?? Constants.manifest ?? (Constants as any).manifest
  return (manifest as any)?.extra as Record<string, string> | undefined
}

function getSupabaseCredentials() {
  const expoExtra = getExpoExtra()
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
    ?? process.env.VITE_SUPABASE_URL
    ?? expoExtra?.EXPO_PUBLIC_SUPABASE_URL
    ?? expoExtra?.VITE_SUPABASE_URL
    ?? 'https://vvrxramtwiqhmwcvogrg.supabase.co'
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ?? expoExtra?.EXPO_PUBLIC_SUPABASE_ANON_KEY
    ?? expoExtra?.VITE_SUPABASE_PUBLISHABLE_KEY
    ?? 'sb_publishable_Hz-oAVlZW_a7KWKtDR30jQ_nyRKgjTR'

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase credentials. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.')
  }

  return { supabaseUrl, supabaseAnonKey }
}

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseCredentials()
    supabaseClient = createClient(
      supabaseUrl ?? '',
      supabaseAnonKey ?? '',
      { auth: authOptions }
    )
  }
  return supabaseClient
}

export const checkSupabaseConnection = async () => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from('profiles').select('id').limit(1)

    if (error) {
      if (error.message?.includes('fetch')) return { success: false, error: 'Network error or invalid Supabase URL' }
      if (error.code === 'PGRST301') return { success: false, error: 'Invalid API Key' }
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
