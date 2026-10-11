# Broke But Functional — Money OS

A frontend-only React personal finance dashboard built for the FrontendArena hackathon challenge.

## Features
- ₹10,000 / 30-day budget dashboard
- Interactive expense logging with categories
- "What if?" spending simulator with before/after impact
- Daily allowance, savings goal, budget health and forecast
- Subscriptions and upcoming commitments
- Local persistence using `localStorage`
- Responsive layout for desktop and mobile
- No backend or API keys required; demo data is stored in the browser

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Deploy
- **Vercel:** Import the repository; framework preset `Vite`, build command `npm run build`, output directory `dist`.
- **Netlify:** Build command `npm run build`, publish directory `dist`.

This is a frontend prototype. Data is saved only in the current browser and is not synced between devices.
