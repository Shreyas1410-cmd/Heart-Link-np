"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import type { Profile } from "@/lib/types"
import { motion } from "framer-motion"

interface DashboardHeaderProps {
  profile: Profile
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-background border-b border-border sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {profile.name}</h1>
          <p className="text-muted text-sm capitalize">
            {profile.role === "student" ? "Student" : "Elderly Individual"}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </motion.header>
  )
}
