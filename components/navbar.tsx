"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HL</span>
            </div>
            <span className="font-semibold text-lg hidden sm:inline">HeartLink</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#about" className="text-foreground hover:text-primary transition">
              About
            </Link>
            <Link href="#how-it-works" className="text-foreground hover:text-primary transition">
              How It Works
            </Link>
            <Link href="#contact" className="text-foreground hover:text-primary transition">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary hover:bg-primary-dark text-white">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
