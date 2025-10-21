"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError

        if (user) {
          // Redirect to dashboard after successful confirmation
          router.push("/dashboard")
        } else {
          setError("No user found. Please try signing up again.")
        }
      } catch (err) {
        console.log("[v0] Auth callback error:", err)
        setError(err instanceof Error ? err.message : "An error occurred during authentication")
        setTimeout(() => router.push("/auth/login"), 3000)
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, supabase, router])

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <Card className="p-8 bg-background border-border text-center">
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-foreground">Confirming your email...</p>
        </Card>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <Card className="p-8 bg-background border-border">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Confirmation Error</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-muted text-sm">Redirecting to login...</p>
          </div>
        </Card>
      </motion.div>
    )
  }

  return null
}
