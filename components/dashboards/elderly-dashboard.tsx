"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import type { Profile, Match } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

interface ElderlyDashboardProps {
  profile: Profile
}

export function ElderlyDashboard({ profile }: ElderlyDashboardProps) {
  const supabase = createClient()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data, error } = await supabase
          .from("matches")
          .select("*")
          .eq("elderly_id", profile.user_id)
          .eq("status", "active")

        if (error) throw error
        setMatches(data || [])
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [supabase, profile.user_id])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="p-6 bg-neutral-light border-border">
            <h3 className="text-sm font-medium text-foreground mb-2">Active Connections</h3>
            <p className="text-3xl font-bold text-primary">{matches.length}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="p-6 bg-neutral-light border-border">
            <h3 className="text-sm font-medium text-foreground mb-2">Upcoming Conversations</h3>
            <p className="text-3xl font-bold text-primary">
              {matches.filter((m) => new Date(m.meeting_date) > new Date()).length}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/schedule">
            <Card className="p-6 bg-accent text-white border-accent cursor-pointer hover:shadow-lg transition">
              <h3 className="text-sm font-medium mb-2 opacity-90">Share Availability</h3>
              <p className="text-3xl font-bold">+</p>
            </Card>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Conversations</h2>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-foreground">Loading your conversations...</p>
          </div>
        ) : matches.length === 0 ? (
          <Card className="p-12 bg-neutral-light border-border text-center">
            <p className="text-foreground mb-4">No active conversations yet</p>
            <Link href="/schedule">
              <Button className="bg-accent hover:bg-accent-light text-white">Share Your Availability</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-6 bg-background border-border hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">Conversation Scheduled</h3>
                      <p className="text-sm text-foreground">
                        {new Date(match.meeting_date).toLocaleDateString()} at {match.meeting_time}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">Active</span>
                  </div>
                  <a href={match.daily_room_url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-accent hover:bg-accent-light text-white">Join Conversation</Button>
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
