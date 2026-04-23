# EGGxpert React + Convex

This project has been converted from a static HTML/JS prototype into a Vite-powered
React app with a Convex backend for live egg-price pins.

## Stack

- React 19
- Vite 8
- Leaflet + React Leaflet
- Convex

## Run it locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Convex and create a deployment:

   ```bash
   npm run convex:dev
   ```

3. Add your deployment URL to `.env.local`:

   ```bash
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   ```

4. Start the frontend:

   ```bash
   npm run dev
   ```

## Project structure

- `src/` contains the React UI.
- `convex/` contains the schema and backend functions.
- `src/App.jsx` keeps the original "click map, add egg price pin" flow, now backed by
  Convex mutations and live queries.

If `VITE_CONVEX_URL` is missing, the app still loads in a preview mode with demo pins
so you can verify the frontend before connecting Convex.
