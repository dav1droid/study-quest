# Study Quest

A pixel-styled study tracker with XP, leveling, shop backgrounds, and optional Supabase auth.

## Features
- Study timer, including Pomodoro toggle
- XP per minute: random 4–10 XP
- Lucky 25% chance: double session XP
- Jackpot 5% chance: +20 to +36 XP bonus
- Level-up rewards with coins
- Background shop for changing the study scene
- Local-first login with optional Supabase auth hooks

## Run locally
```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Optional Supabase setup
Create a `.env` file:
```bash
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then restart the dev server.

## Notes
This starter is built for quick local testing and can later be connected to a leaderboard database and real auth providers.
