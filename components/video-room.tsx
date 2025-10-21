"use client"

import { useEffect, useRef } from "react"

interface VideoRoomProps {
  roomUrl: string
  onLeave?: () => void
}

export function VideoRoom({ roomUrl, onLeave }: VideoRoomProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Handle Daily.co events
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === "left-meeting") {
        onLeave?.()
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onLeave])

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        src={roomUrl}
        allow="camera; microphone; display-capture; speaker"
        className="w-full h-full border-0"
        title="Video Call"
      />
    </div>
  )
}
