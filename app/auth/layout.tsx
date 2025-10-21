import type React from "react"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
