"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { Profile } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export default function Schedule() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single()

        if (error) throw error
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      if (!profile) throw new Error("Profile not found")

      // Insert scheduled meeting
      const { error: scheduleError } = await supabase.from("scheduled_meetings").insert([
        {
          user_id: profile.user_id,
          date,
          start_time: startTime,
          end_time: endTime,
        },
      ])

      if (scheduleError) throw scheduleError

      setSuccess(true)
      setDate("")
      setStartTime("")
      setEndTime("")

      // Trigger matching logic
      await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile.user_id, userRole: profile.role }),
      })

      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              ← Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Schedule Your Availability</h1>
            <p className="text-muted">
              {profile?.role === "student"
                ? "Tell us when you're available to connect with an elderly individual"
                : "Share your available times for conversations with students"}
            </p>
          </div>

          <Card className="p-8 bg-background border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="bg-neutral-light border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="bg-neutral-light border-border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                    className="bg-neutral-light border-border"
                  />
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                  Availability saved! Looking for matches... Redirecting to dashboard.
                </div>
              )}

              <Button
                type="submit"
                disabled={submitting || success}
                className={`w-full text-white ${
                  profile?.role === "student" ? "bg-primary hover:bg-primary-dark" : "bg-accent hover:bg-accent-light"
                }`}
              >
                {submitting ? "Saving..." : "Save Availability"}
              </Button>
            </form>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 p-6 bg-neutral-light rounded-lg border border-border"
          >
            <h3 className="font-semibold text-foreground mb-3">How Matching Works</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-primary">1.</span>
                <span>You share your available time slots</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">2.</span>
                <span>We find someone with overlapping availability</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">3.</span>
                <span>A video room is automatically created</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">4.</span>
                <span>You'll see the match in your dashboard</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
