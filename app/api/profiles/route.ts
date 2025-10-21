import { createServerClientInstance } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClientInstance()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).single()

    if (error) throw error

    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClientInstance()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, bio } = await request.json()

    const { data, error } = await supabase
      .from("profiles")
      .update({ name, bio, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ profile: data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
