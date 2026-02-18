// Middleware - Route Protection & Auth
// 处理认证和角色分发

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user has role
  let userRole = 'student'
  if (user) {
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roles) {
      userRole = roles.role
    }
  }

  // Check if user has completed onboarding
  let onboardingCompleted = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profile) {
      onboardingCompleted = profile.onboarding_completed
    }
  }

  const path = request.nextUrl.pathname

  // Allow auth callback to proceed without checks
  if (path === '/auth/callback') {
    return response
  }

  // Protect /dashboard/* routes
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to onboarding if not completed
    if (!onboardingCompleted && path !== '/dashboard/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  // Protect /admin/* routes
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect /onboarding if already completed
  if (path === '/onboarding') {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (onboardingCompleted) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect /login if already logged in
  if (path === '/login' && user) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    if (!onboardingCompleted) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/onboarding',
    '/auth/callback',
  ],
}
