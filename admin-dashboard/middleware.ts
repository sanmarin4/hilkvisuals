import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const response = NextResponse.next({ request: { headers: request.headers } })

  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string) {
          response.cookies.delete(name)
        },
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const isLoginPage = request.nextUrl.pathname === '/login'
    const isPublicAsset = request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.includes('.')

    if (!user && !isLoginPage && !isPublicAsset) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isLoginPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch (error) {
    console.error('Middleware Auth Error:', error)
    if (request.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
