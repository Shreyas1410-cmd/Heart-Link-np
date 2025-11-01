import { createBrowserClient } from "@supabase/ssr"

const url = "https://uvrpnjxmekszkfepgvwq.supabase.co"
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cnBuanhtZWtzemtmZXBndndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NzczNTksImV4cCI6MjA3NjQ1MzM1OX0.9niJKiriiCZfyQnKy_qbkKMw1vrOTemFgkc3iPsY4-o"

export function createClient() {
  return createBrowserClient(url, key)
}

export async function createServerClientInstance() {
  const { cookies } = await import("next/headers")
  const { createServerClient } = await import("@supabase/ssr")

  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Ignore errors from Server Components
        }
      },
    },
  })
}
