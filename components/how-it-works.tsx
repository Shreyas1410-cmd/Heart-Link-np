"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Sign Up",
      description: "Create your account and tell us if you're a student or elderly individual",
    },
    {
      number: "2",
      title: "Set Your Availability",
      description: "Share your preferred times for conversations",
    },
    {
      number: "3",
      title: "Get Matched",
      description: "We automatically match you with a compatible partner",
    },
    {
      number: "4",
      title: "Connect",
      description: "Join video calls and start meaningful conversations",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">How It Works</h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Getting started with HeartLink is simple and takes just a few minutes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full bg-background border-border hover:shadow-lg transition">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted">{step.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
