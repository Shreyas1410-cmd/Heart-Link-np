import { createServerClientInstance } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClientInstance()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status") || "active"

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .or(`student_id.eq.${userId},elderly_id.eq.${userId}`)
      .eq("status", status)
      .order("meeting_date", { ascending: true })

    if (error) throw error

    return NextResponse.json({ matches: data })
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

    const { matchId, status } = await request.json()

    if (!matchId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("matches")
      .update({ status })
      .eq("id", matchId)
      .or(`student_id.eq.${user.id},elderly_id.eq.${user.id}`)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ match: data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
