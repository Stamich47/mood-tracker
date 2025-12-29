# Mood & Habit Tracker - Features

## Core Features

- **Mood Tracking** [DONE]
  - Daily entry on a scale of 1 - 5.
  - Visual representation: 1 (Almost Black) to 5 (Bright Green).
- **Workout Tracking** [DONE]
  - Log if a workout was completed that day.
  - List of specific exercises performed.
- **Alcohol Tracking** [DONE]
  - Log number of drinks (alcohol) consumed.
- **Yearly History Grid** [DONE]
  - GitHub-style grid showing every day of the year.
  - Color-coded based on mood.
  - Interactive: Click a day to view/edit details.
- **Historical Editing** [DONE]
  - Ability to go back and change data for any day of the year.
- **Home Page Layout** [DONE]
  - Combined view of history and daily entry.
- **Cross-Platform Sync** [DONE]
  - Backend storage to allow access from both mobile and desktop.
  - Supabase Auth and Database integration.
- **PWA (Progressive Web App)** [DONE]
  - "Installable" on mobile and desktop.
  - Offline capabilities.

## Technical Stack

- **Frontend**: Next.js (React), Tailwind CSS.
- **Backend**: Supabase (PostgreSQL & Auth).
- **Deployment**: Netlify.
- **PWA**: `next-pwa`.
