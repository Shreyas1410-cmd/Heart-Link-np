import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.SUPABASE_URL || "https://dfwptsakuktvpxkgojfi.supabase.co"
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmd3B0c2FrdWt0dnB4a2dvamZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODAzMDQsImV4cCI6MjA3NjM1NjMwNH0.P3OdtgAPlcQyId7w9Bcf2oTAl0XSH8W3oo643uJwjew"

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

export async function createServerClientInstance() {
  const { cookies } = await import("next/headers")
  const { createServerClient } = await import("@supabase/ssr")

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}
