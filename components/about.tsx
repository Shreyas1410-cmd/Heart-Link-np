"use client"

import { motion } from "framer-motion"

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Why HeartLink?</h2>
          <p className="text-lg max-w-2xl mx-auto text-accent">
            In a world where generations often feel disconnected, HeartLink creates bridges of understanding and
            compassion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-neutral-light p-8 rounded-lg border border-border"
          >
            <h3 className="text-2xl font-bold text-primary mb-4">For Students</h3>
            <ul className="space-y-3 text-foreground">
              <li className="flex gap-3">
                <span className="text-accent">✓</span>
                <span>Learn from real-world experience and wisdom</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">✓</span>
                <span>Build meaningful intergenerational relationships</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent">✓</span>
                <span>Gain mentorship and life guidance</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-neutral-light p-8 rounded-lg border border-border"
          >
            <h3 className="text-2xl font-bold text-accent mb-4">For Elderly</h3>
            <ul className="space-y-3 text-foreground">
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Stay connected with younger generations</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Share your stories and life experiences</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Combat loneliness with regular conversations</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
