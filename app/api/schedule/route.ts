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

    const { data, error } = await supabase
      .from("scheduled_meetings")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })

    if (error) throw error

    return NextResponse.json({ schedules: data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClientInstance()
    const { userId, date, startTime, endTime } = await request.json()

    if (!userId || !date || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase.from("scheduled_meetings").insert([
      {
        user_id: userId,
        date,
        start_time: startTime,
        end_time: endTime,
      },
    ])

    if (error) throw error

    return NextResponse.json({ schedule: data })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
