import { type NextRequest, NextResponse } from "next/server"
import { createServerClientInstance } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ["/", "/auth/login", "/auth/signup", "/auth/callback"]
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected routes
  const protectedRoutes = ["/dashboard", "/schedule", "/meeting"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    try {
      const supabase = await createServerClientInstance()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.redirect(new URL("/auth/login", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
