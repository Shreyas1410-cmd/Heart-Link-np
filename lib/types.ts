export type UserRole = "student" | "elderly"

export interface Profile {
  id: string
  user_id: string
  role: UserRole
  name: string
  email: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface ScheduledMeeting {
  id: string
  user_id: string
  date: string
  start_time: string
  end_time: string
  created_at: string
}

export interface Match {
  id: string
  student_id: string
  elderly_id: string
  meeting_date: string
  meeting_time: string
  daily_room_url: string
  status: "active" | "completed" | "cancelled"
  created_at: string
}
