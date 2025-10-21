-- Simplified SQL script that will definitely work
-- Drop existing tables if they exist (for clean slate)
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS scheduled_meetings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'elderly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create scheduled_meetings table
CREATE TABLE scheduled_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  elderly_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_time TIMESTAMP WITH TIME ZONE NOT NULL,
  room_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for scheduled_meetings
CREATE POLICY "Users can view their own scheduled meetings" ON scheduled_meetings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scheduled meetings" ON scheduled_meetings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scheduled meetings" ON scheduled_meetings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scheduled meetings" ON scheduled_meetings FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for matches
CREATE POLICY "Users can view their own matches" ON matches FOR SELECT USING (auth.uid() = student_id OR auth.uid() = elderly_id);
CREATE POLICY "Users can insert matches" ON matches FOR INSERT WITH CHECK (auth.uid() = student_id OR auth.uid() = elderly_id);
CREATE POLICY "Users can update their own matches" ON matches FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = elderly_id);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_scheduled_meetings_user_id ON scheduled_meetings(user_id);
CREATE INDEX idx_matches_student_id ON matches(student_id);
CREATE INDEX idx_matches_elderly_id ON matches(elderly_id);
