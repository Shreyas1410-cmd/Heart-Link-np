import { createServerClientInstance } from "@/lib/supabase"
import { createDailyRoom } from "@/lib/daily"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClientInstance()
    const { userId, userRole } = await request.json()

    if (!userId || !userRole) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the user's scheduled meetings
    const { data: userSchedules, error: scheduleError } = await supabase
      .from("scheduled_meetings")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(1)

    if (scheduleError) throw scheduleError
    if (!userSchedules || userSchedules.length === 0) {
      return NextResponse.json({ message: "No schedules found" })
    }

    const userSchedule = userSchedules[0]

    // Find potential matches with opposite role
    const oppositeRole = userRole === "student" ? "elderly" : "student"

    const { data: potentialMatches, error: matchError } = await supabase
      .from("scheduled_meetings")
      .select("user_id")
      .eq("date", userSchedule.date)
      .gte("start_time", userSchedule.start_time)
      .lte("end_time", userSchedule.end_time)

    if (matchError) throw matchError

    // Filter out already matched users and get their profiles
    const matchedUserIds = potentialMatches?.map((m) => m.user_id) || []

    if (matchedUserIds.length === 0) {
      return NextResponse.json({ message: "No matches found" })
    }

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("user_id")
      .in("user_id", matchedUserIds)
      .eq("role", oppositeRole)

    if (profileError) throw profileError
    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: "No compatible matches found" })
    }

    // Create match with first available user
    const matchedUserId = profiles[0].user_id

    // Check if match already exists
    const { data: existingMatch } = await supabase
      .from("matches")
      .select("id")
      .or(
        `and(student_id.eq.${userRole === "student" ? userId : matchedUserId},elderly_id.eq.${userRole === "elderly" ? userId : matchedUserId})`,
      )
      .limit(1)

    if (existingMatch && existingMatch.length > 0) {
      return NextResponse.json({ message: "Match already exists" })
    }

    // Create Daily.co room
    const roomName = `heartlink-${Date.now()}`
    const dailyRoomUrl = await createDailyRoom(roomName)

    // Create match record
    const { data: newMatch, error: createMatchError } = await supabase.from("matches").insert([
      {
        student_id: userRole === "student" ? userId : matchedUserId,
        elderly_id: userRole === "elderly" ? userId : matchedUserId,
        meeting_date: userSchedule.date,
        meeting_time: userSchedule.start_time,
        daily_room_url: dailyRoomUrl,
        status: "active",
      },
    ])

    if (createMatchError) throw createMatchError

    return NextResponse.json({ match: newMatch, success: true })
  } catch (error) {
    console.error("Matching error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
