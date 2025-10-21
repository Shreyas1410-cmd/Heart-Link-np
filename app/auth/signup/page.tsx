"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase"
import { motion } from "framer-motion"

export default function SignUp() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"student" | "elderly">("student")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            name,
            role,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            user_id: authData.user.id,
            email,
            name,
            role,
            created_at: new Date().toISOString(),
          },
        ])

        if (profileError) throw profileError

        setSignupSuccess(true)
      }
    } catch (err) {
      console.log("[v0] Signup error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  if (signupSuccess) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="p-8 bg-background border-border text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted">We've sent a confirmation link to:</p>
            <p className="font-medium text-foreground mt-2">{email}</p>
          </div>

          <div className="bg-neutral-light p-4 rounded-lg mb-6 text-left">
            <p className="text-sm text-foreground">
              Click the link in the email to confirm your account and start connecting with others on HeartLink.
            </p>
          </div>

          <p className="text-center text-muted text-sm">
            Didn't receive the email?{" "}
            <button onClick={() => setSignupSuccess(false)} className="text-primary hover:underline font-medium">
              Try again
            </button>
          </p>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="p-8 bg-background border-border">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Join HeartLink</h1>
          <p className="text-muted">Create an account to start connecting</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-neutral-light border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-neutral-light border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-neutral-light border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">I am a...</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === "student"}
                  onChange={(e) => setRole(e.target.value as "student" | "elderly")}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Student</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="elderly"
                  checked={role === "elderly"}
                  onChange={(e) => setRole(e.target.value as "student" | "elderly")}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Elderly</span>
              </label>
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

          <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark text-white">
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </Card>
    </motion.div>
  )
}
