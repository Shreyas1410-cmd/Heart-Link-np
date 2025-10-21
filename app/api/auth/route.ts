import { createServerClientInstance } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClientInstance()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

    if (error) throw error

    return NextResponse.json({ user, profile })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClientInstance()
    const { action } = await request.json()

    if (action === "logout") {
      await supabase.auth.signOut()
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
