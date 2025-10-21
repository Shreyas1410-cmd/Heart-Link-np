"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import type { Profile } from "@/lib/types"
import { StudentDashboard } from "@/components/dashboards/student-dashboard"
import { ElderlyDashboard } from "@/components/dashboards/elderly-dashboard"
import { DashboardHeader } from "@/components/dashboards/dashboard-header"

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Unable to load profile</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader profile={profile} />
      {profile.role === "student" ? <StudentDashboard profile={profile} /> : <ElderlyDashboard profile={profile} />}
    </div>
  )
}
