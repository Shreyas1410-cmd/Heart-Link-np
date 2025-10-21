const DAILY_API_KEY = process.env.DAILY_API_KEY
const DAILY_DOMAIN = process.env.NEXT_PUBLIC_DAILY_DOMAIN

export async function createDailyRoom(roomName: string) {
  if (!DAILY_API_KEY) {
    throw new Error("DAILY_API_KEY is not configured")
  }

  const response = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      name: roomName,
      privacy: "private",
      properties: {
        enable_chat: true,
        enable_knocking: false,
        enable_screenshare: true,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to create Daily room: ${response.statusText}`)
  }

  const data = await response.json()
  return data.url
}

export function getDailyRoomUrl(roomName: string) {
  return `https://${DAILY_DOMAIN}.daily.co/${roomName}`
}
