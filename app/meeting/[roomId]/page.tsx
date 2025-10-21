"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { Match } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Meeting() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Extract room ID from URL
        const roomId = params.roomId as string

        // Find match by room URL
        const { data, error: matchError } = await supabase
          .from("matches")
          .select("*")
          .or(`student_id.eq.${user.id},elderly_id.eq.${user.id}`)
          .eq("status", "active")

        if (matchError) throw matchError

        const foundMatch = data?.find((m) => m.daily_room_url.includes(roomId))
        if (!foundMatch) {
          setError("Meeting not found")
          return
        }

        setMatch(foundMatch)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchMatch()
  }, [supabase, router, params.roomId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading meeting...</p>
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="p-8 bg-background border-border max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Meeting Not Found</h1>
          <p className="text-muted mb-6">{error || "Unable to load this meeting"}</p>
          <Button onClick={() => router.push("/dashboard")} className="bg-primary hover:bg-primary-dark text-white">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-screen flex flex-col"
      >
        {/* Header */}
        <div className="bg-foreground text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">HeartLink Video Call</h1>
            <p className="text-sm opacity-90">
              {new Date(match.meeting_date).toLocaleDateString()} at {match.meeting_time}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="bg-white text-foreground hover:bg-neutral-light"
          >
            Leave Call
          </Button>
        </div>

        {/* Video Container */}
        <div className="flex-1 bg-black flex items-center justify-center">
          <iframe
            src={match.daily_room_url}
            allow="camera; microphone; display-capture"
            className="w-full h-full border-0"
            title="Daily.co Video Call"
          />
        </div>
      </motion.div>
    </div>
  )
}
