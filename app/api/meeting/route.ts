import { createServerClientInstance } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClientInstance()
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get("matchId")

    if (!matchId) {
      return NextResponse.json({ error: "Match ID required" }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get match and verify user is participant
    const { data: match, error } = await supabase
      .from("matches")
      .select("*")
      .eq("id", matchId)
      .or(`student_id.eq.${user.id},elderly_id.eq.${user.id}`)
      .single()

    if (error || !match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    return NextResponse.json({ match })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClientInstance()
    const { matchId, status } = await request.json()

    if (!matchId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update match status
    const { data: match, error } = await supabase
      .from("matches")
      .update({ status })
      .eq("id", matchId)
      .or(`student_id.eq.${user.id},elderly_id.eq.${user.id}`)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ match })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
