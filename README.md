# HeartLink - Connect Generations

HeartLink is a platform that connects students and elderly individuals for meaningful video conversations. The app facilitates intergenerational connections through scheduled meetings and automatic matching.

## Features

- **User Authentication**: Email/password signup with role selection (Student or Elderly)
- **Role-Based Dashboards**: Customized views for students and elderly users
- **Scheduling System**: Users can set their availability for conversations
- **Automatic Matching**: The system automatically matches users with overlapping availability
- **Video Integration**: Seamless video calls powered by Daily.co
- **Real-time Updates**: Live dashboard updates with upcoming meetings

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Video**: Daily.co
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Daily.co account

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables by creating a `.env.local` file:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=https://dfwptsakuktvpxkgojfi.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   DAILY_API_KEY=your_daily_api_key
   NEXT_PUBLIC_DAILY_DOMAIN=uhv.daily.co
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
app/
├── api/                    # API routes
│   ├── auth/              # Authentication endpoints
│   ├── schedule/          # Scheduling endpoints
│   ├── match/             # Matching logic
│   ├── profiles/          # Profile management
│   └── matches/           # Match retrieval
├── auth/                  # Authentication pages
│   ├── login/
│   └── signup/
├── dashboard/             # User dashboard
├── schedule/              # Scheduling page
├── meeting/               # Video meeting page
└── layout.tsx             # Root layout

components/
├── dashboards/            # Dashboard components
├── ui/                    # shadcn/ui components
├── navbar.tsx             # Navigation bar
├── hero.tsx               # Hero section
├── about.tsx              # About section
├── how-it-works.tsx       # How it works section
└── footer.tsx             # Footer

lib/
├── supabase.ts            # Supabase client setup
├── daily.ts               # Daily.co utilities
└── types.ts               # TypeScript types
\`\`\`

## Database Schema

### profiles
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `role`: 'student' | 'elderly'
- `name`: String
- `email`: String
- `bio`: String (Optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### scheduled_meetings
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to profiles)
- `date`: Date
- `start_time`: Time
- `end_time`: Time
- `created_at`: Timestamp

### matches
- `id`: UUID (Primary Key)
- `student_id`: UUID (Foreign Key to profiles)
- `elderly_id`: UUID (Foreign Key to profiles)
- `meeting_date`: Date
- `meeting_time`: Time
- `daily_room_url`: String
- `status`: 'active' | 'completed' | 'cancelled'
- `created_at`: Timestamp

## API Endpoints

### Authentication
- `POST /api/auth` - Get current user
- `POST /api/auth` - Logout

### Profiles
- `GET /api/profiles?userId=<id>` - Get user profile
- `PUT /api/profiles` - Update user profile

### Scheduling
- `GET /api/schedule?userId=<id>` - Get user schedules
- `POST /api/schedule` - Create new schedule

### Matching
- `POST /api/match` - Trigger matching algorithm
- `GET /api/matches?userId=<id>&status=active` - Get user matches
- `PUT /api/matches` - Update match status

### Meetings
- `GET /api/meeting?matchId=<id>` - Get meeting details
- `PUT /api/meeting` - Update meeting status

## How It Works

1. **Sign Up**: Users create an account and select their role (Student or Elderly)
2. **Set Availability**: Users share their preferred times for conversations
3. **Automatic Matching**: The system finds compatible partners with overlapping availability
4. **Video Call**: A Daily.co room is created and users can join the video call
5. **Connection**: Users can have meaningful conversations and build relationships

## Security

- Row Level Security (RLS) is enabled on all Supabase tables
- Authentication is required for all protected routes
- User data is isolated by user ID
- API endpoints verify user authorization

## Deployment

The app can be deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
