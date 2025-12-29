# Mood Tracker

A modern, zero-scroll PWA for daily mood, workout, and alcohol tracking. Built with Next.js, Tailwind CSS, and Framer Motion for a smooth, responsive experience.

## Features

- **Daily Check-in** - Log your mood (Awful, Bad, Okay, Good, Great), workouts, and alcohol intake
- **Zero-Scroll Architecture** - Optimized mobile experience with no unnecessary scrolling
- **Smooth Animations** - Framer Motion-powered transitions for delightful interactions
- **History & Insights** - Track your data over time with visual progress indicators
- **Dark Mode** - Easy on the eyes with a carefully designed dark theme
- **Responsive Design** - Beautiful on mobile, tablet, and desktop
- **PWA Ready** - Works offline and installable on mobile devices

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **UI Components**: Custom-built with accessibility in mind

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mood-tracker.git
cd mood-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

```
src/
├── app/                    # Next.js app routes
│   ├── page.tsx           # Main tracker page
│   ├── chart/             # Chart/history page
│   └── insights/          # Insights/stats page
├── components/            # React components
│   ├── Dashboard.tsx      # Main layout
│   ├── TrackerForm.tsx    # Entry form
│   ├── MoodSelector.tsx   # Mood selection
│   ├── WorkoutLogger.tsx  # Workout tracker
│   ├── DrinkCounter.tsx   # Alcohol counter
│   └── Navigation.tsx     # Bottom navigation
├── types/                 # TypeScript types
└── utils/                 # Helper functions
```

## Development

### Building for Production

```bash
npm run build
npm start
```

### Code Style

This project uses ESLint and Prettier for code quality. Run:

```bash
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
