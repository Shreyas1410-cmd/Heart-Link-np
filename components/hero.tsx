"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-neutral-light to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Connect Across Generations
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-balance text-accent">
            HeartLink brings students and elderly individuals together for meaningful video conversations. Share
            stories, learn from experience, and build lasting connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary hover:bg-primary-dark text-white">
                Get Started
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { number: "500+", label: "Active Connections" },
            { number: "10k+", label: "Hours Shared" },
            { number: "98%", label: "Satisfaction Rate" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-accent">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
